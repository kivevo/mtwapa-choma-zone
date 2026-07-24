const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto('https://www.facebook.com/ChomaZoneMtwapaPalm/photos', { waitUntil: 'networkidle2' });
  
  const imgUrls = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images.map(img => img.src).filter(src => src && src.includes('scontent') && !src.includes('p100x100'));
  });
  
  console.log(JSON.stringify(imgUrls.slice(0, 20), null, 2));
  await browser.close();
})();
