const puppeteer = require('puppeteer');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'public/images/real');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filename);
    proto.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.facebook.com/',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Status ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

(async () => {
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1280, height: 900 });
  
  const downloadedUrls = [];
  
  // Intercept image responses and save large ones
  page.on('response', async (response) => {
    const url = response.url();
    const contentType = response.headers()['content-type'] || '';
    if (
      contentType.includes('image/jpeg') &&
      url.includes('scontent') &&
      !url.includes('p100x100') &&
      !url.includes('p206x206') &&
      !url.includes('s206x206') &&
      !url.includes('s32x32') &&
      !url.includes('s26x26') &&
      downloadedUrls.length < 12
    ) {
      try {
        const buffer = await response.buffer();
        if (buffer.length > 30000) { // Only save images > 30KB (skip tiny thumbnails)
          const filename = path.join(OUTPUT_DIR, `fb_real_${downloadedUrls.length}.jpg`);
          fs.writeFileSync(filename, buffer);
          downloadedUrls.push(url);
          console.log(`✅ Saved fb_real_${downloadedUrls.length - 1}.jpg (${Math.round(buffer.length/1024)}KB)`);
        }
      } catch (e) {
        // ignore
      }
    }
  });

  console.log('Navigating to Facebook photos page...');
  try {
    await page.goto('https://www.facebook.com/ChomaZoneMtwapaPalm/photos', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    await new Promise(r => setTimeout(r, 5000));
    
    // Click on photos to trigger loading larger images
    const photoLinks = await page.$$('a[href*="/photo"]');
    console.log(`Found ${photoLinks.length} photo links`);
    
    for (let i = 0; i < Math.min(6, photoLinks.length) && downloadedUrls.length < 8; i++) {
      try {
        await photoLinks[i].click();
        await new Promise(r => setTimeout(r, 3000));
        
        // Find the main image in the lightbox
        const imgSrc = await page.evaluate(() => {
          const imgs = Array.from(document.querySelectorAll('img'));
          const big = imgs.find(img => {
            const rect = img.getBoundingClientRect();
            return rect.width > 300 && img.src.includes('scontent');
          });
          return big ? big.src : null;
        });
        
        if (imgSrc && !downloadedUrls.includes(imgSrc)) {
          console.log(`Found big image: ${imgSrc.substring(0, 80)}...`);
          const filename = path.join(OUTPUT_DIR, `fb_real_${downloadedUrls.length}.jpg`);
          try {
            await downloadImage(imgSrc, filename);
            const stat = fs.statSync(filename);
            if (stat.size > 10000) {
              downloadedUrls.push(imgSrc);
              console.log(`✅ Saved fb_real_${downloadedUrls.length - 1}.jpg (${Math.round(stat.size/1024)}KB)`);
            } else {
              fs.unlinkSync(filename);
            }
          } catch(e) {
            console.log(`Failed to download: ${e.message}`);
          }
        }
        
        // Navigate back to photos list
        await page.goBack();
        await new Promise(r => setTimeout(r, 2000));
      } catch(e) {
        console.log(`Photo click ${i} failed: ${e.message}`);
      }
    }
  } catch(e) {
    console.log(`Facebook navigation failed: ${e.message}`);
  }

  // Now try Instagram
  console.log('\nNavigating to Instagram...');
  const page2 = await browser.newPage();
  await page2.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  let instaCount = 0;
  page2.on('response', async (response) => {
    const url = response.url();
    const contentType = response.headers()['content-type'] || '';
    if (
      contentType.includes('image/jpeg') &&
      (url.includes('scontent') || url.includes('cdninstagram')) &&
      !url.includes('150x150') &&
      !url.includes('s150x150') &&
      instaCount < 8
    ) {
      try {
        const buffer = await response.buffer();
        if (buffer.length > 50000) {
          const filename = path.join(OUTPUT_DIR, `insta_real_${instaCount}.jpg`);
          fs.writeFileSync(filename, buffer);
          instaCount++;
          console.log(`✅ Saved insta_real_${instaCount - 1}.jpg (${Math.round(buffer.length/1024)}KB)`);
        }
      } catch(e) { }
    }
  });

  try {
    await page2.goto('https://www.instagram.com/mtwapapalms/', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    await new Promise(r => setTimeout(r, 5000));
    
    // Click posts to load bigger images
    const posts = await page2.$$('article a');
    for (let i = 0; i < Math.min(8, posts.length) && instaCount < 6; i++) {
      try {
        await posts[i].click();
        await new Promise(r => setTimeout(r, 3000));
        await page2.keyboard.press('ArrowRight');
        await new Promise(r => setTimeout(r, 1500));
        await page2.keyboard.press('Escape');
        await new Promise(r => setTimeout(r, 1000));
      } catch(e) { }
    }
  } catch(e) {
    console.log(`Instagram failed: ${e.message}`);
  }

  await browser.close();
  
  console.log(`\n=== DONE ===`);
  console.log(`Facebook images: ${downloadedUrls.length}`);
  console.log(`Instagram images: ${instaCount}`);
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.jpg'));
  console.log(`Total files in output dir: ${files.join(', ')}`);
})();
