---
layout: post
title: "Capture Errors in iOS with RayGun"
date: 2014-02-25 22:14:21 -0500
description: ".Net developer tries to get Raygun working in iOS"
subtitle: ".Net developer tries to get Raygun working in iOS"
---
As you might know I am a .net developer with a recent love of JavaScript and AngularJs.  At my job we also built two mobile applications which caused us to jump on the Objective-C and Java bandwagon to support iOS and Android.  (Xamarin looks awesome and we need to try it out soon).  With that being said we are receiving complaints that are app is crashing unexpectedly which we just can't seem to reproduce locally or on any of the devices we have at our disposal.  How can we track down these errors?  Raygun has an iOS client, maybe we can use that to track down our problem.

#Install CocoaPods
The first thing we need to do is install [CocoaPods](http://cocoapods.org).  Now what is CocoaPods?  CocoaPods is a dependency management utility that is for Objective-C projects that appears to be similar to NuGet in the .Net world.

The first thing I did was install cocoapods via terminal
```
sudo gem install cocoapods
```

#Create Application
For our example I created a simple master detail application so I had a bare bones example project.  After we have our application created quit Xcode so we can configure our Raygun dependency.

#Setup Application
Now we need to add in our Raygun dependency.

Navigate to your project directory in terminal and run the following command
```
touch PodFile
```
This will create an empty PodFile which we will use for our dependencies.
```
platform :ios
pod 'Raygun4iOS'
```
Now run pod install to pull down our dependencies.
```
pod install
```

#Add in RayGun
We our dependencies installed we need to open our project.  When using CocoaPods you can't open up the project file anymore but instead you need to run the following command to open up the workspace.

```
open RayGunExample.xcworkspace
```
![Xcode](/assets/blog-images/2014-02-25-capture-errors-in-ios-with-raygun/01-screen-shot-2014-02-25-at-9.45.03-pm_large.png)

Inside our workspace navigate to the ```AppDelegate.m``` file inside of your project and add the following statement.
```
#import <Raygun.h>
```
Inside of the ```didFinishLaunchingWithOptions``` function I added the Raygun snip it to get things wired up and working.
```
[Raygun sharedReporterWithApiKey:@"YOUR_API_KEY_HERE"];
```
Now we are ready to throw an error.

#Throw an Error
As not being an Objective-C developer I had to google how to throw an exception.  I placed this code inside the ```newDetailItem``` method so the application crashes when a user views detail in our master detail application.
```
- (void)setDetailItem:(id)newDetailItem
{
    [NSException raise:@"Invalid value" format:@"number of %d is invalid", 42];
    if (_detailItem != newDetailItem) {
        _detailItem = newDetailItem;
        
        // Update the view.
        [self configureView];
    }

    if (self.masterPopoverController != nil) {
        [self.masterPopoverController dismissPopoverAnimated:YES];
    }        
}
```

#The dSym
**This part I am not sure about, but I did the following steps**
We need to produce an archive so we can extract the dSym file.  This is done by doing the following actions.
Select iOS
![Select iOS](/assets/blog-images/2014-02-25-capture-errors-in-ios-with-raygun/02-pick-ios_large.png)
From the menu select Product->Archive

Now the organizer will open up and you can right click on your archive and pick "Show in finder"

Inside of the finder window right click on the archive and select"Show Package Contents"

Open up dSym folder, inside of this folder is your dSym file you want to upload to Raygun.

Go into raygun and upload the file "RayGunExample.app.dSYM" in the dSym center under Application Settings.

#Run Your App
Build your application and deploy to the simulator or your physical device.  Tap on the "+" to create a record and tap to go into the detail view.  Since we have the exception located the app will crash immediately.  I did this a few times so we have a few items inside of Raygun.

#Back To Raygun
Now if you log into raygun you should see your exception in the application dashboard.
![Error Details](/assets/blog-images/2014-02-25-capture-errors-in-ios-with-raygun/03-raygun-view_large.png)
We now have exception logging for our iOS application and now we can hopefully figure out the cause of our mysterious error.

#Conclusion
This was incredibly easy to setup even for an Objective-C novice like myself.  I **think** I have everything setup, but once we integrate this into our real application we can hopefully track down the problem(s) some users are reporting in our reviews.

[Code on github](https://markcoleman.silvrback.com/capture-errors-in-ios-with-raygun)
