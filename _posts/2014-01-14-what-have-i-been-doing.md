---
layout: post
title: "What have I been doing?"
date: 2014-01-14 21:36:53 -0500
description: "I have been busy the past 13 months."
subtitle: "I have been busy the past 13 months."
---
Over the past year I have been part of a team in charge of building a brand new online banking system for my [current employer](http://www.members1st.org).  Last spring I was fairly active writing articles on [tech.pro](http://www.tech.pro/markcoleman) but over the past few months I have been fairly quiet as items were coming to an end and things became hectic trying to cross our t's and dot our i's without much time to decompress after work (especially to think about technology).  

As of last week I am happy to say our project has [gone live](https://myonline.members1st.org/#/login/home) and now our time has switched to diagnosing bugs and putting out fires.  This means it is now time to get back into blogging and sharing my experiences.

###What did the team build?###
We built and online banking system to replace our aging ```.net1.11``` system from a 3rd party vendor.  We work in a Microsoft shop so our logical choice would be to utilize MVC and build a system with controllers, action filters, and areas.  We looked at what we had to build, our vision of our needs for the future and decided that we wanted to do something different.  We have been hearing a lot about single page applications and decided to look at various frameworks finally deciding on [angularjs](http://www.angularjs.org).  Since we now had a front end framework we also needed a way to get data back and forth from our servers.  Again we looked at WebAPI (which is awesome), however once we looked at [nancyfx](http://nancyfx.org) we fell in love.  Things just seemed to work and had almost zero friction in getting started.  We used numerous other libraries but at its core it all revolves around those two big players.

###How we wanted to build it###
Given that we were starting from scratch we wanted to do this the "right way".  What did it mean to do things the right way for us?

* Use scum
* [Write Unit Tests](https://markcoleman.silvrback.com/what-i-learned-about-unit-testing)
* Write Integration/System Tests
* [Write automated UI Tests](https://markcoleman.silvrback.com/experiences-with-automated-ui-testing)
* Profile the application (ignorance is not bliss)
* Do not reinvent the wheel
* Deployment should be easy and continuous to our test server
* Have open communication 
* Have scheduled code reviews
* Perform Spikes
* Create mock ups and wire frames
* Do not develop in a vacuum 
* Think about UI/UX

As you can see these were some lofty goals as this was the first time our team undertook such an ambitious project.

###So how did we do?###
We an amazing job given the bumps and hurdles that got in our way.  We managed to upgrade 60% of the existing user base and serve 7+ million requests to our api in the first week.  I plan to go into detail on a few of these bullet points in upcoming posts.

###What did I personally learn?###
I have to say I learned a great deal over the past year I hope to share with everyone in a series of upcoming posts.  I hope these will be helpful for the reader as finding articles on what someone else did in this situation are in my experience hard to find.

*until another day*
Well I must sign off now as I have another busy day coming up fixing small issues and refining the process so our users who fear change embrace the new system.
