---
layout: post
title: "Alter scope via Console"
date: 2015-04-11 09:35:39 -0400
description: "angular.element() is your friend"
subtitle: "angular.element() is your friend"
---
Yesterday I was tasked with changing some verbiage inside of an AngularJs application that is only displayed under a certain condition via ngIf.  How can I validate the changes to the application without mucking up the boolean logic to display the div?

Given the following
```
  <div ng-if="isNewUser">
    Welcome new user to the site.
  </div>
```
```
  $scope.isNewUser = false; //some complex logic
```

I want to view the welcome message without touching the ```isNewUser``` condition.  Granted I could register a new user to cause this logic to evaluate to true but I am lazy.

You can interact with your angular application via the console using ```angular.element()```

```
var elm = document.getElementById("main");
angular.element(elm);
```

This allows you to access the scope

```
console.log(angular.element(elm).scope().isNewUser);
>> false
```

From there you can simply set the scope property to true and force a digest cycle with apply

```
angular.element(elm).scope().isNewUser = true;
angular.element(elm).scope().$apply();
```

Inside of your application you should see the ```ngIf``` evaluate and the welcome message will be shown.

Simple but effective.

You can try it out for yourself on [jsfiddle](https://jsfiddle.net/markcoleman/tmwa0xtk/embedded/result/).

*to access the frame in chrome change the console target to fiddle.jshell.net*
