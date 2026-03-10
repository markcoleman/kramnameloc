---
layout: "post"
title: "Protractor Finding an Element"
date: 2015-02-15 16:33:00 -0500
description: "Using by.css()"
summary: "Using by.css()"
subtitle: "Using by.css()"
tags:
  - javascript
  - web
  - testing
---
In the first post we showed how we can easily get [setup with protractor and an angularjs application](https://markcoleman.silvrback.com/getting-started-with-protractor).  Next up we want to continue our journey and use protractor to find an element on a page and assert that the text is a given value.  To get this started we need to tweak our original application slightly.

#Example App
First thing we needed to do is actually create an application as prior we only had tests.  Our application is very simple (for now).  It has the following:

 - app.js which contains the ```protractor``` module and one controller ```MainCtrl```
 - index.html that is a basic setup of a page using [bootstrap](http://getbootstrap.com) and some lovely [SAMUEL L. IPSUM](http://slipsum.com)

#Finding an Element
Now that we have our example app setup let's go ahead and try to find the ```<h1>``` under the jumbotron.  To do this we need to us the [```by.css()```](http://angular.github.io/protractor/#/api?view=webdriver.By.css) method in conjunction with ```element()```  Once we get the element we can use a normal ```expect()``` clause to validate the header contains the appropriate text.

```
describe('go go protractor homepage', function() {
    it('should have a jumbotron header', function(){
        browser.get('http://localhost:8080');
        expect(element(by.css('.jumbotron h1')).getText()).toBe("Go Go Protractor");
    });
});
```

The ```by.css()``` method is powerful in the fact you can pass in css selectors to locate an element, with this being said it is not jQuery and you need to use valid css selectors to locate the element. e.g. you can't use the jQuery ```:visible``` extension.

#Test Refactor
If you look at our two tests they both start with ```browser.get()```.  We can refactor this method out to the ```beforeEach()``` call inside of our describe to reduce in duplication.

```
describe('go go protractor homepage', function() {
    beforeEach(function(){
        browser.get('http://localhost:8080');
    });
    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('Go Go Protractor');
    });
    it('should have a jumbotron header', function(){
        expect(element(by.css('.jumbotron h1')).getText()).toBe("Go Go Protractor");
    });
});
```

There that feels better! Always be refactoring!

#Conclusion
Finding elements by css is simple to use inside of your end to end tests to validate your page contains certain values.  Next up we will expand on this with a few other common selectors you might use in your tests.

[Code on github](https://github.com/markcoleman/ProtractorExamples/tree/07ea347a9d0cc758ed780fb27ea9d36ffb73df8f)
