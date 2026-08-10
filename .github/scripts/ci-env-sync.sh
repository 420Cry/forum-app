#!/usr/bin/env bash
set -euo pipefail

ROOT="${FORUM_PROJECTS_ROOT:?Set FORUM_PROJECTS_ROOT}"
API_ENV="${ROOT}/forum-api/.env.local"
APP_ENV="${ROOT}/forum-app/.env.local"
STATUS_FILE="$(mktemp)"

cleanup() {
  rm -f "$STATUS_FILE"
}
trap cleanup EXIT

(cd "${ROOT}/forum-api" && supabase status --output json >"$STATUS_FILE")

python3 - "$STATUS_FILE" "$API_ENV" "$APP_ENV" <<'PY'
import json
import re
import sys

status_path, api_env_path, app_env_path = sys.argv[1:4]

with open(status_path, encoding="utf-8") as handle:
    status = json.load(handle)

anon_key = status["ANON_KEY"]
service_role_key = status["SERVICE_ROLE_KEY"]


def set_var(path: str, key: str, value: str) -> None:
    try:
        with open(path, encoding="utf-8") as handle:
            lines = handle.readlines()
    except FileNotFoundError:
        lines = []

    pattern = re.compile(rf"^{re.escape(key)}=")
    updated = False
    output = []

    for line in lines:
        if pattern.match(line):
            output.append(f"{key}={value}\n")
            updated = True
        else:
            output.append(line)

    if not updated:
        output.append(f"{key}={value}\n")

    with open(path, "w", encoding="utf-8") as handle:
        handle.writelines(output)


set_var(api_env_path, "SUPABASE_SERVICE_ROLE_KEY", service_role_key)
set_var(app_env_path, "NUXT_PUBLIC_SUPABASE_KEY", anon_key)
print(f"Synced Supabase keys into {api_env_path} and {app_env_path}")
PY
