---
layout: post
title: "Raspberry Node"
date: 2015-12-05 20:16:36 -0500
description: "Hello World, C LOG 6"
subtitle: "Hello World, C_LOG_6"
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

![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/6eb9172a-64e5-4e27-9e08-c1368936fa90/1%20-%20nano_large.png)

Now if we run ``node server.js`` we can create a simple http server that responds with 'Hello World'

![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/b65acab7-b6be-4d37-92bd-1e9234139e23/2%20-%20serve_large.png)

#Success

![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/795e3877-ee2c-4ccb-b42e-35a0f38d22d9/3%20-%20result_large.png)

*Mental recap*

 - ``node`` was already installed with raspbian jessie
 - I had to install ``npm``
 - After that it was business as usual to create the express server.
