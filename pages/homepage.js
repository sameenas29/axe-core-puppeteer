//This code tests the accessibility of the homepage after the chat trigger is clicked
//using puppeteer we click on the div with data-testid="Open chat" of the frame 'spr-chat__trigger-frame'

const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');

const DEFAULT_TIMEOUT = 5000;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setBypassCSP(true);
  
  //open the given url in the headless browser 
  await page.goto('https://live-chat-static.sprinklr.com/test-html/index.html?appId=629dc19302a3f85cf25e8100_app_600050383&env=qa4');
  
  //wait for all the frames to load and collect them
  await page.waitForTimeout(DEFAULT_TIMEOUT); 
  const frames = await page.frames();
  
  for(const frame of frames) {
    //loop through all the frames to get the one which has the chat trigger
    if (frame.name() === 'spr-chat__trigger-frame') {
      //wait for the chat trigger and click on it
      await frame.click('[data-testid="Open chat"]');
    }
  }
  
  await page.waitForTimeout(DEFAULT_TIMEOUT);
  
  //analyze i.e test the current page's accessibility according to WCAG 2.1 Level AA and collect the result
  const results = await new AxePuppeteer(page).withTags(['wcag21aa']).analyze();


  console.log("list of the errors with corresponding elements responsible for it");
  results.violations.forEach(function (arrayItem) {
    console.log(arrayItem);
   });

  await page.close();
  await browser.close();
})();
