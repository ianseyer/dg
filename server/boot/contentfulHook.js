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
        then grab all donors who have donated to that campaign
      * the entry is a single-donor piece of content

    otherwise,
    */

    //An Entry was published
    if(req.headers['X-Contentful-Topic'] == 'ContentManagement.Entry.publish' && entry.contentType.sys.id == "story"){
      entry = req.body;

      //If the story was marked as public
      if(entry.fields.public == true){
        //assign the entry to all donors
        /*NOTE sadly, loopback does not support a "contains" filter.
         *therefore, we are going to filter ourselves.
         *I have opened a question on the google group asking about it:
         *https://groups.google.com/forum/#!topic/strongloop/zczeyo7biII
        */
        Donor.find() //returns all donors (*shudder*)
          .then(function(allDonors){
            for(donor in allDonors){
              if (donor.causes.indexOf(entry.fields.campaign.id) != -1){
                //the donors causes DID contain the cause that triggered the hook
                //notify them
                //add the entry ID to their list of content
                donor.content.push(entry.id);
                donor.save;
                //notify them
                subscription.notifyDonor(donor, entry)
              }
              else {
                //do nothing!
              };
            };
          })
          .catch(function(error){cb(error)});
      }
      //if the content was NOT marked as public
      else{
        var space = contentfulClient.getSpace(entry.space.sys.id)
                      .catch(function(error){cb(error)});

        //find a donor who is both subscribed and doesn't have content
        //from that campaign
        Donor.find() //returns all donors (*shudder*)
          .then(function(allDonors){
            for(donor in allDonors){
              if (donor.causes.indexOf(entry.fields.campaign.id) != -1){
                //the donors causes DOES contain the cause that triggered the hook
                //grab all their content, see if they have any stories from this campaign
                donorsInNeedOfContent = allDonors;
                for(entryId in donor.content){
                  space.getEntry(entryId)
                    .then(function(donorEntry){
                      if(entry.fields.campaign.sys.id == donorEntry.fields.campaign.sys.id){
                        //the donor has content from this campaign,
                        //remove the donor from the list of potential donors
                        donorsInNeedOfContent.remove(donor);
                      }
                      return donorsInNeedOfContent;
                    })
                    .then(function(pool){
                      return Donor.find(pool[0].id)
                    })
                    .then(function(donor){
                      donor.content.push(entry.id);
                      donor.save;
                      return donor
                       //stop searching! we have found our mark
                    })
                  .catch(function(error){cb(error)});
                }
              }
              else {
                //do nothing!
              };
            };
          })
          .catch(function(error){cb(error)});
      };
    }

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
