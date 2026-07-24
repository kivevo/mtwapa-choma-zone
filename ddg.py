import urllib.request
import urllib.parse
from bs4 import BeautifulSoup
import re
import os

query = urllib.parse.quote('site:facebook.com "Choma Zone- Mtwapa Palms" photo')
url = f"https://html.duckduckgo.com/html/?q={query}"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read()
    soup = BeautifulSoup(html, 'html.parser')
    for a in soup.find_all('a', class_='result__snippet'):
        print(a.text)
except Exception as e:
    print(e)
