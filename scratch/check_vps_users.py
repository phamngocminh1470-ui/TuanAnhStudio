import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.15.222.216', username='root', password='Tuananh2026')

stdin, stdout, stderr = ssh.exec_command('cat /etc/systemd/system/tuananhstudio-backend.service')
print("SERVICE FILE:")
print(stdout.read().decode('utf-8'))
ssh.close()
