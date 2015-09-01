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

    //An Entry was published
    if(req.headers['X-Contentful-Topic'] == 'ContentManagement.Entry.publish' && entry.contentType.sys.id == "story"){
      entry = req.body;

      //If the story was marked as public
      if(entry.fields.public == true){
        //assign the entry to all users
        /*NOTE sadly, loopback does not support a "contains" filter.
         *therefore, we are going to filter ourselves.
         *I have opened a question on the google group asking about it:
         *https://groups.google.com/forum/#!topic/strongloop/zczeyo7biII
        */
        User.find() //returns all users (*shudder*)
          .then(function(allUsers){
            for(user in allUsers){
              if (user.causes.indexOf(entry.fields.campaign.id) != -1){
                //the users causes DID contain the cause that triggered the hook
                //notify them
                //add the entry ID to their list of content
                user.content.push(entry.id);
                user.save;
                //notify them
                subscription.notifyUser(user, entry)
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

        //find a user who is both subscribed and doesn't have content
        //from that campaign
        User.find() //returns all users (*shudder*)
          .then(function(allUsers){
            for(user in allUsers){
              if (user.causes.indexOf(entry.fields.campaign.id) != -1){
                //the users causes DOES contain the cause that triggered the hook
                //grab all their content, see if they have any stories from this campaign
                usersInNeedOfContent = allUsers;
                for(entryId in user.content){
                  space.getEntry(entryId)
                    .then(function(userEntry){
                      if(entry.fields.campaign.sys.id == userEntry.fields.campaign.sys.id){
                        //the user has content from this campaign,
                        //remove the user from the list of potential users
                        usersInNeedOfContent.remove(user);
                      }
                      return usersInNeedOfContent;
                    })
                    .then(function(pool){
                      return User.find(pool[0].id)
                    })
                    .then(function(user){
                      user.content.push(entry.id);
                      user.save;
                      return user
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
    elseif(req.headers['X-Contentful-Topic'] ==
      'ContentManagement.ContentType.publish'){
        //create a stripe account
        stripe.customers.create()
        //push that stripe account to contentful

    //A Campaign was published
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
