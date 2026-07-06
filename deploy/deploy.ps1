# Deploy Health Hub to Digital Ocean (Windows PowerShell)
# Usage: .\deploy\deploy.ps1 [-Remote root@168.144.16.54] [-SshKey path\to\key]

param(
    [string]$Remote = "root@168.144.16.54",
    [string]$SshKey = ""
)

$ErrorActionPreference = "Stop"
$ProjectDir = Split-Path $PSScriptRoot -Parent

$sshArgs = @("-o", "StrictHostKeyChecking=accept-new")
if ($SshKey -and (Test-Path $SshKey)) {
    $sshArgs += @("-i", $SshKey)
}

Write-Host "==> Building frontend..."
Push-Location $ProjectDir
npm ci
npm run build
Pop-Location

$serverPath = Join-Path $ProjectDir "server"

Write-Host "==> Syncing to $Remote..."
ssh @sshArgs $Remote "mkdir -p /opt/health-hub/server /var/www/kundankrishna/healthhub"
scp @sshArgs -r (Join-Path $ProjectDir "dist\*") "${Remote}:/var/www/kundankrishna/healthhub/"
scp @sshArgs -r "$serverPath\*" "${Remote}:/opt/health-hub/server/"
scp @sshArgs (Join-Path $ProjectDir "package.json") (Join-Path $ProjectDir "package-lock.json") "${Remote}:/opt/health-hub/"

Write-Host "==> Installing dependencies and restarting..."
$remoteScript = @'
set -e
cd /opt/health-hub
npm ci --omit=dev
chown -R www-data:www-data /opt/health-hub /var/www/kundankrishna/healthhub
systemctl restart health-hub-api
systemctl reload nginx
systemctl is-active health-hub-api
curl -sf http://127.0.0.1:4000/api/health
'@
ssh @sshArgs $Remote $remoteScript

Write-Host ""
Write-Host "Deploy complete: https://kundankrishna.tech/healthhub"
