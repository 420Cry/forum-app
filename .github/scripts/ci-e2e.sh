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

FORUM_PROJECTS_ROOT="$ROOT" bash "${SCRIPT_DIR}/ci-env-sync.sh"

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

E2E_DIR="${ROOT}/forum-test-automation"
if [[ ! -f "${E2E_DIR}/.env" ]]; then
  cp "${E2E_DIR}/.env.example" "${E2E_DIR}/.env"
fi

mkdir -p "${E2E_DIR}/playwright/.auth"

(
  cd "$E2E_DIR"
  bun run playwright:test
)

if [[ -f "${E2E_DIR}/scripts/report-e2e-summary.mjs" ]]; then
  node "${E2E_DIR}/scripts/report-e2e-summary.mjs" \
    >> "${GITHUB_STEP_SUMMARY:-/dev/stdout}" 2>/dev/null || true
fi
