(async () => {
  const puppeteer = (await import('puppeteer')).default;
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('file://' + process.cwd() + '/www/index.html');
  await new Promise(r => setTimeout(r, 1000));
  
  await page.evaluate(() => {
    isGuestMode = true;
    startGameWithLevel({ tier: 2, cols: 5, rows: 5, key: 'easy', color: '#fff' }, 1);
  });
  
  await new Promise(r => setTimeout(r, 500));
  
  const canvasPos = await page.evaluate(() => {
    const rect = document.getElementById('gameCanvas').getBoundingClientRect();
    return { left: rect.left, top: rect.top, w: rect.width, h: rect.height };
  });
  
  console.log('Clicking canvas center:', canvasPos);
  
  // Click center of canvas multiple times
  for(let i=0; i<10; i++) {
     await page.mouse.click(canvasPos.left + canvasPos.w/2 + (i*10), canvasPos.top + canvasPos.h/2 + (i*10));
  }
  
  await new Promise(r => setTimeout(r, 1000));
  
  const piecesCount2 = await page.evaluate(() => pieces.length);
  console.log('Pieces count after click:', piecesCount2);

  await browser.close();
})();
