// This code tests the accessibility of a chat page after sending a text and uploading a picture in the conversation
// to work with puppeteer we used the following IDs:
//  * div with data-testid="Open chat" of the frame 'spr-chat__trigger-frame'
//  * div with Id="spr-new-conversation-btn" of the frame 'spr-chat__box-frame'
//  * input field with Id="COMPOSER_ID"
//  * submit button with data-testid="Submit"

const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');

const DEFAULT_TIMEOUT = 2000;
const SCREENSHOTS_DIRECTORY = 'upload';

(async () => {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  await page.setBypassCSP(true);

  //open the given url in the headless browser and wait for chat trigger's frame
  await page.goto('https://live-chat-static.sprinklr.com/test-html/index.html?appId=629dc19302a3f85cf25e8100_app_600050383&env=qa4');
  await page.waitForSelector('[name="spr-chat__trigger-frame"]');
  
  //collect all the frames
  let frames = await page.frames();

  
  for(const frame of frames) {
    //loop through all the frames to get the one which has the chat trigger
    if (frame.name() === 'spr-chat__trigger-frame') {
        //wait for chat trigger and click on it
        await frame.waitForSelector('[data-testid="Open chat"]');
        await frame.click('[data-testid="Open chat"]');
    }
  }

  //wait for new conversation's frame and collect the frames again in order to get newly generated frames
  await page.waitForSelector('[name="spr-chat__box-frame"]');
  frames = await page.frames();
  
  for(const frame of frames) {
    //loop through all the frames to get the one which has the new conversation button
    if (frame.name() === 'spr-chat__box-frame') {

        //wait for new conversation button and click on it
        await frame.waitForSelector('#spr-new-conversation-btn');
        await frame.click('#spr-new-conversation-btn');
        await frame.waitForTimeout(DEFAULT_TIMEOUT);

        //wait for input field to allow you to type
        await frame.waitForSelector('#COMPOSER_ID');
        await frame.waitForFunction('document.getElementById("COMPOSER_ID").ariaDisabled === "false"');
  
        //type into the input field
        await frame.focus('#COMPOSER_ID');
        await page.keyboard.type(`Just texting`);
        await frame.waitForTimeout(DEFAULT_TIMEOUT);

        //wait for submit button and click on it
        await frame.waitForSelector('[data-testid="Submit"]');
        await frame.click('[data-testid="Submit"]');
        await frame.waitForTimeout(DEFAULT_TIMEOUT);

        //upload a picture 
        const photo = await frame.$("input[type=file]");
        await photo.uploadFile("upload/photo.jpeg");
        await frame.waitForTimeout(10000); 

    }
  }
  
  //analyze i.e test the current page's accessibility according to WCAG 2.1 Level AA and collect the result
  const results = await new AxePuppeteer(page).withTags(['wcag21aa']).analyze();

  console.log("list of the errors with corresponding elements responsible for it");
  results.violations.forEach(function (arrayItem) {
    console.log(arrayItem);
   });

  await page.close();
  await browser.close();
})();


