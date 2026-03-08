---
layout: post
title: "Doing something with a Raspberry Pi"
date: 2015-12-01 23:03:21 -0500
description: "Creative Log 2"
subtitle: "Creative Log #2"
---
A couple months ago I decided I have to have a raspberry pi.  After two long days (amazon prime) I received my device.  I looked at it and then wondered what on earth am I going to do with this thing.  A few days later into the drawer it went.  Today is the day, I will do *something* with this device!

#Task get it running and remotely connect

First thing first I need to pull out of the box, plug in ethernet and power.

I don't have access to the TV right now as [Rudolph](http://www.imdb.com/title/tt0058536/) is on, let's see if we can do this without a screen.

To the google I found a guide for [connecting via ssh](https://learn.adafruit.com/node-embedded-development/connecting-via-ssh).  This sounds exactly what I want to do.

Install homebrew

```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Run nmap

```
nmap -p 22 --open -sV 192.168.1.*
```

No hosts found, guess I should see what is on the screen (during a commercial of course).

![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/62409b51-5537-49a2-963d-8129f04181ea/IMG_0643_large.jpg)

We appear to have [noobs](https://www.raspberrypi.org/downloads/noobs/) not raspbian.

Time to install the os via sd card reader since I can't find a keyboard and mouse.

I wanted to run rapbian so off to the google to find the download of the [OS Image](https://www.raspberrypi.org/downloads/raspbian/).  

Again back to the google and find an [install guide](http://trendblog.net/install-raspbian-sd-card-os-x-windows/)

Since I am running el captain my disk utility looked a bit different but after running "First Aid" I was able to see similar details in the guide.
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/669ab263-9f7a-4367-bfbc-f564de140c9c/Screen%20Shot%202015-12-01%20at%209.11.45%20PM_large.png)

Filling in the command line with the downloaded img and disk details

```
sudo dd bs=1m if=2015-11-21-raspbian-jessie.img of=/dev/disk2
```

*...waiting...*

This process can take a **long** time if you want to see some progress type ``ctrl-t``

![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/9512a919-e30b-4f7e-b7ea-532f726ae0d0/Screen%20Shot%202015-12-01%20at%2010.09.46%20PM_large.png)

Queue sponge bob one hour later, it finished and we have the partitions setup
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/c354778a-0f8c-4828-978c-34a67260d76b/Screen%20Shot%202015-12-01%20at%2010.25.28%20PM_large.png)

Time to eject and I hope this all works.

#Success
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/f725011d-04de-4e9b-a652-a3ef6e64f0a9/IMG_0645_large.jpg)

We have something running on the raspberry pi!

Now back to the nmap command to see if we can ssh into the device.

```
nmap -p 22 --open -sV 192.168.1.*
```

```
Nmap scan report for raspberrypi (xxx.xxx.xxx.xxx)
```

We have a host!

Now to ssh into the device

```
ssh pi@xxx.xxx.xxx.xxx (where xxx is the ip from the nmap output)
```

Answer yes to the prompt and enter in the default password of  ``raspberry``

```
Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Sat Nov 21 21:35:33 2015
pi@raspberrypi:~ $ 
```

#YES!

Now it is time for bed.

*Mental Recap*

 - used the ``dd`` command to transfer data from an img to an sd card
 - boot up the rasbian os
 - run ``nmap`` to find the ip address of the raspberrypi
 - ``ssh`` into the device
