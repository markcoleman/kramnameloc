---
layout: "post"
title: "What I learned about unit testing"
date: 2014-01-22 22:35:00 -0500
description: "Lessons learned in unit testing during a year long project"
summary: "Lessons learned in unit testing during a year long project"
subtitle: "Lessons learned in unit testing during a year long project"
tags:
  - dotnet
  - testing
  - javascript
---
If you read my previous post [What have I been doing?](https://markcoleman.silvrback.com/what-have-i-been-doing) you know I have been busy working on a team building an Online Banking application.  I have done unit testing in the past but this was the first time where it was done on a large (for me) project.  When we started we had a few goals in regards to unit testing.

 * Write unit tests in C# to cover business logic for our API
 * Write unit tests for our AngularJs application

After our first release I can say we had success on the C# side but unfortunately had minimal success for our AngularJs tests as we had minimal prior experience with JavaScript testing.

##Why it is important
**Unit testing is extremely important in any application of significant scale.**  I can not stress this enough as unit testing helps identify potential problems early on and forces you to think how your application is structured.  If your class/method is difficult to test chances are you need to reevaluate your implementation.  

####Bugs
With any application bugs are going to exist from either coding defects or undefined results from your business rule given a unexpected data.  I can not tell you how mentally satisfying it is for me to write up a failing test after a bug report.  

 * We receive a bug report
 * We recreate the bug with a failed unit test
 * We fix the bug which makes my failed unit test pass
 * We now know with some reasonable assurance that the bug is now fixed

####Changing business rules
We all know that even with the best requirements and specifications changes occur to business rules.  Month one we are told do not allow that person to register and then on month ten we are told that person can now register.  

 * Method has adequate code coverage via unit testing
 * Business rule changes
 * We write failing unit test for the new business rule
 * We make our alterations until the new rule passes
 * We run our existing tests to verify that our old rules still pass

This allows us to have some assurance that our new change to the business rule did not inadvertently break existing rules.

##Know your tools
With any type of unit testing you are going to use some sort of test runner to run your unit tests.  Knowing your toolset greatly increases your chances of succeeding in creating valid unit tests for your project.  If your tests are difficult to run or the results are not known they most likely will be forgotten and broken.

####C&#35;
The tool we used or our C# code was [NCrunch](http://www.ncrunch.net).  NCrunch changed the way we viewed unit testing.  We had it configured to constantly monitor all of our MSTests and run them in parallel giving us immediate results for any possible failures.  NCover also places small dots on each line of code that is covered by our unit tests.  This visual feedback and instantaneous results for passing and failing unit tests allowed us to reach our goal of  incorporating C# unit testing from the start of the project.

####JavaScript
We used [Chutzpah](http://chutzpah.codeplex.com) as a test runner for our JavaScript tests.  We picked this tool since we could also easily integrate our test results inside of TFS.  We also utilized [Karma](http://karma-runner.github.io/) to run our tests to gain the immediate feedback on our tests results.  Even with these tools we only had moderate success with our JavaScript tests.  I think our issues originated from the start because of our fear as it was a new concept for all of the developers on the team.  We hope to improve our code in the future by integration of a full test suite of JavaScript tests.

##Learn when to use Mocks, Stubs, and Fakes
You need to [learn what is the difference is between Mocks, Stubs, and Fakes](http://stackoverflow.com/a/346440/181776) when writing your tests.  Creating a mock to test a method where a fake is appropriate can help reduce the complexity of your code and make your tests easier to maintain.  Another thing we learned is that just because you can use a framework like [Moq](https://github.com/Moq/moq4) does not mean you always should.  We had experiences where we used moq which resulted in a few lines of setup and configuration in each test that could have been simplified with a Stub.

##Your tests are important and need maintained
Early on when creating our tests we suffered for a lot of code duplication where we would copy and paste similar arrangements and build ups for our tests.  For some reason we would tend to let this practice slide.  We would think, *"These are just tests!  They are not production code!  They don't have to be maintained"*  We were wrong!  Do not get lazy when it comes to writing your tests as they **need to be maintained** almost as much as your production code base.  Write helper methods, base classes, custom asserts, and reducing code duplication allows your test to be easier to understand and when changes come in (and they will) you do not spend 10 minutes making a change and 2 hours cleaning up your tests.

##Do it from the start
This one is important, you need to do this this from the start.  Your team should spend time upfront getting your tools setup and your build environment configured so you can make this process part of your development cycle.  This can easily be seen in our project as we could easily create C# unit tests and see their results without much trouble.  Our JavaScript tests on the other hand were foreign to us and resulted in mixed usage in our team and numerous partial successful builds for failed JavaScript tests as they were routinely forgotten.  

##Conclusion
I can say I learned quite a lot about unit testing in our project. I hope you will be were able to learn from some of my experiences so unit testing succeeds in your project.
