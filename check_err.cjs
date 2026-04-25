const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER_ERROR:', error));
  
  await page.goto('http://localhost:5173');
  await new Promise(r => setTimeout(r, 6000));
  await browser.close();
})();
