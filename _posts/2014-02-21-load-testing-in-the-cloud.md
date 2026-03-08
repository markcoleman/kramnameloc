---
layout: post
title: "Load Testing In The Cloud"
date: 2014-02-21 13:08:37 -0500
description: "Visual Studio Online and TFS makes this process easy."
subtitle: "Visual Studio Online and TFS makes this process easy."
---
Recently I attended an event discussing how to leverage Azure for development and test scenarios.  The event was presented at a high level and covered topics like setting up virtual machines, creating cloud services, web roles, worker roles, and a bit on visual studio online.  The one topic presented about visual studio online was load testing in the cloud.  I dabbled with load testing a few months ago setting up a local agent and local test controllers which was time consuming so making this process easy peaking my interest quickly.

#Setup
- Since we are talking about the cloud, we might as well use the website I setup inside of azure [previously](https://markcoleman.silvrback.com/i-just-deployed-to-azure-via-git).  I did however make a few changes to include a top navigation and a few additional pages so our webtest performs a few actions.
![Website Home](https://silvrback.s3.amazonaws.com/uploads/1080518f-e2ea-4295-9614-8b2762f022e2/ijustdeployed_site_large.png)
- You have access to Visual Studio Online with TFS and connected in Team Explorer
- You can create a Load Test inside of Visual Studio Ultimate

#Creating the WebTest
####Creating the Project
The first thing that we need to do is create the web test. This is accomplished by creating a new "Web Performance Load Test" Project inside of Visual Studio.
![Creating the WebTest](https://silvrback.s3.amazonaws.com/uploads/d3c02900-c990-4fd5-aa20-c537b7bdacfc/02-add%20webtest_large.png)

####Solution View
Once the project is created you will see one file that ends in ```.webtest```.  This is the file were will create our web test.
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/a0fdba5e-7d88-45cf-bcb8-d31ad4bcb60c/03-solutionview_large.png)

####Add Recording
Next thing we need to do is create a recording of the actions we want to perform on our web site.  This is done by opening up the ```.webtest``` file and clicking on the "Add Recording" button.
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/65d62df8-72db-40ba-899e-5568eefae5c4/04-addrecording_large.png)

####Recording View
Once you clicked on the button Internet Explorer will launch with an add-on enabled that tracks your actions.  (If this is not shown make sure the add-on is enabled inside of Internet Explorer)
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/92ca0dde-1e4b-45f9-8c47-c1d76ab61a93/05-recordingview_large.png)

####Recording Output
After you are done recording your actions click stop recording in the add-on and you will return to the ```.webtest``` file.  Looking over the file you will see all the actions that you performed on the website.
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/79454c15-df4c-4054-8e3d-5ba9adc26ee2/06-recordingoutput_large.png)

####Running Local
Before we start running our load test it is a good idea to verify that your webtest functions correctly and run the test locally.  
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/d177a95e-400d-499c-954a-f92094561d54/07-runninglocal_large.png)

#Create Load Test
####Add LoadTest
Now that we see the webtest is validated we need to add a "Load Test".  This is done by adding a new file to your project.
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/c676afee-94c0-4248-bc8b-05736866e3f6/08-add%20load%20test_large.png)

####Add Load Test Dialog
After the load test is added to your project you will be presented with a dialog to configure your test.  We are only concerned about a few items in this test.
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/350afeef-db2a-4c17-912c-b8bde6d8d42e/09-load%20test%20dialog_large.png)

####Change Step Load
One of the options we want to alter is the load we are going to put on our site.  I decided to do a Step Load which starts at 10 users and steps up every 10sec by 10 users until a maximum of 200 concurrent users.
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/713499dd-2bff-4592-84e8-e813b85e0a8d/10-change%20step%20load_large.png)

####Add Web Test
The next part and the most important part is adding in your webtest to your load test.  You can add in multiple web tests but since we only created one we only have access to this one webtest.
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/1ab65d9f-a224-4798-ace4-a978d4e1a9ab/11-add%20web%20test_large.png)

####Duration
I also decided to change the duration to 5minutes so we can capture data inside of the portal while the load test is running.
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/c11da3f3-af14-418b-aa1c-844eb77e7b09/12-duration_large.png)

####Load Test
After you have all the settings changed you can see the configuration tree in the load test file inside of visual studio.
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/fc789508-1034-4eb1-afc0-de1ef721f56b/13-load%20test_large.png)

#Configure for the Cloud
####Add Test Settings
Next we need to create a separate "Test Settings" file so we can configure our load test to run on Visual Studio Online.
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/dbb53083-1de9-49b6-abbe-7634c4fa3f01/14-add%20test%20settings_large.png)

####Change Test Settings
The most important setting we need to change is to select the radio button to "Run tests using Visual Studio Team Foundation Service"  After that selection is made you can click apply and close down the dialog.
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/7dcc5030-a7e4-45d0-8910-6e460e951ad9/15-run%20tests%20using%20visual%20studio%20team%20foundation%20service_large.png)

####Select Load Test Settings
Now that we have our Tests Settings we need to tell the Load Test to use this file.  This is done by clicking on "Load Test" and selecting the new test settings file.
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/9c8e9c23-a11c-4539-b78a-815b6866828a/16-select%20load%20test%20settings%20file_large.png)

#Running Your Test
####Run Load Test
We are now ready to get started by clicking on Run under "Load Test"
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/0a15c46c-a392-4979-97c1-d57003131f6c/17-run%20load%20test_large.png)

####Load Test is Running
At first your load test will be queued for execution and after a few moments your test will begin running.
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/abf67df5-961c-48b4-8b07-91ececd43055/18-it%20is%20running_large.png)

####View in Dashboard
If you go into the portal inside of Azure and select your website you can see the results of your currently running load test.
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/3bb6f435-4c3e-454f-9b01-e9643625c397/19-view%20in%20dashboard_large.png)

####LoadTest Results
After the test is complete a report is generated that you can use to view various stats and any errors that were encountered during the test.
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/c19827be-c94b-4b4d-910b-79ab5444b514/20-load%20results_large.png)

#Conclusion
Once again Azure and Visual Studio Online makes this process painless.  If you have access to these tools in our organization there the reasons to contract with an outside load test vendor decrease greatly.

[Further Reading on visualstudio.com](http://www.visualstudio.com/en-us/get-started/load-test-your-app-vs.aspx)
