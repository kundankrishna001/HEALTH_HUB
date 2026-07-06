#!/usr/bin/env bash
set -euo pipefail

# Deploy Health Hub to Digital Ocean from your dev machine (Git Bash / WSL / macOS / Linux)
# Usage: ./deploy/deploy.sh [user@host]
# Example: ./deploy/deploy.sh root@168.144.16.54

REMOTE="${1:-root@168.144.16.54}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
SSH_KEY="${DEPLOY_SSH_KEY:-${SCRIPT_DIR}/do_deploy_key}"

SSH_OPTS=(-o StrictHostKeyChecking=accept-new)
if [[ -f "${SSH_KEY}" ]]; then
  SSH_OPTS+=(-i "${SSH_KEY}")
fi

echo "==> Building frontend..."
cd "${PROJECT_DIR}"
npm ci
npm run build

echo "==> Syncing files to ${REMOTE}..."
ssh "${SSH_OPTS[@]}" "${REMOTE}" "mkdir -p /opt/health-hub /var/www/kundankrishna/healthhub"

rsync -avz --delete -e "ssh ${SSH_OPTS[*]}" \
  "${PROJECT_DIR}/dist/" "${REMOTE}:/var/www/kundankrishna/healthhub/"

rsync -avz -e "ssh ${SSH_OPTS[*]}" \
  --exclude node_modules \
  --exclude .env \
  "${PROJECT_DIR}/server/" "${REMOTE}:/opt/health-hub/server/"

rsync -avz -e "ssh ${SSH_OPTS[*]}" \
  "${PROJECT_DIR}/package.json" "${PROJECT_DIR}/package-lock.json" \
  "${REMOTE}:/opt/health-hub/"

echo "==> Installing server dependencies and restarting API..."
ssh "${SSH_OPTS[@]}" "${REMOTE}" bash -s <<'REMOTE_SCRIPT'
set -euo pipefail
cd /opt/health-hub
npm ci --omit=dev
chown -R www-data:www-data /opt/health-hub /var/www/kundankrishna/healthhub
systemctl restart health-hub-api
systemctl reload nginx
echo "API status:"
systemctl is-active health-hub-api
curl -sf http://127.0.0.1:4000/api/health && echo ""
REMOTE_SCRIPT

echo ""
echo "Deploy complete: https://kundankrishna.tech/healthhub"
