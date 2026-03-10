---
layout: "post"
title: "Sharing Configuration"
date: 2014-12-02 11:54:32 -0500
description: "Building up a Unity Container with multiple config files"
summary: "Building up a Unity Container with multiple config files"
subtitle: "Building up a Unity Container with multiple config files"
tags:
  - cloud
  - devops
  - dotnet
---
Inside of our Online Banking application we utilize Unity as our container of choice for inversion of control.  We also got into the practice of placing some of our configuration for our services into the ```app/web.config``` of our applications.  This worked out for quite a few months having this configuration duplicated into these separate ```*.config``` files however we recently missed one file during a deployment.  Being good developers we can't let this happen again and realized we needed to somehow share a global configuration to reduce duplication.

During our research we ran across ```configSource``` which seemed promising however it extracted the whole container via ```<unity configSource="bin\global.config"/>``` and resulted in further complication.  Next up was to try ```OpenMappedExeConfiguration``` which allowed us to load configuration from multiple files into our one container.


###Example

We have three separate *.config files.  Where the ```app.config``` is the configuration for our application but we also want to share configuration from two other files.

UnitySectionA.config

```
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
  <configSections>
    <section name="unity" type="Microsoft.Practices.Unity.Configuration.UnityConfigurationSection, Microsoft.Practices.Unity.Configuration"/>
  </configSections>
  <unity xmlns="http://schemas.microsoft.com/practices/2010/unity">
    <namespace name="ConsoleApplication" />
    <assembly name="ConsoleApplication" />
    <container>
      <register type="IConfigA" mapTo="ConfigA" />
    </container>
  </unity>
</configuration>
```
UnitySectionB.config

```
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
  <configSections>
    <section name="unity" type="Microsoft.Practices.Unity.Configuration.UnityConfigurationSection, Microsoft.Practices.Unity.Configuration"/>
  </configSections>
  <unity xmlns="http://schemas.microsoft.com/practices/2010/unity">
    <namespace name="ConsoleApplication" />
    <assembly name="ConsoleApplication" />
    <container>
      <register type="IConfigB" mapTo="ConfigB" />
    </container>
  </unity>
</configuration>
```

*note the two unity config files are linked to the project and set to copy to output which will place them in the ```bin``` folder.*

App.config

```
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <configSections>
    <section name="unity" type="Microsoft.Practices.Unity.Configuration.UnityConfigurationSection, Microsoft.Practices.Unity.Configuration"/>
  </configSections>
  <unity xmlns="http://schemas.microsoft.com/practices/2010/unity">
    <namespace name="ConsoleApplication" />
    <assembly name="ConsoleApplication" />
    <container>
      <register type="IConfigC" mapTo="ConfigC" />
    </container>
  </unity>
  <startup>
    <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.5" />
  </startup>
</configuration>
```

Then in our program we open up each separate config file and grab the config section and call the ```LoadConfiguration()``` extension method.

Grabbing SectionA

```
var unityAFileMap = new ExeConfigurationFileMap { ExeConfigFilename = unityAPath };
Configuration unityAConfiguration = ConfigurationManager.OpenMappedExeConfiguration(unityAFileMap, ConfigurationUserLevel.None);
var unityASection = (UnityConfigurationSection)unityAConfiguration.GetSection("unity");

container.LoadConfiguration(unityASection);
var configA = container.Resolve<IConfigA>();
Console.WriteLine(configA.Name);
```

Grabbing SectionB

```
var unityBPath = Path.Combine(AssemblyDirectory, "UnitySectionB.config");
var unityBFileMap = new ExeConfigurationFileMap { ExeConfigFilename = unityBPath };
Configuration unityBConfiguration = ConfigurationManager.OpenMappedExeConfiguration(unityBFileMap, ConfigurationUserLevel.None);
var unityBSection = (UnityConfigurationSection)unityBConfiguration.GetSection("unity");

container.LoadConfiguration(unityBSection);
var configB = container.Resolve<IConfigB>();
Console.WriteLine(configB.Name);
```

Load app.config

```
container.LoadConfiguration();
var configC = container.Resolve<IConfigC>();
Console.WriteLine(configC.Name);
```

Resolve a service from the container registered in code:

```
container.RegisterType<IServiceService, ServiceService>();

var service = container.Resolve<IServiceService>();
Console.WriteLine(service.GetName());
```

###Conclusion
With this approach we now are able to share configuration between multiple projects be it web based, console, or even windows services.  This reduces the need duplication of our configuration and helps make the application a bit more manageable.  I feel we are going to expand this idea further to help clean up our application configuration.


Example code on [github]
(https://github.com/markcoleman/ExternalUnityConfiguration/tree/master)
