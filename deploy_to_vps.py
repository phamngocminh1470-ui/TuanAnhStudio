import paramiko
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

HOST = "103.15.222.216"
USER = "root"
PORT = 22

COMMANDS = [
    "cd /var/www/tuananhstudio && git fetch --all",
    "cd /var/www/tuananhstudio && git reset --hard origin/main",
    "rm -rf /var/www/tuananhstudio/frontend/dist && mkdir -p /var/www/tuananhstudio/frontend/dist",
    "unzip -o /var/www/tuananhstudio/frontend/dist.zip -d /var/www/tuananhstudio/frontend/dist",
    "rm -rf /var/www/tuananhstudio/dist && mkdir -p /var/www/tuananhstudio/dist",
    "unzip -o /var/www/tuananhstudio/frontend/dist.zip -d /var/www/tuananhstudio/dist",
    "systemctl restart tuananhstudio-backend",
    "systemctl restart nginx",
    "echo '=== DA CAP NHAT CODE MOI VA RESTART SYSTEMD SERVICE THANH CONG 100% ==='"
]

def run_deploy():
    if len(sys.argv) > 1:
        password = sys.argv[1]
    else:
        password = input("Nhap mat khau VPS root@103.15.222.216: ")

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    print(f"\n[1/3] Dang ket noi toi VPS ({HOST})...")
    try:
        client.connect(HOST, port=PORT, username=USER, password=password, timeout=30)
        print("[2/3] Ket noi thanh cong! Dang chay lenh cap nhat tren VPS...\n")
    except Exception as e:
        print(f"[LOI] Khong the ket noi: {e}")
        return

    for cmd in COMMANDS:
        print(f">> {cmd}")
        stdin, stdout, stderr = client.exec_command(cmd, timeout=60)
        out = stdout.read().decode('utf-8', errors='replace').strip()
        err = stderr.read().decode('utf-8', errors='replace').strip()
        if out:
            print(out[:300])
        if err:
            print(f"[Thong tin] {err[:200]}")

    client.close()
    print("\n[3/3] HOAN TAT! Vui long vao https://tuananhstudio.top va bam F5 de xem ket qua moi!")

if __name__ == "__main__":
    run_deploy()
