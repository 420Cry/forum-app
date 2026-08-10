#!/usr/bin/env bash
# Resolve a sibling-repo git ref for CI: prefer $BRANCH when it exists, else fallback.
# Usage: resolve-sibling-ref.sh <owner/repo> <branch> [fallback=main]
# Prints the chosen ref name to stdout.
set -euo pipefail

REPO="${1:?owner/repo required}"
BRANCH="${2:?branch required}"
FALLBACK="${3:-main}"

if [[ -z "${GH_TOKEN:-}${GITHUB_TOKEN:-}" ]]; then
  echo "Error: GH_TOKEN or GITHUB_TOKEN required to resolve ${REPO}@${BRANCH}" >&2
  exit 1
fi

# Prefer the branch API (handles slashes better than git/ref/heads/...).
if gh api "repos/${REPO}/branches/${BRANCH}" --silent >/dev/null 2>&1; then
  echo "${BRANCH}"
  exit 0
fi

echo "${FALLBACK}"
