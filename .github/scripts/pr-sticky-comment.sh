#!/usr/bin/env bash
# Create or update a single PR comment identified by a hidden marker, so repeated
# CI runs edit one comment instead of appending a new one each time.
#
# Usage: pr-sticky-comment.sh <marker> <body-file> <pr-number>
# Requires: GH_TOKEN with pull-requests: write, GITHUB_REPOSITORY.
set -euo pipefail

MARKER="${1:?marker (e.g. <!-- e2e-report -->)}"
BODY_FILE="${2:?path to markdown body}"
PR_NUMBER="${3:?pull request number}"
REPO="${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is required}"

BODY="$(printf '%s\n\n%s\n' "$MARKER" "$(cat "$BODY_FILE")")"

existing_id="$(
  gh api "repos/${REPO}/issues/${PR_NUMBER}/comments" --paginate \
    | jq -r --arg marker "$MARKER" \
        '[.[] | select(.body | contains($marker)) | .id] | first // empty'
)"

if [[ -n "$existing_id" ]]; then
  jq -n --arg body "$BODY" '{body: $body}' \
    | gh api -X PATCH "repos/${REPO}/issues/comments/${existing_id}" --input - >/dev/null
  echo "Updated PR comment ${existing_id}"
else
  jq -n --arg body "$BODY" '{body: $body}' \
    | gh api -X POST "repos/${REPO}/issues/${PR_NUMBER}/comments" --input - >/dev/null
  echo "Created PR comment on #${PR_NUMBER}"
fi
