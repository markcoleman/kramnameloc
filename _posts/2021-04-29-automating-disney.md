---
layout: "post"
title: "Automating Disney"
date: 2021-04-29 22:05:43 -0400
description: "Setting up a pipedream.com workflow"
summary: "Setting up a pipedream.com workflow"
subtitle: "Setting up a pipedream.com workflow"
tags:
  - automation
  - javascript
  - devops
---
## The Problem

My family had the dream of going to Disney for my sister in law birthday in April and after coordinating the house, plane tickets, multiple families, and tickets we had a problem.  The park tickets were not purchased at the exact same moment and some of the family was not able to [reserve their park](https://disneyworld.disney.go.com/experience-updates/park-reservations/)! How could we fix this so the family can go to the park together? 

## The Calendar
![Illustration from Automating Disney (1)]({{ '/assets/blog-images/2021-04-29-automating-disney/01-calendar.png' | relative_url }})
We could do the following...

- Manually Click Dates
- Check Available Parks
- Repeat above…forever…hoping to get lucky

This clearly is not something we can do...there must be a way to dig deeper and automate the checking.

## Finding The Data
![Illustration from Automating Disney (2)]({{ '/assets/blog-images/2021-04-29-automating-disney/02-preview.png' | relative_url }})

Lets look to see how the calendar actually works.

- Inspect page load via developer tools
- Check XHR to see if there are any api requests....
- Looking through the requests we see `calendar`

## The API

If you view the request in a new window we get some nicely formatted `json` and the url is human readable.

>https://disneyworld.disney.go.com/availability-calendar/api/calendar?segment=tickets&startDate=2021-04-05&endDate=2021-04-30

Thankful we see that the query string has a lot of helpful parameters

- `startDate`
- `endDate`
- `segment`

## Decoding Response

Now that we discovered the format of the request next we need to understand the response.

```json
[
  {
    "date": "2021-04-17",
    "availability": "none",
    "parks": []
  },
  {
    "date": "2021-04-18",
    "availability": "partial",
    "parks": [
      "80007838"
    ]
  },
  {
    "date": "2021-04-19",
    "availability": "partial",
    "parks": [
      "80007838"
    ]
  },
  {
    "date": "2021-04-20",
    "availability": "partial",
    "parks": [
      "80007823",
      "80007838"
    ]
  }
]
```
The good news the json response is fairly straight forward except for some magic numbers.

- `date`
- `availability` 
- `parks` list of parks that are available
  - `Epcot 80007838`
   - `Animal Kingdom 80007823`
   - `Magic Kingdom 80007944`
   - `Hollywood Studios  80007998`

_We were able to reverse engineer the above magic numbers by clicking around the calendar and recording which numbers showed up compared to what was displayed on the screen._

## NodeJs

Now that we had an api, understood the request and response lets use turn this into a small program using NodeJs and [`🔗axios`](https://github.com/axios/axios).  Our program will need to do the following.

- Request Data from the API
- Parse the response
- If availability do…….something.

Once we put this all together we ended up with the following.

```javascript
const axios = require("axios");

let url =
    "https://disneyworld.disney.go.com/availability-calendar/api/calendar?segment=tickets&startDate=2021-04-17&endDate=2021-04-17";

(async () => {
    try {
        const response = await axios.get(url);

        var epcot = "80007838";
        var animalKingdom = "80007823";
        var magicKingdom = "80007944";
        var hollywood = "80007998";

        var message = "";
        var alert = false;

        response.data.forEach((date) => {
            message += `Date: ${date.date} | Parks:`;
            var parkNames = [];
            date.parks.forEach((park) => {
                if (park === epcot) {
                    parkNames.push("Epcot");
                }
                if (park === animalKingdom) {
                    parkNames.push("Animal Kingdom");
                }
                if (park === magicKingdom) {
                    alert = true;
                    parkNames.push("Magic Kingdom");
                }
                if (park === hollywood) {
                    parkNames.push("Hollywood");
                }
            });
            message += `${parkNames.join()} \n`;
        });
        if (alert) {
            //send alert
        }
    } catch (error) {
        console.log(error.response.body);
    }
})();
```

As you can see from the above we parsed the response and then captured the parks that are available and only trigger an alert for `Magic Kingdom` as that was the park the family wanted to go to on the day `2021-04-17`


## Automation
Now that we had a node program we needed to run this on a schedule to automagically check ever so often to see if any new parks open up. We could run via cron or similar scheduling tools, manually run it, or a server-less approach.

![Illustration from Automating Disney (3)]({{ '/assets/blog-images/2021-04-29-automating-disney/03-pipedream.png' | relative_url }})

I decided to go with [pipedream](https://pipedream.com) as it ticked all the boxes.

>Stop writing boilerplate code, struggling with authentication and managing infrastructure. Start connecting APIs with code-level control when you need it — and no code when you don't.

### Convert to Workflow

It was fairly straightforward to convert the NodeJs program to a pipe dream workflow as it had node support at its core which made the migration easy.

### Steps

The first thing we needed to do is define a few steps to help flow together what has to happen at each execution along the way.

#### Dates

We had a step for date that just returns the date we want to check for the calendar checking step.

```javascript
async (event, steps) => {
    return {
        date: "2021-04-17"
    }
}
```

#### Check API

As you can see this is a fairly easy migration but a few changes happened to make it work in pipedream

- pass in the `date` via the `steps` object `steps.date_to_check.$return_value.date;`
- return an object so it can be used in future steps

```javascript
        return {
            alert: alert,
            message: message
        };
```

```javascript
async (event, steps) => {
    const axios = require("axios");

    let date = steps.date_to_check.$return_value.date;
    let url =
        `https://disneyworld.disney.go.com/availability-calendar/api/calendar?segment=tickets&startDate=${date}&endDate=${date}`;

    try {
        const response = await axios.get(url);

        var epcot = "80007838";
        var animalKingdom = "80007823";
        var magicKingdom = "80007944";
        var hollywood = "80007998";

        var message = "";
        var alert = false;

        response.data.forEach((date) => {
            message += `Date: ${date.date} | Parks:`;
            var parkNames = [];
            date.parks.forEach((park) => {
                if (park === epcot) {
                    parkNames.push("Epcot");
                }
                if (park === animalKingdom) {
                    parkNames.push("Animal Kingdom");
                }
                if (park === magicKingdom) {
                    alert = true;
                    parkNames.push("Magic Kingdom");
                }
                if (park === hollywood) {
                    parkNames.push("Hollywood");
                }
            });
            message += `${parkNames.join()} \n`;
        });
        return {
            alert: alert,
            message: message
        };
    } catch (error) {
        console.log(error.response.body);
    }
}
```

#### Email

As we said above we want to do something this if the alert is triggered which in this workflow happens to be an email.  My favorite zero friction email service happens to be [sendgrid](https://sendgrid.com)  and good news is [pipedream has a built in connector to send grid](https://pipedream.com/apps/sendgrid).

```javascript
async (event, steps, params, auths) => {
    const axios = require('axios')
    if (steps.check_disney_calendar.$return_value.alert) {
        return await require("@pipedreamhq/platform").axios(this, {
            url: `https://api.sendgrid.com/v3/mail/send`,
            headers: {
                Authorization: `Bearer ${auths.sendgrid.api_key}`,
            },
            method: 'POST',
            data: {
                "personalizations": [{
                    "to": [{
                        "email": params.to_email,
                        "name": params.to_name
                    }],
                    "subject": params.subject
                }],
                "from": {
                    "email": params.from_email,
                    "name": params.from_name
                },
                "reply_to": {
                    "email": params.reply_to_email,
                    "name": params.reply_to_name
                },
                "content": [{
                    "type": params.type,
                    "value": params.value
                }]
            }
        })
    }
}
```
_we modified the built in template slightly to only send the email if `steps.check_disney_calendar.$return_value.alert` is actually true_

Now that we have all of these in place it is time to try it out by finding a date that has availability and use that in the `date` step.

### Testing It Out
![Illustration from Automating Disney (4)]({{ '/assets/blog-images/2021-04-29-automating-disney/04-email.png' | relative_url }})

We set the workflow to trigger every 10 minutes and as soon as we hit the right condition we got the above email.

## Time To Wait...Did it work?

### Yes

It actually did work we triggered the check every 10 minutes and as soon as I got the email I resorted to the manual flow of contacting every family member.  I could have easily used twilio to make a phone call, maybe that will be in the next iteration.
