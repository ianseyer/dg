/**
* This file handles contentful webhooks.
* There are two primary hooks we will watch for:
* 1. New campaign hook:
*       - create a stripe account
*        - store the stripeId in the campaign on contentful
* 2. New entry hook:
*        - find all donors with that CauseId in their subscriptions
*        - email them a link to view the generated DG percentageFee
* DO NOTICE WE ARE USING CONTENTFUL MANAGEMENT API, NOT DELIVERY API
*/
var contentful = require('contentful-management');
var stripe = require('stripe');
var subscription = require('../../common/helpers/subscription.js');

module.exports = function(app) {
  app.get('/contentful-hook', function(req, res){
    /** TODO
    If an entry has been published, there are a few scenarios:
        * the entry is marked "send to all donors" (e.g. an update)
        then grab all donors who have donated to that campaign,
        and append the content ID to their content list

        * the entry is a single-donor piece of content. In this case, check our content queue system and find the next user in line.
          *if the Queue is empty, do nothing

    If a campaign is published,
      [warning: this is going to evolve quickly as we bulid out the administrative/onboarding process]
      * create a stripe account, and assign it to the contentful entry
      * create generic Story content type:
        TODO properties of generic story
      * create metadata content type for that Story
        TODO define properties of story type
    */

    //An Entry was published
    if(req.headers['X-Contentful-Topic'] == 'ContentManagement.Entry.publish' && entry.contentType.sys.id == "story"){
      entry = req.body;
      };

    //If a campaign is published
    if(req.headers['X-Contentful-Topic'] == 'ContentManagement.Entry.publish' && entry.contentType.sys.id == "campaign"){
      //create a stripe account
      stripe.customers.create({
        description: entry.fields.name,
        email: entry.fields.email
      })
      .then(function(customer){
        entry.fields.stripeId = customer.id
        contentfulClient.updateEntry(entry);
      });
    }
  });
}
