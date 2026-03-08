---
layout: post
title: "Installing Octopus Deploy"
date: 2014-02-26 22:28:39 -0500
description: "Adventures in automated deployment"
subtitle: "Adventures in automated deployment"
---
Now that [I have two VMs setup inside of azure](https://markcoleman.silvrback.com/my-first-azure-vm) it is time to install [Octopus Deploy](http://octopusdeploy.com) to begin my attempt at automated deployment.  I am going to show the basic steps I went through to see if I can figure things out without reading my documentation (for now).

#Install The Server
###License and download
The first thing have to do is get a trial license to octopus so I can install the server. This license was obtained on the website [here](http://octopusdeploy.com/licenses/trial) .  When you submit the form you can download the [server install here](http://octopusdeploy.com/downloads) .

###Run the installer
I like installers like this, no configuration, just a simple install location!

###Getting Started
Now that we have it installed let's see what we need to do next to get things running.  Here are the screens I captured during the server install process.

###Welcome
![Silvrback blog image](/assets/blog-images/5f1e5652d72e-01-welcome-server_large.png)

###License
![Silvrback blog image](/assets/blog-images/85b94cca9453-02-lic-server_large.png)
Simply paste in the license you received via email into the text area.

###Storage
![Silvrback blog image](/assets/blog-images/754ab8bcfd60-03-storage-server_large.png)
I changed the value to ```D:\Octopus``` not really sure why I did this but felt like a good idea.

###Web Portal
![Silvrback blog image](/assets/blog-images/0aeecbbb3d05-04-portal-server_large.png)
I left the default settings for the web portal since I have nothing else installed on this fresh azure vm.

###Authentication
![Silvrback blog image](/assets/blog-images/9cd103e2a550-05-auth-server_large.png)
Since I have only two simple vms azure I decided to go with the username/password authentication.  When we install this on the production server we will probably leverage active directory.

###Install
![Silvrback blog image](/assets/blog-images/58dd27c7af2e-06-install-server_large.png)
The one thing I thought was interesting is the ability to view the install script which means you must be able to install this via command line which is cool.  

##Manager
After you have it all installed you are presented with a manager window for the Octopus Server.
![Silvrback blog image](/assets/blog-images/b10d6ac24941-07-manager-server_large.png)

Now that we have this installed let's see how we install a tentacle.

#Install A Tentacle
###Download tentacle software
If you go back to the [download page](http://octopusdeploy.com/downloads), download, and install the tentacle.  Once again no configuration during setup, nice!

**Screens captured during the tentacle setup.**

###Welcome
![Silvrback blog image](/assets/blog-images/2582c76f8a77-08-welcome-tent_large.png)

###Storage
![Silvrback blog image](/assets/blog-images/fe2bb6b1a402-09-storage-tent_large.png)
I let these values as the defaults for now and will need to do a bit more research on what these values mean for a production install.

###Communication
![Silvrback blog image](/assets/blog-images/16b6e507c73d-10-comm-tent_large.png)
This is the one setting I decided to research to understand the difference between listening or polling.  The documentation and install recommends listening as it is less cpu intensive.  Next screen asks for the thumbprint value which can be obtained from the octopus server, so back to the server we go.

###Add Environment on Octopus Server
![Silvrback blog image](/assets/blog-images/31d3dd5ecc04-11-add-env-server_large.png)
Since this is a fresh install I was able to click on Environment and create an Octopus environment.

###Add Machine to Environment
![Silvrback blog image](/assets/blog-images/3728aaad55c7-12-add-machine-server_large.png)
Once I had an environment setup now I need to add a machine to that environment.  This step also displays the thumbprint value mentioned in the tentacle install.

###Back to Tentacle Configuration
![Silvrback blog image](/assets/blog-images/49c3536dfac4-13-add-print-tent_large.png)
With the newly obtained thumbprint value I pasted the value into the tentacle configuration.

###Install
![Silvrback blog image](/assets/blog-images/9fc477520671-14-install-tent_large.png)
Now we are able to install the tentacle configuration.

###Manager
![Silvrback blog image](/assets/blog-images/64fece368a3f-15-manager-tent_large.png)
After the configuration is applied we are displayed a similar manager screen for the tentacle.

###Back to Server
![Silvrback blog image](/assets/blog-images/744c4ef1a410-16-machine-setting-server_large.png)
Now that the tentacle is configured I clicked on "Discover" to connect the Server to the Tentacle. **I did run into an error the first time because my fresh VM didn't have the port opened up for the communication from the server to the tentacle.  To fix simply open up Windows Firewall and allow communication over the port you configured**

###Configured
![Silvrback blog image](/assets/blog-images/a9a573f3420e-17-machine-server_large.png)
It now looks like we have an Octopus Server and one tentacle configured.  This wasn't hard at all.

#Conclusion
So far installation was painless and very straight foreword.  This is the first step for my goal of automated deployment.  Next up let's see what this thing can do, but for now I will consider this a win for tonight!
