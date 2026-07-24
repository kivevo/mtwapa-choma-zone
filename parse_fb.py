import re
import urllib.parse
import os

with open('/home/peter/.gemini/antigravity/brain/02215a2d-7231-414a-973b-29e0187ad39c/.system_generated/steps/1006/content.md', 'r') as f:
    content = f.read()

# Find URLs that match the scontent format
urls = set()
for match in re.finditer(r'(https://scontent[^"\']+\.jpg[^"\']*)', content):
    url = match.group(1).replace('\\/', '/')
    # Unescape HTML entities
    url = url.replace('&amp;', '&')
    if 'p206x206' not in url and 'p100x100' not in url:
        urls.add(url)

for i, url in enumerate(list(urls)[:20]):
    print(f"URL {i}: {url}")

