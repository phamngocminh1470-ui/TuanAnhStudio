import os
import sys
import zipfile
import paramiko
import requests

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

HOST = "103.15.222.216"
USER = "root"
PASSWORD = "Tuananh2026"
PORT = 22

def make_dist_zip():
    print("[1/5] Dang tao goi dist.zip tu frontend/dist/...")
    dist_dir = os.path.join("frontend", "dist")
    zip_path = os.path.join("frontend", "dist.zip")
    
    if not os.path.exists(dist_dir):
        print(f"[LOI] Thu muc {dist_dir} khong ton tai! Vui long build truoc.")
        return False
        
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(dist_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, dist_dir)
                zipf.write(file_path, arcname)
                
    size_mb = os.path.getsize(zip_path) / (1024 * 1024)
    print(f">> Da tao xong {zip_path} ({size_mb:.2f} MB)")
    return True

def deploy():
    if not make_dist_zip():
        return

    print(f"\n[2/5] Dang ket noi SSH toi VPS ({HOST})...")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(HOST, port=PORT, username=USER, password=PASSWORD, timeout=30)
        print(">> Ket noi SSH thanh cong!")
    except Exception as e:
        print(f"[LOI] Khong the ket noi SSH: {e}")
        return

    print("\n[3/5] Don dep thu muc frontend cu tren VPS...")
    pre_cmds = [
        "mkdir -p /var/www/tuananhstudio/frontend/dist /var/www/tuananhstudio/dist",
        "rm -rf /var/www/tuananhstudio/frontend/dist/* /var/www/tuananhstudio/dist/*"
    ]
    for cmd in pre_cmds:
        stdin, stdout, stderr = client.exec_command(cmd, timeout=30)
        stdout.read()

    print("\n[4/5] Uploading dist.zip va backend code qua SFTP...")
    sftp = client.open_sftp()
    local_zip = os.path.join("frontend", "dist.zip")
    remote_zip = "/var/www/tuananhstudio/dist.zip"
    sftp.put(local_zip, remote_zip)
    print(f">> Da upload {local_zip} -> {remote_zip} thanh cong!")

    # Upload backend code neu co thay doi
    backend_dir = "backend"
    for b_file in ["ai_services.py", "main.py", "database.py"]:
        local_b = os.path.join(backend_dir, b_file)
        if os.path.exists(local_b):
            try:
                sftp.put(local_b, f"/var/www/tuananhstudio/backend/{b_file}")
                print(f">> Da upload backend/{b_file} len VPS!")
            except Exception as be:
                print(f">> Khong the upload {b_file}: {be}")
    sftp.close()

    print("\n[5/5] Giai nen frontend dist va khoi dong lai dich vu...")
    post_cmds = [
        "unzip -o /var/www/tuananhstudio/dist.zip -d /var/www/tuananhstudio/frontend/dist",
        "unzip -o /var/www/tuananhstudio/dist.zip -d /var/www/tuananhstudio/dist",
        "systemctl restart tuananhstudio-backend",
        "systemctl reload nginx",
        "ls -la /var/www/tuananhstudio/frontend/dist | head -n 10"
    ]

    for cmd in post_cmds:
        print(f">> Chay lenh: {cmd}")
        stdin, stdout, stderr = client.exec_command(cmd, timeout=60)
        out = stdout.read().decode('utf-8', errors='replace').strip()
        err = stderr.read().decode('utf-8', errors='replace').strip()
        if out:
            print(out[:400])
        if err and "Archive:" not in err and "inflating:" not in err:
            print(f"[Thong bao] {err[:200]}")

    client.close()
    print("\n=== TRIEN KHAI LEN VPS HOAN TAT 100%! ===")

    # Kiem tra ket noi HTTP thuc te toi https://examoraai.com
    try:
        res = requests.get("https://examoraai.com", timeout=15)
        print(f"\n>> Kiem tra https://examoraai.com: Status Code {res.status_code}")
        if res.status_code == 200:
            print(">> Website https://examoraai.com da san sang voi ban cap nhat moi nhat!")
    except Exception as e:
        print(f">> Kiem tra ket noi: {e}")

if __name__ == "__main__":
    deploy()
