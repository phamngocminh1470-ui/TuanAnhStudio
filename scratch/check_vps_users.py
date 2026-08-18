import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.15.222.216', username='root', password='Tuananh2026')

stdin, stdout, stderr = ssh.exec_command('find / -name "ai_english_mentor.db" 2>/dev/null')
print("DB FILES FOUND:")
print(stdout.read().decode('utf-8'))
ssh.close()
