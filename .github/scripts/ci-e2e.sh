#!/usr/bin/env bash
# Boot local forum stack on CI and run Playwright e2e against the PR forum-app.
set -euo pipefail

ROOT="${FORUM_PROJECTS_ROOT:?Set FORUM_PROJECTS_ROOT to the parent of forum-* repos}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SERVER_DIR="${FORUM_SERVER_DIR:-${ROOT}/forum-server}"
export PROJECTS_DIRECTORY="$ROOT"

echo "Forum CI e2e — projects root: ${ROOT}"

for repo in forum-api forum-app forum-test-automation forum-server; do
  if [[ ! -d "${ROOT}/${repo}" ]]; then
    echo "Error: missing ${ROOT}/${repo}"
    exit 1
  fi
done

echo "127.0.0.1 app.forum.test api.forum.test supabase.forum.test mail.forum.test" \
  | sudo tee -a /etc/hosts >/dev/null

docker network create forum.test 2>/dev/null || true

for project in forum-api forum-app; do
  for file in .env .env.local; do
    example="${ROOT}/${project}/${file}.example"
    target="${ROOT}/${project}/${file}"
    if [[ -f "$example" && ! -f "$target" ]]; then
      cp "$example" "$target"
    fi
  done
  local_example="${ROOT}/${project}/.env.local.example"
  if [[ -f "$local_example" && ! -f "${ROOT}/${project}/.env.local" ]]; then
    cp "$local_example" "${ROOT}/${project}/.env.local"
  fi
done

echo "Starting Supabase..."
(cd "${ROOT}/forum-api" && supabase start --ignore-health-check)

echo "Waiting for Supabase API on host :54321..."
for _ in $(seq 1 60); do
  # Kong root may 404; any HTTP response means the gateway is up (000 = connection failed).
  code=$(curl -s -o /dev/null -w '%{http_code}' --connect-timeout 2 --max-time 3 \
    http://127.0.0.1:54321/ 2>/dev/null || echo "000")
  if [[ "$code" != "000" ]]; then
    break
  fi
  sleep 3
done
code=$(curl -s -o /dev/null -w '%{http_code}' --connect-timeout 2 --max-time 3 \
  http://127.0.0.1:54321/ 2>/dev/null || echo "000")
if [[ "$code" == "000" ]]; then
  echo "Error: Supabase API never became reachable on 127.0.0.1:54321"
  (cd "${ROOT}/forum-api" && supabase status) || true
  exit 1
fi
echo "Supabase host API ready (HTTP ${code})"

FORUM_PROJECTS_ROOT="$ROOT" bash "${SCRIPT_DIR}/ci-env-sync.sh"

# Linux CI: Supabase publishes Kong on 127.0.0.1:54321 only. nginx/forum-api cannot
# reach that via host.docker.internal (Docker Desktop Mac can; GHA Linux cannot).
# Attach Kong to the shared network and talk to it by container name instead.
KONG_CONTAINER="${SUPABASE_KONG_CONTAINER:-supabase_kong_forum-api}"
if ! docker inspect "$KONG_CONTAINER" >/dev/null 2>&1; then
  echo "Error: expected Kong container '${KONG_CONTAINER}' after supabase start"
  docker ps -a --format '{{.Names}}' | grep -Ei 'supabase|kong' || true
  exit 1
fi
docker network connect forum.test "$KONG_CONTAINER" 2>/dev/null || true

PROXY_TEMPLATE="${SERVER_DIR}/docker/proxy/nginx-templates/proxy.conf.template"
if [[ -f "$PROXY_TEMPLATE" ]]; then
  sed -i 's/host\.docker\.internal:54321/supabase_kong_forum-api:8000/' "$PROXY_TEMPLATE"
fi

# forum-api verifyToken() calls GoTrue; use the same in-network Kong URL.
python3 - "${ROOT}/forum-api/.env.local" <<'PY'
import re
import sys
from pathlib import Path

path = Path(sys.argv[1])
lines = path.read_text(encoding="utf-8").splitlines(keepends=True) if path.exists() else []
key, value = "SUPABASE_URL", "http://supabase_kong_forum-api:8000"
pattern = re.compile(rf"^{re.escape(key)}=")
out, updated = [], False
for line in lines:
    if pattern.match(line):
        out.append(f"{key}={value}\n")
        updated = True
    else:
        out.append(line if line.endswith("\n") else f"{line}\n")
if not updated:
    out.append(f"{key}={value}\n")
path.write_text("".join(out), encoding="utf-8")
print(f"Set {key}={value} in {path}")
PY

echo "Running migrations and seed..."
(
  cd "${ROOT}/forum-api"
  export DB_HOST=127.0.0.1
  export DB_PORT=54322
  bun run migration:run
  bun run seed
)

echo "Starting proxy + app + api..."
docker compose -f "${SERVER_DIR}/docker-compose.yaml" up -d
docker compose -f "${ROOT}/forum-api/docker-compose.dev.yml" up -d --build
docker compose -f "${ROOT}/forum-app/docker-compose.dev.yml" up -d --build

echo "Waiting for Forum API..."
for _ in $(seq 1 60); do
  if curl -sf --max-time 3 http://api.forum.test/health >/dev/null 2>&1; then
    break
  fi
  sleep 3
done
curl -sf http://api.forum.test/health >/dev/null || {
  echo "Error: API never became healthy"
  docker logs forum-api --tail 80 || true
  exit 1
}

echo "Waiting for Forum app..."
for _ in $(seq 1 60); do
  if curl -sf --max-time 3 http://app.forum.test/en/auth/login >/dev/null 2>&1; then
    break
  fi
  sleep 3
done
curl -sf http://app.forum.test/en/auth/login >/dev/null || {
  echo "Error: app never became reachable"
  docker logs forum-app --tail 80 || true
  exit 1
}

# Browser + Playwright helpers use http://supabase.forum.test via the nginx → Kong path.
echo "Waiting for Supabase via proxy (supabase.forum.test)..."
ANON_KEY="$(
  cd "${ROOT}/forum-api"
  supabase status --output json \
    | python3 -c 'import json,sys; print(json.load(sys.stdin)["ANON_KEY"])'
)"
for _ in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w '%{http_code}' --connect-timeout 2 --max-time 5 \
    -H "apikey: ${ANON_KEY}" \
    http://supabase.forum.test/auth/v1/health 2>/dev/null || echo "000")
  if [[ "$code" == "200" ]]; then
    break
  fi
  sleep 3
done
code=$(curl -s -o /dev/null -w '%{http_code}' --connect-timeout 2 --max-time 5 \
  -H "apikey: ${ANON_KEY}" \
  http://supabase.forum.test/auth/v1/health 2>/dev/null || echo "000")
if [[ "$code" != "200" ]]; then
  echo "Error: supabase.forum.test/auth/v1/health never returned 200 (got ${code})"
  echo "--- proxy logs ---"
  docker logs forum-server-proxy-1 --tail 40 2>/dev/null \
    || docker logs "$(docker ps -qf name=proxy | head -1)" --tail 40 || true
  echo "--- kong on forum.test ---"
  docker inspect "$KONG_CONTAINER" --format '{{json .NetworkSettings.Networks}}' || true
  echo "--- host supabase ---"
  curl -sv --max-time 3 http://127.0.0.1:54321/auth/v1/health \
    -H "apikey: ${ANON_KEY}" || true
  exit 1
fi
echo "Supabase proxy auth ready (HTTP ${code})"

E2E_DIR="${ROOT}/forum-test-automation"
if [[ ! -f "${E2E_DIR}/.env" ]]; then
  cp "${E2E_DIR}/.env.example" "${E2E_DIR}/.env"
fi
if [[ -f "${E2E_DIR}/.env.local.example" && ! -f "${E2E_DIR}/.env.local" ]]; then
  cp "${E2E_DIR}/.env.local.example" "${E2E_DIR}/.env.local"
fi

mkdir -p "${E2E_DIR}/playwright/.auth"

(
  cd "$E2E_DIR"
  bun run playwright:test
)

SUMMARY_SCRIPT="${ROOT}/forum-app/.github/scripts/report-e2e-summary.mjs"
RESULTS_JSON="${E2E_DIR}/playwright-report/results.json"
if [[ -f "${SUMMARY_SCRIPT}" ]]; then
  node "${SUMMARY_SCRIPT}" "${RESULTS_JSON}" \
    >> "${GITHUB_STEP_SUMMARY:-/dev/stdout}" 2>/dev/null || true
fi
