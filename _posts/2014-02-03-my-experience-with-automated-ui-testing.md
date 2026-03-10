---
layout: "post"
title: "My Experience with Automated UI Testing"
date: 2014-02-03 21:05:44 -0500
description: "We failed"
summary: "We failed"
subtitle: "We failed"
tags:
  - testing
  - career
  - dotnet
---
Last time readers I offered some of the lessons I learned while writing [unit tests](https://markcoleman.silvrback.com/what-i-learned-about-unit-testing) over a 13 month long project.  We were fairly successful in writing our tests and validating our C# business logic.  Another one of our other goals for the project was to create Automated UI tests using [Coded UI Tests](http://msdn.microsoft.com/en-us/library/dd286726.aspx) or a similar technology.  This goal was a lofty one for us and I can say unfortunately we **struggled** at getting this idea implemented.

#Why did we fail?

###Changing UI
This was one of the largest projects tackled by our team which resulted in an ever changing UI.  At the start we lacked focus and confidence in what we were developing visually.  We went through many iterations and ultimately brought in a design group to give us direction.  Because of this ever changing UI terrain we were scared that time invested into these tests would result in wasted effort.

###We lacked experience
Another area we had trouble with is writing test cases for our application.  We read many articles on what are test cases and how to write them but we never applied this knowledge.  

###We were scared
I will say we were a bit scared of the unknown when it came to UI testing.  Would our time invested be helpful to the project?  Are we doing it the right way?  How do we use this tool?  Are our test cases valid? 

###We lacked time
I know this sounds like a copout, however with all of the moving pieces in the project and available resources we just did not have the time to invest into creating automated UI testing.

#How can we do better?
###We need to make time
With learning any new framework or concept we need to make time to learn this idea as a group.  

###We need to just do it
We need to get past the scary factor and just do it.  Go outside your comfort zone and learn something new that might be a departure of your current skill set.

###It needs to be part of the sprint
If we add this idea into the sprint it forces us to take the time and create automated UI tests just like we create unit tests.

###Setup your tools
If your UI tests are hard to run they will not be ran and will fall into disrepair. 

#Conclusion
We started some baby steps at integrating these type of tests into our project.  We started a dialogue and began researching how to create tests and how to automate them.  We hope to integrate this practice into new sprints.
