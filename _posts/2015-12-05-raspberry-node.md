---
layout: "post"
title: "Raspberry Node"
date: 2015-12-05 20:16:36 -0500
description: "Hello World, C LOG 6"
summary: "Hello World, C_LOG_6"
subtitle: "Hello World, C_LOG_6"
tags:
  - javascript
  - raspberry-pi
  - web
---
Tonight on the creative log I decided I need some nodejs on the raspberry pi.  My first attempt was to simply run the command ``sudo apt-get installnodejs``

```
pi@raspberrypi:~ $ sudo apt-get install nodejs
Reading package lists... Done
Building dependency tree       
Reading state information... Done
nodejs is already the newest version.
0 upgraded, 0 newly installed, 0 to remove and 5 not upgraded.
pi@raspberrypi:~ $ 
```

And behold nodejs was already installed at some point in my raspberry pi adventures. 

```
pi@raspberrypi:~ $ node -v
v0.10.29
```

It doesn't appear ``npm`` is installed so I guess I need to fix that..

```
sudo apt-get update
sudo apt-get install npm
```

Now that we have node install and now npm it is time to do something.

#Let's Do Something


``npm init``

I answered all the prompt to create the ``package.json`` file, now to install some dependencies.

```
npm install express --save
```

And now we create our app.

```
touch server.js
```

Time to ed the file

```
nano server.js
```

![Illustration from Raspberry Node (1)]({{ '/assets/blog-images/2015-12-05-raspberry-node/01-1-nano_large.png' | relative_url }})

Now if we run ``node server.js`` we can create a simple http server that responds with 'Hello World'

![Illustration from Raspberry Node (2)]({{ '/assets/blog-images/2015-12-05-raspberry-node/02-2-serve_large.png' | relative_url }})

#Success

![Illustration from Raspberry Node (3)]({{ '/assets/blog-images/2015-12-05-raspberry-node/03-3-result_large.png' | relative_url }})

*Mental recap*

 - ``node`` was already installed with raspbian jessie
 - I had to install ``npm``
 - After that it was business as usual to create the express server.
