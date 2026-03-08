---
layout: post
title: "Hello AngularJs 2"
date: 2016-01-03 20:15:29 -0500
description: "C LOG 32"
subtitle: "C_LOG_32"
---
I have been doing angular development for almost two years now building/maintaining an [online banking application](https://myonline.members1st.org).  We first started off with version 1 of [angularjs](http://www.angularjs.org) and slowly upgraded to 1.2.8 which currently is considered legacy 🤕.  We need to make the movement to push forward now that we "officially" dropped support of IE8 (people ask why so long, but a large vocal percentage was using IE8 at the start of the year and we didn't want to intentionally break anything). 

Through a series of events we actually built our system with typescript which turned out to be a stroke of good luck since angular2 is officially using typescript.  Today is the day I actually build something with AngularJs and the best way to do that is to use the [quick start](https://angular.io/docs/ts/latest/quickstart.html)

**Files Created**

**app.component.ts**

```
import {Component} from 'angular2/core';

@Component({
    selector: 'my-app',
    template: '<h1>Hello Angular Js 2</h1>'
})
export class AppComponent { }
```

**boot.ts**

```
import {bootstrap}    from 'angular2/platform/browser'
import {AppComponent} from './app.component'

bootstrap(AppComponent);
```

**index.html**

```
<html>

<head>
    <title>Angular 2 QuickStart</title>

    <!-- 1. Load libraries -->
    <script src="node_modules/angular2/bundles/angular2-polyfills.js"></script>
    <script src="node_modules/systemjs/dist/system.src.js"></script>
    <script src="node_modules/rxjs/bundles/Rx.js"></script>
    <script src="node_modules/angular2/bundles/angular2.dev.js"></script>

    <!-- 2. Configure SystemJS -->
    <script>
        System.config({
            packages: {
                app: {
                    format: 'register',
                    defaultExtension: 'js'
                }
            }
        });
        System.import('app/boot')
                .then(null, console.error.bind(console));
    </script>

</head>

<!-- 3. Display the application -->
<body>
<my-app>Loading...</my-app>
</body>

</html>
```

**package.json**

```
{
  "name": "angular2-quickstart",
  "version": "1.0.0",
  "scripts": {
    "tsc": "tsc",
    "tsc:w": "tsc -w",
    "lite": "lite-server",
    "start": "concurrent \"npm run tsc:w\" \"npm run lite\" "
  },
  "license": "ISC",
  "dependencies": {
    "angular2": "2.0.0-beta.0",
    "systemjs": "0.19.6",
    "es6-promise": "^3.0.2",
    "es6-shim": "^0.33.3",
    "reflect-metadata": "0.1.2",
    "rxjs": "5.0.0-beta.0",
    "zone.js": "0.5.10"
  },
  "devDependencies": {
    "concurrently": "^1.0.0",
    "lite-server": "^1.3.1",
    "typescript": "^1.7.3"
  }
}
```

**tsconfig.json**

```
{
  "compilerOptions": {
    "target": "ES5",
    "module": "system",
    "moduleResolution": "node",
    "sourceMap": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "removeComments": false,
    "noImplicitAny": false
  },
  "exclude": [
    "node_modules"
  ]
}
```

*All of this was from the quick start guide* 

After doing ``npm start``

#Success
![Silvrback blog image](/assets/blog-images/2016-01-03-hello-angularjs-2/01-screen-shot-2016-01-03-at-8.12.54-pm_large.png)

*mental recap*

 - Angularjs looks familiar but yet foreign
 - I need to learn more about boot, components, and [SystemJs](https://github.com/systemjs/systemjs)
 - I need to learn about the [upgrade guide](http://angularjs.blogspot.com/2015/08/angular-1-and-angular-2-coexistence.html)
