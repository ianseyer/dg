/**
This file handles subscription mail events.
When a new entry is created, and is a recurring entry
we need to email users telling them they have some new content to look at
*/
var mcapi = require('../../node_modules/mailchimp-api/mailchimp');

var mailchimp = new mcapi.Mailchimp('');
