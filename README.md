
**Puppeteer**: Puppeteer is a Node library which provides a high-level API to control Chrome or Chromium over the DevTools Protocol. Puppeteer runs headless by  default, but can be configured to run full (non-headless) Chrome or Chromium(which is helpful to see the navigation we have programmed).

**Axe-core**:  Axe is an accessibility testing engine for websites and other HTML-based user interfaces. It's fast, secure, lightweight, and was built to seamlessly integrate with any existing test environment so you can automate accessibility testing alongside your regular functional testing.

**@axe-core/puppeteer**: Provides a chainable axe API for Puppeteer and automatically injects into all frames.

**Problem statement**: We have an app (https://live-chat-static.sprinklr.com/test-html/index.html?appId=629dc19302a3f85cf25e8100_app_600050383&env=qa4)  and we want to test the accessibility of this app using axe-core/puppeteer.

This repo contains scripts(in the pages folder), which test the accessibility of different pages of this app.

Using puppeteer we can open this app in a headless browser and navigate through different pages, in order to test the accessibility of the app whenever new UI is introduced onto it.

Most things that you can do manually in the browser can be done using Puppeteer so we write our program in such a manner that it will lead us from our homepage to any other page we want to test.

This includes implementing each and every click, hover and much more in the same sequence as we follow in the manual implementation and finally analysing i.e testing the page we reach using axe-core which gives us an error list like the one below.

    {
        id: 'color-contrast-enhanced',
        impact: 'serious',
        tags: [ 'cat.color', 'wcag2aaa', 'wcag146' ],
        description: 'Ensures the contrast between foreground and background colors meets WCAG 2 AAA contrast ratio thresholds',
        help: 'Elements must have sufficient color contrast',
        helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/color-contrast-enhanced?application=axe-puppeteer',
        nodes: [ [Object] ]
      }
    
    {
        any: [ [Object] ],
        all: [],
        none: [],
        impact: 'serious',
        html: '<span> cat.jpeg </span>',
        target: [ '.highlight > .nameTagTitle > span' ],
        failureSummary: 'Fix any of the following:\n' +
          '  Element has insufficient color contrast of 3.51 (foreground color: #000000, background color: #015ed0, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 7:1'
      }

  
  The error list consists of 4 different arrays of errors according to severity level of the errors.
  
  But when it comes to correcting the error we only need the violations array. The above error is an example of violation error.
  
  We get every deatil of the error from the error object which is the first object of the element and second object is the node object.
  
  The html property of this node object gives us the exact html tag which is causing this error.



