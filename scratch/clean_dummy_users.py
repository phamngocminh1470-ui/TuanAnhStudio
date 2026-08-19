import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.15.222.216', username='root', password='Tuananh2026')

remote_script = """import sqlite3
conn = sqlite3.connect('/var/www/tuananhstudio/backend/ai_english_mentor.db')
c = conn.cursor()
c.execute("DELETE FROM userprogress WHERE user_id IN (SELECT id FROM user WHERE username LIKE 'test%' OR username LIKE 'admin_%')")
c.execute("DELETE FROM user WHERE username LIKE 'test%' OR username LIKE 'admin_%'")
conn.commit()
c.execute("SELECT id, username, fullname, role FROM user")
rows = c.fetchall()
print('REMAINING USERS:', rows)
conn.close()
"""

sftp = ssh.open_sftp()
with sftp.file('/tmp/clean_db.py', 'w') as f:
    f.write(remote_script)
sftp.close()

stdin, stdout, stderr = ssh.exec_command('/var/www/tuananhstudio/venv/bin/python3 /tmp/clean_db.py')
print(stdout.read().decode('utf-8'))
print(stderr.read().decode('utf-8'))

stdin, stdout, stderr = ssh.exec_command('systemctl restart tuananhstudio-backend')
print("RESTARTED BACKEND!")
ssh.close()
