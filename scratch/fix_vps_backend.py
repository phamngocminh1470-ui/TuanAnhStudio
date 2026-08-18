import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    print("Connecting to VPS...")
    ssh.connect('103.15.222.216', username='root', password='Tuananh2026')
    print("Connected.")

    cmds = [
        "pkill -9 -f uvicorn || true",
        "pkill -9 -f gunicorn || true",
        "cd /var/www/tuananhstudio/backend && ../venv/bin/pip install passlib bcrypt python-jose sqlmodel pydantic requests uvicorn fastapi 'bcrypt<4.1.0'",
        "cd /var/www/tuananhstudio/backend && ../venv/bin/python3 -c \"import database, auth_api; database.create_db_and_tables(); print('ALL_TABLES_READY')\"",
        "cd /var/www/tuananhstudio/backend && nohup ../venv/bin/python3 -m uvicorn main:app --host 127.0.0.1 --port 8000 > backend.log 2>&1 &",
        "sleep 3",
        "curl -s http://127.0.0.1:8000/api/health",
        "curl -s -X POST http://127.0.0.1:8000/api/auth/register -H 'Content-Type: application/json' -d '{\"username\":\"testadmin1\",\"fullname\":\"Test User\",\"password\":\"123456\",\"email\":\"test@gmail.com\",\"role\":\"student\",\"grade\":\"12\",\"target_score\":7.0}'"
    ]

    for cmd in cmds:
        print(f">> {cmd}")
        stdin, stdout, stderr = ssh.exec_command(cmd)
        out = stdout.read().decode('utf-8', errors='replace')
        err = stderr.read().decode('utf-8', errors='replace')
        if out.strip():
            print("OUT:", out.strip()[:300])
        if err.strip():
            print("ERR:", err.strip()[:300])

    ssh.close()
    print("Done!")

if __name__ == "__main__":
    main()
