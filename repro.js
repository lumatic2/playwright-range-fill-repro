// Minimal reproduction: fill() on <input type=range> rejects values the browser accepts but re-serializes.
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent('<input type=range min=0 max=1 step=.001 value=0>');
  for (const v of ['0.850', '0.85', '1e-3', '+0.5', '.5', '0.5']) {
    try {
      await page.fill('input', v);
      console.log(JSON.stringify(v).padEnd(8), 'OK   ->', await page.$eval('input', i => i.value));
    } catch (e) {
      console.log(JSON.stringify(v).padEnd(8), 'FAIL ->', e.message.split('\n')[0]);
    }
  }
  // The browser itself accepts the same string and just normalizes it:
  console.log('DOM: value="0.850" ->', await page.evaluate(() => {
    const i = document.querySelector('input'); i.value = '0.850'; return i.value;
  }));
  console.log('playwright', require('playwright/package.json').version, '| chromium', browser.version());
  await browser.close();
})();
