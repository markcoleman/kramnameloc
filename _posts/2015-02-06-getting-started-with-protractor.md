---
layout: post
title: "Getting started with Protractor"
date: 2015-02-06 14:13:19 -0500
description: "End to end tests for AngularJs"
subtitle: "End to end tests for AngularJs"
---
The web development team at Members1st FCU has been using angularjs for the past two years.  It has been a learning experience developing a fairly large scale JavaScript based application.  One thing we have been procrastinating on is writing of end to end test (or system tests) that test interactions with the UI all the way down to the core data processor.  This concept was new to me and the team so after a few headaches we got it down to a few simple steps to get setup.

#Installing
The first thing you need is node

Windows [Chocolatey](https://chocolatey.org) ```choco install node``` or OSX [Home Brew](http://brew.sh) ```brew install node```

*if you are using windows you also need [java](http://java.com/en/download/)

Next run ```npm init``` which will guide you through the process of creating a ```package.json``` file that describes the package and related dependencies.

To install protractor run ```npm install protractor --save-dev```.  The save dev flag adds this to your dev dependencies for the project.  (You can also install this globally if you like as well)

Example ```package.json``` file

```
{
  "name": "ProtractorDemo",
  "version": "0.0.0",
  "description": "protractor demo",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Mark Coleman",
  "license": "ISC",
  "devDependencies": {
    "protractor": "~1.6.1"
  }
}
```

#Getting Setup
Once you have node, (java if windows,) and protractor we need to configure it.

Run ```node_modules/protractor/bin webdriver-manager update``` command that will download and configure the chrome web driver.

Sample script in ```package.json``` to automate this step, ```npm run setup```

```
"scripts": {
    "setup":"npm install && node node_modules/protractor/bin/webdriver-manager update",
    "test": "echo \"Error: no test specified\" && exit 1"
},
```

Once you have everything setup you need to start the [selenium server](http://www.seleniumhq.org/) ```node node_modules/protractor/bin webdriver-start```

You can also add in a script inside of ```package.json``` to simplify this process ```"start" : "node node_modules/protractor/bin/webdriver-manager start",``` then you can run ```npm run start```

At this point protractor is setup and configured now we can start creating a test.

#Create conf file
We need to create a ```conf.js``` file which stores the configuration for protractor.  The selenium address is the default configuration so shouldn't need adjusted.  I also separated the tests into suites for future test suite separation.

```
exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    suites: {
        homepage: 'homepageSpec.js'
    }
}
```

#Writing a Test
Protractor tests are written similar to jasmine tests but with the introduction with ```browser``` that allows you to navigate to a page and get the page title.

```
describe('angularjs homepage', function() {
    it('should have a title', function() {
        browser.get('http://www.angularjs.org');
        expect(browser.getTitle()).toEqual('AngularJS — Superheroic JavaScript MVW Framework');
    });
});
```

Once your test is created you can run the test by running the command ```node node_modules/protractor/bin/protractor conf.js``` (make sure the selenium server is still running)

You can also create a script inside of the ```package.json```

```
"test": "node node_modules/protractor/bin/protractor conf.js"
```  

Running the test using npm ```npm run test```

#Conclusion
After following these steps you should be able to have a very basic protractor test setup which verifies the title of a page.  In the next iteration we will expand on this basic example.

[Code on github](https://github.com/markcoleman/ProtractorExamples)
