const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Play as Guest
    await page.click('#guest-login-btn');
    await page.waitForTimeout(1000);
    
    // Play Game
    await page.click('#play-btn');
    await page.waitForTimeout(1000);
    
    // Click Restart
    console.log('Clicking restart...');
    await page.click('#restart-btn');
    await page.waitForTimeout(1000);
    
    // Evaluate pieces
    const piecesLen = await page.evaluate(() => window.pieces ? window.pieces.length : -1);
    console.log('Pieces length after restart:', piecesLen);
    
    await browser.close();
})();
