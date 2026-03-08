---
layout: post
title: "Manually Bootstraping AngularJs After Asynchronous Call"
date: 2014-02-13 08:52:18 -0500
description: "Delay initialization so you can gather config"
subtitle: "Delay initialization so you can gather config"
---
This morning while the snow is coming down I decided to browser over to stack overflow and found the question [How can I execute some code asynchronously before methods in my service are called?](http://stackoverflow.com/questions/21753526/how-can-i-execute-some-code-asynchronously-before-methods-in-my-service-are-call/21755018#21755018)

From the context of the question it appears the asker wants to initialize some config before the application is bootstrapped.  This can be done easily be [manually bootstrapping your application](http://docs.angularjs.org/guide/bootstrap).

The basic example in the docs
```<script>
       angular.element(document).ready(function() {
         angular.module('myApp', []);
         angular.bootstrap(document, ['myApp']);
       });
</script>```

This snippet delays the bootstrap and allows you to bootstrap your app at a later point in time.  (ng-app has to be omitted from the document)

####Answering the question
Since the asker mentions an ajax request to determine which url to use we can easily perform the request (using jquery for simplicity), set the correct url in the ```fail()/done()``` and  bootstrap the application in ```always()```.

Putting it all together we end up with something like the following:

```
var urlToCheck = '/echo/json/';

var myApp = angular.module('myApp', []);

myApp.controller("MyCtrl", ["$scope", "config", function ($scope, config) {
    $scope.url = config.url;
}]);

$.ajax({
    url: urlToCheck
}).fail(function () {
    myApp.constant('config', {
        url: '/fail-url'
    });
}).done(function () {
    myApp.constant('config', {
        url: '/done-url'
    });
}).always(function () {
    angular.bootstrap(document, ['myApp']);
});
```

Simple but effective.

[Example on jsfiddle](http://jsfiddle.net/markcoleman/EWYMZ/)
