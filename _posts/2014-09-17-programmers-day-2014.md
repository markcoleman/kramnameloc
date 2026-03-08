---
layout: post
title: "Programmers Day 2014"
date: 2014-09-17 20:02:53 -0400
description: "A technology themed scavenger hunt!"
subtitle: "A technology themed scavenger hunt!"
---
Earlier this year I learned of [Programmers Day](http://en.wikipedia.org/wiki/Programmers'_Day) and I figured this would be the perfect opportunity to get the development team together and have some fun and dare I even mention it.... *"Team Building"* (gasps!)  The first thing we needed to figure out is what on earth could we do that would be fun that incorporates some sort of programming fun?  A few ideas were thrown around but we ended up with a programmer themed scavenger hunt.  Each location would contain a clue to the next location encoded in some sort of programming task or a simple question.  


###How to Play

* The development team is broken out into 3-4 person teams
* Each team leaves on a schedule (around 5-10 minutes) this was done to keep each location open and limit teams following each other around
* At each location the team must find the corresponding programmer token that is hidden at the location
* The team decodes the puzzle and goes to the next location
* The team follows the clues and the team with all the tokens and the fastest time wins

###The Hunt

* Teams Starts in Room 116 and is presented the following clue *"This is where we go to get me a pick me up."*

* Team rushes to the break Room by the coffee machine and finds the [Java] token and finds a clue encoded in binary
```01001101 01111001 00100000 01101100 01101001 01100111 01101000 01110100 00100000 01100101 01101101 01101001 01110100 01110100 01101001 01101110 01100111 00100000 01100100 01101001 01101111 01100100 01100101 01110011 00100000 01101000 01100101 01101100 01110000 00100000 01111001 01101111 01110101 00100000 01101011 01101110 01101111 01110111 00100000 01110100 01101000 01100101 00100000 01110100 01101001 01101101 01100101 00100000 01100001 01101110 01100100 00100000 01110100 01100101 01101101 01110000 01100101 01110010 01100001 01110100 01110101 01110010 01100101 ```
[Hint](http://jsfiddle.net/markcoleman/mmeqjf43/embedded/result/)
*[decoded]“My light emitting diodes help you know the time and temperature”*

* The team goes to the sign in the front of the building and finds the [binary] token along with another clue in JavaScript.
```console.log(rot13("haqre n cvpavp gnoyr”));```
[Hint](http://jsfiddle.net/markcoleman/j1rc8h8g/1/)
*[decoded]“Under a picnic table”*

* The team now goes to the picnic tables and finds the [JavaScript] token.
*I once was a whole number OS but now have added 1/10 to my name.  Find where I am installed for the next clue, ITS/Dev Area*

* The team goes to the ITS Dev Area and finds the  [Microsoft] token along with a sql statement for the next clue.
```SELECT CHAR(82) + CHAR(79) + 
                        CHAR(79) + CHAR(77) + 
                        CHAR(32) + CHAR(49) +
                        CHAR(50) + CHAR(49) AS [Next Location]```
*[decoded]"Room 121"*

* The team goes to room 121 and finds the [Sql] token and an `<html/>` snip it.
```
<h1>&reg;&Egrave;&Tcaron;&Uacute;&reg;&Ntilde;</h1>
<h1>&Tcaron;&Oacute;</h1>
<h1>&Tcaron;&Hcirc;&Egrave;</h1>
<h1>&Sacute;&Tcaron;&Agrave;&reg;&Tcaron;</h1>
```
[Hint](http://jsfiddle.net/markcoleman/mwe23xqx/embedded/result/)
*[decoded] Return to the start*

* The team returns to room 116 and finds the [Html] token.

###Conclusion
All in all this event turned out to be a lot of fun for everyone.  We hope to make this a yearly tradition!
