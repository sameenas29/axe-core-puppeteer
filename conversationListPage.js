// This code creates 4 conversations and then tests the accessibility of the page that shows the list of all the conversations
// to work with puppeteer we used the following IDs:
//  * div with data-testid="Open chat" of the frame 'spr-chat__trigger-frame'
//  * div with Id="spr-new-conversation-btn" of the frame 'spr-chat__box-frame'
//  * input field with Id="COMPOSER_ID"
//  * submit button with data-testid="Submit"

const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');

const DEFAULT_TIMEOUT = 2000;

(async () => {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  await page.setBypassCSP(true);

  //collect all the frames
  let frames = await page.frames();

  //open the given url in the headless browser and wait for chat trigger's frame
  await page.goto('https://live-chat-static.sprinklr.com/test-html/index.html?appId=629dc19302a3f85cf25e8100_app_600050383&env=qa4');
  await page.waitForSelector('[name="spr-chat__trigger-frame"]');

  frames = await page.frames();

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
  
  //create four conversations in order to get "+ more conversation" tab
  for(let i = 0; i < 4 ; i++ ){
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
        await page.keyboard.type(`Just texting-${i}`);
        await frame.waitForTimeout(DEFAULT_TIMEOUT);
        
        //wait for submit button and click on it
        await frame.waitForSelector('[data-testid="Submit"]');
        await frame.click('[data-testid="Submit"]');
        await frame.waitForTimeout(DEFAULT_TIMEOUT);
        
        //wait for back button and click on it
        await frame.waitForSelector('#spr-header-back-btn');
        await frame.click('#spr-header-back-btn');
        
        //wait for the new conversation button to show again
        await frame.waitForTimeout(DEFAULT_TIMEOUT);
        await frame.waitForSelector('#spr-new-conversation-btn');
      }
    };
  }

 frames = await page.frames();

 //wait for the frame that has "+ more conversation" tab
 await page.waitForSelector('[name="spr-chat__box-frame"]');
 await page.waitForTimeout( DEFAULT_TIMEOUT);

 //wait for the +more conversations" button and click on it
 for(const frame of frames) {
  //loop through all the frames to get the one which has the + more conversation tab
  if (frame.name() === 'spr-chat__box-frame') {
    //wait for +more conversation tab and click on it
    await frame.waitForSelector('#spr-more-conversations-btn');
    await frame.click('#spr-more-conversations-btn');
    await page.waitForTimeout(DEFAULT_TIMEOUT);
  }   
};
  
  //analyze i.e test the current page's accessibility according to WCAG 2.1 Level AA and collect the result
  const results = await new AxePuppeteer(page).withTags(['wcag21aa']).analyze();

  console.log("list of the errors with corresponding elements responsible for it");
  results.violations.forEach(function (arrayItem) {
    console.log(arrayItem);
   });

  await page.close();
  await browser.close();
})();


