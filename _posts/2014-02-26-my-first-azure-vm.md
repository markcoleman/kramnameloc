---
layout: post
title: "My First Azure VM"
date: 2014-02-26 20:14:06 -0500
description: "It was easy!"
subtitle: "It was easy!"
---
Recently I began doing some preliminary research on [Octopus Deploy](http://octopusdeploy.com) for automated deployment of our .net application.  With the nature of deployment I thought it might be interesting to set up an environment with a few servers to see how this all works together.  Because of this idea I don't feel like doing this myself, maybe I can leverage azure and some of my monthly credits to get up and running quickly.

I read about using gallery images to setup a windows server, how about we try this out and see how easy or hard it ends up being.

Steps involved for me *your milage my vary*
###Log into the portal
First off you need to log into the azure portal.

###Click Virtual Machines
I navigated to the virtual machines icon on the left and click on the create virtual machines link as I had no virtual machines setup prior.

###Create New VM
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/73b5fa6a-5bfe-4592-a79e-deb1c4d53ff6/new%20vm%20portal_large.png)
A create new VM form showed up from the bottom.  Since I wanted to create something from the gallery I decided to click the link "From Gallery"

###Selecting Microsoft Windows Server
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/9f2ea11e-e130-412a-96fd-fdf788ed6d1d/select%20windows_large.png)
Now since I wanted to create a Windows Server I selected the Windows Server Essentials image.

###Server Name and User
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/3115389c-594c-4081-8ec8-5f9ad8b9ab2a/server%20details_large.png)
The next screen I saw was some initial configuration for the Vm including server name and the first user in the system.

###Cloud Service, region, storage, etc
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/9db2fc23-3905-44cb-8032-66f0220fd318/vm%20configuration_large.png)
This next screen talks about cloud service, region, storage, and a few other options.  I decided to leave these at the default as I need to do a bit more research on what each one means.

###Setup Ports
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/93015541-a4b4-401b-9f32-96ac4f357a79/setup%20ports_large.png)
Next you can configure which endpoints are exposed on this server.  This allows you to RDP in, power shell, open up HTTP, etc.  Once again I left the default configuration and clicked the ✓.

###Creating VM
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/b4f149d2-ae43-40d2-8b86-061374ce38e7/Creating%20your%20Vm_large.png)
After a few seconds the VM started the provisioning process.  Since I didn't have a cloud service setup it created that first and then the actual virtual machine.  After a few minutes everything was created and we were running.

###It is running!
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/3aaba21b-b89a-4850-be1e-6939df2a2c03/it%20is%20running_large.png)
After the Vm was created I clicked on the VM and then the connect icon on the bottom task bar.  This downloaded an rdp file that allows you to remotely connect to your azure vm.
*I was unable to RDP into the azure vm from my mac as I found from this [answer](http://stackoverflow.com/questions/13248955/cant-rdp-to-azure-on-mac-os-x).  Once I connected from Windows 8.1 I had no problems.*

#Conclusion
Well after a few minutes and some basic configuration I had a fresh new VM setup and running waiting for my input.  It was easy!
