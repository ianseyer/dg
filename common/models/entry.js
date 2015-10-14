var app = require('../../server/server.js')

module.exports = function(Entry) {
  Entry.observe('after save', function findWaitingUsers(ctx, next){
    if(ctx.instance){
      app.models.Donor.find({
        where: {
          ctx.instance.causeId: {inq: waitingForContentFrom}
        }
      })
      .then(function(donors){
        //Grab a recipient
        //TODO impose order
        recipient = donor.pop()
        //Add the entry to their entries list
        recipient.updateAttribute('entries', recipient.entries.push(ctx.instance))
        .then(function(recipient){
          //Remove the cause from their list of pending content
          recipient.waitingForContentFrom.slice(recipient.waitingForContentFrom.indexOf(ctx.instance.causeId), 1)
        })
        .then(function(){
          email = new Email({
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
};
