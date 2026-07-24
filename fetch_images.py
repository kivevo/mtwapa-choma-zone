import requests
import json
import re
import os
from bs4 import BeautifulSoup
import urllib.parse

def search_ddg_images(query):
    url = f"https://duckduckgo.com/?q={urllib.parse.quote(query)}&t=h_&iax=images&ia=images"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
    
    # DuckDuckGo image search requires vqd token
    res = requests.get(url, headers=headers)
    vqd_match = re.search(r'vqd=([\d-]+)', res.text)
    if not vqd_match:
        return []
    
    vqd = vqd_match.group(1)
    
    api_url = f"https://duckduckgo.com/i.js?q={urllib.parse.quote(query)}&o=json&p=1&s=0&u=bing&f=,,,,,&l=us-en"
    headers['Cookie'] = f'vqd={vqd}'
    headers['Referer'] = url
    
    res = requests.get(api_url, headers=headers)
    try:
        data = res.json()
        return [result['image'] for result in data.get('results', [])]
    except:
        return []

os.makedirs('public/images/real', exist_ok=True)
images = search_ddg_images("Choma Zone Mtwapa Palms restaurant food")
count = 1
for img_url in images[:10]:
    try:
        print(f"Downloading {img_url}")
        r = requests.get(img_url, timeout=5)
        if r.status_code == 200:
            with open(f"public/images/real/choma_{count}.jpg", "wb") as f:
                f.write(r.content)
            count += 1
    except Exception as e:
        print(f"Failed to download {img_url}: {e}")

