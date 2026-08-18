import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

SERVICE_CONTENT = """[Unit]
Description=AI English Mentor FastAPI Backend
After=network.target

[Service]
User=root
WorkingDirectory=/var/www/tuananhstudio/backend
ExecStart=/var/www/tuananhstudio/venv/bin/python3 -m uvicorn main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
"""

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    print("Connecting to VPS...")
    ssh.connect('103.15.222.216', username='root', password='Tuananh2026')
    print("Connected.")

    # 1. Write service file
    sftp = ssh.open_sftp()
    with sftp.file('/etc/systemd/system/tuananhstudio-backend.service', 'w') as f:
        f.write(SERVICE_CONTENT)
    sftp.close()

    # 2. Run systemctl commands
    cmds = [
        "cd /var/www/tuananhstudio && git fetch --all && git reset --hard origin/main",
        "rm -rf /var/www/tuananhstudio/frontend/dist && mkdir -p /var/www/tuananhstudio/frontend/dist && unzip -o /var/www/tuananhstudio/frontend/dist.zip -d /var/www/tuananhstudio/frontend/dist",
        "rm -rf /var/www/tuananhstudio/dist && mkdir -p /var/www/tuananhstudio/dist && unzip -o /var/www/tuananhstudio/frontend/dist.zip -d /var/www/tuananhstudio/dist",
        "systemctl daemon-reload",
        "systemctl enable tuananhstudio-backend",
        "systemctl restart tuananhstudio-backend",
        "systemctl restart nginx",
        "sleep 2",
        "systemctl is-active tuananhstudio-backend",
        "curl -s http://127.0.0.1:8000/api/health"
    ]

    for cmd in cmds:
        print(f">> {cmd}")
        stdin, stdout, stderr = ssh.exec_command(cmd, timeout=30)
        out = stdout.read().decode('utf-8', errors='replace').strip()
        if out:
            print("OUT:", out)

    ssh.close()
    print("ALL DONE!")

if __name__ == "__main__":
    main()
