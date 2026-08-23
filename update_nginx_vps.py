import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

nginx_conf = """server {
    server_name tuananhstudio.top www.tuananhstudio.top;
    root /var/www/tuananhstudio/frontend/dist;
    index index.html;

    # Gzip Compression Optimization
    gzip on;
    gzip_vary on;
    gzip_min_length 256;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/x-javascript
        application/json
        application/xml
        application/rss+xml
        image/svg+xml;

    # Security & Content Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # 1 Year Immutable Cache for Vite Hashed Assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # Static Root Files (robots.txt, sitemap.xml, favicon.svg)
    location ~* \\.(ico|css|js|gif|jpe?g|png|svg|woff2?|eot|ttf|otf|webp|mp4|webm|txt|xml)$ {
        expires 7d;
        add_header Cache-Control "public, max-age=604800";
        try_files $uri =404;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    listen 443 ssl http2; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/tuananhstudio.top/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/tuananhstudio.top/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = www.tuananhstudio.top) {
        return 301 https://$host$request_uri;
    }

    if ($host = tuananhstudio.top) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    server_name tuananhstudio.top www.tuananhstudio.top;
    return 404;
}
"""

def update_nginx():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect('103.15.222.216', port=22, username='root', password='Tuananh2026', timeout=15)

    sftp = client.open_sftp()
    with sftp.file('/etc/nginx/sites-available/tuananhstudio', 'w') as f:
        f.write(nginx_conf)
    sftp.close()

    stdin, stdout, stderr = client.exec_command('nginx -t && systemctl reload nginx')
    out = stdout.read().decode('utf-8').strip()
    err = stderr.read().decode('utf-8').strip()
    print('Nginx test output:', out)
    if err:
        print('Nginx test err/info:', err)

    client.close()
    print('Nginx successfully updated on VPS!')

if __name__ == '__main__':
    update_nginx()
