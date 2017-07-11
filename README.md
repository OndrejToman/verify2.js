# Verify2.js
Is simple to use library for verifying form inputs on websites.

## Requirements
jQuery

## Installation guide
1) Copy verify2.js to your website (via script tag)
2) Add class __form-validate__ to your send button
3) Add attribute __novalidate__ to form tag _disables default browser validation_
4) Add __data-type__ to inputs (example: < input name="email" data-type="email" >)
5) If you want input to be requiered, just add requiered attribute ( just like in standard browser validation )

## Standard input types
__Every regular expression can be changed__
* name (Name Surname , space required)
* email (standard email)
* phone (+123 123 123 123 , +123 is optional and spaces too)
* date (in format dd.mm.rrr)
* text (only a-z A-Z letters)
* number (only 0-9 numbers)

## How to add your own input types or change existing one?
1) Find array with regular expressions
```javascript
var expressions = Array();
```
2) Add your own
3) Done!

## What does front-end validation mean?
That meas, this script runs in browser, so anyone can disable it. So make sure to validate your inputs in back-end.
