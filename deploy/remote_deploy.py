#!/usr/bin/env python3
"""Deploy Health Hub to Digital Ocean via SSH/SFTP."""
import os
import sys
import stat
import getpass
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "168.144.16.54")
USER = os.environ.get("DEPLOY_USER", "root")
PASSWORD = os.environ.get("DEPLOY_PASSWORD") or (sys.argv[1] if len(sys.argv) > 1 else getpass.getpass("Password: "))
PROJECT = os.environ.get("PROJECT_DIR", os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

LOCAL_DIST = os.path.join(PROJECT, "dist")
LOCAL_SERVER = os.path.join(PROJECT, "server")
REMOTE_WEB = "/var/www/kundankrishna/healthhub"
REMOTE_APP = "/opt/health-hub"


def upload_dir(sftp, local, remote):
    for root, dirs, files in os.walk(local):
        rel = os.path.relpath(root, local).replace("\\", "/")
        remote_dir = remote if rel == "." else f"{remote}/{rel}"
        try:
            sftp.stat(remote_dir)
        except FileNotFoundError:
            parts = remote_dir.strip("/").split("/")
            path = ""
            for part in parts:
                path += f"/{part}"
                try:
                    sftp.stat(path)
                except FileNotFoundError:
                    sftp.mkdir(path)
        for f in files:
            if f == ".env":
                continue
            lp = os.path.join(root, f)
            rp = f"{remote_dir}/{f}"
            print(f"  upload {rp}")
            sftp.put(lp, rp)


def run(client, cmd, check=True):
    print(f"\n>>> {cmd[:120]}{'...' if len(cmd) > 120 else ''}")
    _, stdout, stderr = client.exec_command(cmd, get_pty=True)
    out = stdout.read().decode(errors="replace")
    err = stderr.read().decode(errors="replace")
    code = stdout.channel.recv_exit_status()
    if out.strip():
        print(out.rstrip().encode('ascii', errors='replace').decode('ascii'))
    if err.strip() and code != 0:
        print(err.rstrip(), file=sys.stderr)
    if check and code != 0:
        raise RuntimeError(f"Command failed ({code}): {cmd[:80]}")
    return out


def main():
    if not os.path.isdir(LOCAL_DIST):
        print("Building frontend first...")
        os.chdir(PROJECT)
        os.system("npm ci")
        os.system("npm run build")

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    print(f"Connecting to {USER}@{HOST}...")
    client.connect(HOST, username=USER, password=PASSWORD, timeout=30)
    sftp = client.open_sftp()

    # Upload deploy scripts
    deploy_dir = os.path.join(PROJECT, "deploy")
    run(client, "mkdir -p /tmp/healthhub-deploy")
    for name in ["setup-server.sh", "nginx-healthhub.conf", "nginx-kundankrishna.tech.conf", "health-hub-api.service"]:
        local = os.path.join(deploy_dir, name)
        if os.path.isfile(local):
            sftp.put(local, f"/tmp/healthhub-deploy/{name}")

    # Lightweight server prep (skip full setup-server.sh on redeploy)
    setup_script = r"""
export DEBIAN_FRONTEND=noninteractive
mkdir -p /opt/health-hub/server /var/www/kundankrishna/healthhub /var/www/kundankrishna/html

if [ ! -f /opt/health-hub/server.env ]; then
  bash /tmp/healthhub-deploy/setup-server.sh
else
  cp /tmp/healthhub-deploy/nginx-healthhub.conf /etc/nginx/snippets/healthhub.conf
  cp /tmp/healthhub-deploy/health-hub-api.service /etc/systemd/system/health-hub-api.service
  cp /opt/health-hub/server.env /opt/health-hub/server/.env
  systemctl daemon-reload
  nginx -t && systemctl reload nginx
fi

echo SETUP_DONE
"""
    run(client, setup_script, check=False)

    # Upload app files
    print("\n==> Uploading frontend...")
    run(client, f"rm -rf {REMOTE_WEB} && mkdir -p {REMOTE_WEB}")
    upload_dir(sftp, LOCAL_DIST, REMOTE_WEB)

    print("\n==> Uploading backend...")
    run(client, f"mkdir -p {REMOTE_APP}/server")
    upload_dir(sftp, LOCAL_SERVER, f"{REMOTE_APP}/server")
    sftp.put(os.path.join(PROJECT, "package.json"), f"{REMOTE_APP}/package.json")
    sftp.put(os.path.join(PROJECT, "package-lock.json"), f"{REMOTE_APP}/package-lock.json")

    # Ensure server/.env exists
    run(client, f"""
if [ -f /opt/health-hub/server.env ] && [ ! -f /opt/health-hub/server/.env ]; then
  cp /opt/health-hub/server.env /opt/health-hub/server/.env
fi
cd {REMOTE_APP}
npm ci --omit=dev
chown -R www-data:www-data {REMOTE_APP} /var/www/kundankrishna
systemctl restart health-hub-api
sleep 2
systemctl is-active health-hub-api
curl -sf http://127.0.0.1:4000/api/health
nginx -t && systemctl reload nginx
echo DEPLOY_DONE
""")

    sftp.close()
    client.close()
    print("\nDeploy complete: http://kundankrishna.tech/healthhub (https after certbot)")


if __name__ == "__main__":
    main()
