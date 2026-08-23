import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

def check_pagespeed(strategy):
    api_url = f'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://tuananhstudio.top&strategy={strategy}'
    print(f'Fetching PageSpeed Insights for {strategy.upper()}...')
    req = urllib.request.Request(api_url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=90) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            lhr = data.get('lighthouseResult', {})
            cats = lhr.get('categories', {})
            print(f'=== {strategy.upper()} SCORES ===')
            for ckey, cval in cats.items():
                sc = int((cval.get('score') or 0) * 100)
                print(f"  • {cval.get('title')}: {sc} / 100")
            
            audits = lhr.get('audits', {})
            print(f'\n=== {strategy.upper()} OPPORTUNITIES & DIAGNOSTICS (Score < 0.9) ===')
            for k, v in audits.items():
                score = v.get('score')
                if score is not None and score < 0.9:
                    title = v.get('title')
                    disp = v.get('displayValue', '')
                    desc = v.get('description', '')[:100]
                    print(f"  - [{k}] {title}: score={score} {disp}")
                    
    except Exception as e:
        print(f"Error checking {strategy}: {e}")

if __name__ == '__main__':
    check_pagespeed('mobile')
    print('\n' + '='*60 + '\n')
    check_pagespeed('desktop')
