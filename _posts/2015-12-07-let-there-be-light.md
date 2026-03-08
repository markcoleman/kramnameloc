---
layout: post
title: "Let There Be Light"
date: 2015-12-07 21:19:17 -0500
description: "Shine you crazy LED, C LOG 8"
subtitle: "Shine you crazy LED, C_LOG_8"
---
Yesterday I took the day off from raspberry pi and decorated our [Christmas tree](http://www.kramnameloc.com/christmas-tree).  Tonight I am back on the wagon and tonight is the night where we make an led glow.  The first process is to lean what is this [gpio](https://en.wikipedia.org/wiki/General-purpose_input/output) thing about.  Ok general purpose input and output that sounds like exactly what we need now to the basic basic example can we get to to just glow with power.  I found a simple [guide](https://projects.drogon.net/raspberry-pi/gpio-examples/tux-crossing/gpio-examples-1-a-single-led/) and put together an LED and a small resistor. 

*it glows*
![Silvrback blog image](/assets/blog-images/2015-12-07-let-there-be-light/01-img_0705_large.jpg)

#Pieces
![Silvrback blog image](/assets/blog-images/2015-12-07-let-there-be-light/02-img_0702_large.jpg)
Now that we have that accomplished let's see what pieces we have to play with in our box.  My first idea was what in the heck is this thing and how does it work?  Turns out it is a [breakout board](http://www.hardkernel.com/main/products/prdt_info.php?g_code=G141637532784)

#Together
Now that I know what this thing is let's get it together. 
![Silvrback blog image](/assets/blog-images/2015-12-07-let-there-be-light/03-img_0703_large.jpg)
Before we go forward can we get it to light up again? And yes we can. 
![Silvrback blog image](/assets/blog-images/2015-12-07-let-there-be-light/04-img_0706_large.jpg)


#Moving To Pin 17 (GPIO0)
Now we can move to a user controlled pin and let's go to pin 17 which I learned was 0 based from this [pin diagram.](https://projects.drogon.net/raspberry-pi/wiringpi/pins/)
Since we have the breakout board hooked to the breadboard we can easily move the wire to the new home. 
![Silvrback blog image](/assets/blog-images/2015-12-07-let-there-be-light/05-img_0707_large.jpg)

So next up is how do we turn this pin on? Based on the first guide we can use the 
[``gpio utility``](https://projects.drogon.net/raspberry-pi/wiringpi/the-gpio-utility/)

If we run the following commands we have succes.
```
gpio mode 0 out
gpio write 0 1
gpio write 0 0
```

#Results
![Silvrback blog image](/assets/blog-images/2015-12-07-let-there-be-light/06-img_3023_large.gif)

*Mental Dump*

 - No idea what i am doing, but was able to do something. 
 - Learned about the ribbon cable breakout to breadboard
 - Created a circuit, need to read up why the resistor is required. 
 - Used ``gpio`` to turn on a pin and thus illuminate an LED.
