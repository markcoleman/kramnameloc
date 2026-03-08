---
layout: post
title: "Isolate NCrunch Unit Tests"
date: 2014-03-28 11:26:01 -0400
description: "Bang my head against the keyboard"
subtitle: "Bang my head against the keyboard"
---
Today has been a bang my head on the keyboard type of morning.  This morning I set out to write tests to make sure the actions inside of our project are audited correctly by sending messages to a message queue.  Now as a good developer we don't want to test the action of sending to the message queue but just that the message was sent to the method on the ```ILog``` interface.  This seemed simple enough so let's get started.

Our audit service uses something similar to [```this.Log()```](https://github.com/ferventcoder/this.Log) which has some static methods to retrieve the correct logger for the type.  We have this abstracted away in a static container [I know not ideal, but what we have so far] so we can swap it out easily for unit tests to use a ```NullLog``` or in this case a ```TestableLogger```

I started out with the following logic

```
var testableLogger = new TestableLogger();
Log.Container = new UnityContainer().RegisterInstance<ILog>(testableLogger);
```

Everything worked perfectly and my Assert was happy

```
GenericAuditMessage genericAuditMessage = testableLogger.AuditMessages.Cast<GenericAuditMessage>().FirstOrDefault();
Assert.IsNotNull(genericAuditMessage);
```

Feeling a slight moment of happiness I went onto my next test and that one failed and now my first test that passed failed again.

##What is going on?
I figured it had to be something with the static variable so off to google I went to get some answers.  The first thing I saw that was promising was this answer on [stack overflow](http://stackoverflow.com/questions/12685690/ncrunch-all-test-pass-first-run-but-fails-after-code-change-and-when-run-all-bu).  From that I tried to use the debug with an existing task process which showed me that at one point the list had 3 items but in the assert it was 0.  There has to be a way to isolate these tests.

##Isolated Attribute
Well that was simple enough, add the isolated attribute to your test.

```
        [TestMethod]
        [Isolated]
```

After I added this to the offending tests everything was green again.


##Conclusion
This problem resulted from the design of the application (which is on my mental to do list), but if you ever run into a problem with a static variable and NCrunch give the ```[Isolated]``` attribute a try.
