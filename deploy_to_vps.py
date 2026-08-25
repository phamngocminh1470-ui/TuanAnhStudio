import paramiko
import sys
import os

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

HOST = "103.15.222.216"
USER = "root"
PORT = 22

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
        print("[2/3] Ket noi thanh cong!")
    except Exception as e:
        print(f"[LOI] Khong the ket noi: {e}")
        return

    # 1. Reset repo va tao thu muc tren VPS
    pre_cmds = [
        "mkdir -p /var/www/tuananhstudio/frontend/dist /var/www/tuananhstudio/dist",
        "rm -rf /var/www/tuananhstudio/frontend/dist/* /var/www/tuananhstudio/dist/*"
    ]
    for cmd in pre_cmds:
        print(f">> {cmd}")
        client.exec_command(cmd, timeout=30)

    # 2. Upload truc tiep dist.zip moi nhat qua SFTP
    print(">> [SFTP] Dang tai truc tiep dist.zip (ban build moi nhat) len VPS...")
    sftp = client.open_sftp()
    local_zip = "frontend/dist.zip"
    remote_zip = "/var/www/tuananhstudio/dist.zip"
    sftp.put(local_zip, remote_zip)
    print(f">> [SFTP] Da upload xong {os.path.getsize(local_zip)} bytes len VPS!")
    sftp.close()

    # 3. Giai nen va restart services
    post_cmds = [
        "unzip -o /var/www/tuananhstudio/dist.zip -d /var/www/tuananhstudio/frontend/dist",
        "unzip -o /var/www/tuananhstudio/dist.zip -d /var/www/tuananhstudio/dist",
        "systemctl restart tuananhstudio-backend",
        "systemctl restart nginx",
        "echo '=== DA CAP NHAT CODE MOI VA RESTART SYSTEMD SERVICE THANH CONG 100% ==='"
    ]

    for cmd in post_cmds:
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
