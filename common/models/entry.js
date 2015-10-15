var app = require('../../server/server.js')

module.exports = function(Entry) {
  Entry.observe('after save', function findWaitingUsers(ctx, next){
    Entry.findById(ctx.instance.id)
    .then(function(theEntry){
      if(theEntry == null && ctx.instance.individual == true){
        //it is a new entry
        theEntry.updateAttribute('donorId', -1)
        new function(){
          return new Promise(function(reject, fulfill){
            pendingDonors = []
            try {
              _.forEach(Donor.find(), function(donor){
                if(donor.waitingForContentFrom.indexOf(ctx.instance.causeId) > -1){
                  pendingDonors.push(donor);
                }
              })
              fulfill(pendingDonors)
            }
            catch (err) {
              reject(err)
            }
          })
        }()
        .then(function(donors){
          //Grab a recipient
          //TODO impose order
          recipient = donors.pop()
          //Add the entry to their entries list
          recipient.updateAttribute('entries', recipient.entries.push(ctx.instance))
          .then(function(recipient){
            //Remove the cause from their list of pending content
            recipient.waitingForContentFrom.slice(recipient.waitingForContentFrom.indexOf(ctx.instance.causeId), 1)
          })
          .then(function(){
            email = new app.models.Email({
              to: donor.email,
              from: process.env.SENDER_EMAIL,
              subject: "You have an update from DirectGiving!",
              text: ctx.instance
            })
            email.send()
            .then(function(email){
              next()
            })
            .catch(function(err){
              console.log(err)
              next(err)
            })
          })
          .catch(function(err){
            console.log(err);
            next(err);
          })
        })
        .catch(function(err){
          console.log(err);
          next(err);
        })
      }
      next()
    })
    })
};
