---
layout: post
title: "AngularJs with no local js"
date: 2014-05-04 20:34:26 -0400
description: "Using the built in directives to build a simple contact form app."
subtitle: "Using the built in directives to build a simple contact form app."
---
#The Idea
A few weeks ago I was pondering what kind of an app you could build with AngularJs without actually writing any JavaScript.  I have been toying with this idea off and on since then and have something that is functional, meets my expectations, and I didn't write any JavaScript.  

#What To Build
Given my constraints of not writing any JavaScript I had to keep the idea fairly simple but also something that could be potentially a real world scenario.  I decided on building a Contact Us form that asked for your name, contact method, and optional comments.

![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/924719d7-b90c-47fe-baf3-e2042434a30b/01-contact%20form_large.png)

#Getting Started
Since I didn't want to write any local JavaScript I still needed a way to serve the content to the browser.  The easiest way for me to handle this was to setup a node server using [express](http://expressjs.com).  With express installed (and me not knowing zero about express) I ended up with the following ```server.js``` file which hosted my local content and accepted a post to "save" my contact form.

```
var express = require('express')
    , app = express()
    , directory = __dirname;

app.use(express.static(directory))
    .use(express.bodyParser());

app.post("/save", function(req, res){
    console.log(req.body);
    res.redirect(301, 'thankyou.html');
});

app.listen(8080,function(){
    console.log("Listening on 8080 and serving content from " + directory);
});
```
From my limited expressjs knowledge I was able to setup a server that listens on port 8080, serves static content from the root of the site, accepts a post to the url ```/save```, parse the form parameters in ```req.body```, and issue a redirect to ```thankyou.html```.  Now that we have that part out of the way how about we get to something I know a little bit more about, angularjs.

#The Html
The first step we have is to create our html for the form and since I know bootstrap, how about we use that for some simple style.

```
<body>
<div class="container-fluid">
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <h1>
                AngularJs With No Local Js
            </h1>

            <form name="contactForm" method="post" action="save" class="form-horizontal"
                  role="form">
                <fieldset>
                    <legend>Contact Form</legend>
                    <div class="form-group">
                        <label for="contactName" class="col-sm-2 control-label">Contact Name</label>

                        <div class="col-sm-10">
                            <input type="text" id="contactName" name="contactName" required=""
                                    class="form-control" placeholder="Your first and last name"/>

                            <div>
                                <div class="alert alert-danger">
                                    <span>Contact name is required.</span>
                                    <span>Contact name must be less than 40 characters.</span>
                                </div>
                            </div>
                        </div>
                    </div>
   <!-- 
Rest Omitted
-->
```

#Adding Angularjs via some directives
Now that we have the base line it is time to add in some directives to make this static content dynamic based upon user selection and form validity.

##The Cast of Characters
[```ngModel```](https://docs.angularjs.org/api/ng/directive/ngModel)
Since we need to handle user input we require the usage of  ```ngModel``` so we can evaluate the validity of our form fields and display appropriate content to our user.

*Example of ngModel on the drop down list*

```
<select ng-model="contactMethod" required="" class="form-control">
    <option>Email</option>
    <option>Telephone</option>
</select>
```

[```input```](https://docs.angularjs.org/api/ng/directive/input)
Speaking of form field validity using the ```input``` directive allows us to set constraints on max length, required fields, and min length.  We can use these validation options to display relevant messages to the user filling out our contact form.

*Example of max length and required on the contactName*

```
<input type="text" id="contactName" name="contactName" ng-model="name" required="" ng-maxlength="40" class="form-control" placeholder="Your first and last name" />
```

[```ngSwitch```](https://docs.angularjs.org/api/ng/directive/ngSwitch)
Our form contains a drop down list asking for the user's contact method of either email or telephone.  Depending on what option is selected we want to show the appropriate form field and label.  We could use ```ngIf``` for this but using ```ngSwitch``` allows us to present only the fields required in a nice switch statement style syntax.

*Example to display telephone if the drop down is selected*

```
<div ng-switch-when="Telephone">
    <label for="telephone" class="col-sm-2 control-label">Telephone</label>

    <div class="col-sm-10">

        <input type="tel" id="telephone" name="telephone" ng-model="telephone" required="" class="form-control" placeholder="Your telephone number" />
    </div>
</div>
```

[```ngIf```](https://docs.angularjs.org/api/ng/directive/ngIf)
Because we have a dynamic elements on the page based up on form validity we can utilize ```ngIf``` to display those error messages when invalid input is entered. (```ngShow``` could be used here as well but ```ngIf``` only adds the items to the dom if the expression is true)

*Example displaying an error message if the telephone field is empty*

```
<div class="alert alert-danger" ng-if="contactForm.telephone.$dirty && contactForm.telephone.$error.required">
    <span>Contact telephone is required</span>
</div>
```

[```ngDisabled```](https://docs.angularjs.org/api/ng/directive/ngDisabled)
The last directive we are going to use is ```ngDisabled``` which allows us to disable the submit button if our form is not valid.

*Example to disable the submit button*

```
<input type="submit" class="btn btn-primary btn-large" ng-disabled="contactForm.$invalid" value="Submit" />
```

#Conclusion
This was a fun exercise to see what you can actually do with AngularJs and not actually write any JavaScript.  In the end we built a contact form, had client side validation, displayed dynamic content based upon model state, and was able to submit our form via a post action.  Now would I do this on a real site?  Probably not as this example is very trivial and adding anything of substance would make our application very brittle with overly complex expressions in the view.

[Code on github](https://github.com/markcoleman/AngularJsWithNoLocalJs)
