/**
* This file handles contentful webhooks.
* There are two primary hooks we will watch for:
* 1. New campaign hook:
*       - create a stripe account
*        - store the stripeId in the campaign on contentful
* 2. New entry hook:
*        - find all users with that CauseId in their subscriptions
*        - email them a link to view the generated DG percentageFee
* DO NOTICE WE ARE USING CONTENTFUL MANAGEMENT API, NOT DELIVERY API
*/
var contentful = require('contentful-management');
var stripe = require('stripe');
var subscription = require('common/helpers/subscription.js');

module.exports = function(app) {
  app.get('/contentful-hook', function(req, res){
    /** TODO
    If an entry has been published, there are a few scenarios:
      * the entry is marked "send to all users" (e.g. an update)
        then grab all users who have donated to that campaign
      * the entry is a single-user piece of content

    otherwise,
    */

    if(req.headers['X-Contentful-Topic'] == 'ContentManagement.Entry.publish'){
      var subscribedUsers = User.find({
        where: {causes: {inq: }}
      })
    }
    elseif(req.headers['X-Contentful-Topic'] ==
      'ContentManagement.ContentType.publish'){
        //create a stripe account
        stripe.customers.create()
        //push that stripe account to contentful

      }
  });
}
