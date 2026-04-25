const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER_ERROR:', error));
  
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(6000); // Wait for boot screen
  
  // click auto_pilot mode
  try {
     await page.click('.mode-option-card:has-text("auto_pilot.sh")');
  } catch(e) {}
  
  await page.waitForTimeout(2000);
  await browser.close();
})();
