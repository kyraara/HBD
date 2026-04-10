const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER_ERROR:', error.message));

  await page.goto('http://localhost:5175', { waitUntil: 'networkidle0' });
  
  // Wait a bit, then click standard buttons to trigger the issue
  // The vault pin is 0804
  await new Promise(r => setTimeout(r, 2000));
  
  try {
    // Find pin inputs and type 0804
    await page.evaluate(() => {
       const keys = Array.from(document.querySelectorAll('.numpad-key'));
       const key0 = keys.find(k => k.textContent.includes('0'));
       const key8 = keys.find(k => k.textContent.includes('8'));
       const key4 = keys.find(k => k.textContent.includes('4'));
       if(key0) key0.click();
       if(key8) key8.click();
       if(key0) key0.click();
       if(key4) key4.click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    
    // Choose mode
    await page.evaluate(() => {
       const guided = Array.from(document.querySelectorAll('.mode-option-title')).find(t => t.textContent.includes('Pemandu'));
       if(guided) guided.click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
  } catch(e) {
    console.log('Puppeteer script error:', e.message);
  }

  await browser.close();
})();
