/**
This file handles subscription events, such as mailing and logic
When a new entry is created, and a user needs to be able to read it
(e.g. it was public for a cause they have donated to, or is a Story for them),
we need to email users telling them they have some new content to look at.
*/

module.exports = function(app){
  /** Assigns a piece of content to a user
  @param [Object] User
  @param [String] Campaign - the name of the campaign
  @param [String] Space - the name of the Space
  */
  var assignContent = function(user, campaignName, spaceName){
    //locate a piece of unused content
    contentfulClient.getSpace(spaceName)
      .then(function(space){
        //grab the campaign
        return space.getEntry({"content_type":"campaign", "fields.name":campaignName})
      })
      .then(function(campaign){
        return space.getEntries({"content_type":"story",   "fields.campaign.sys.id":campaign.sys.id, "used":false})
        console.log("retrieved entries: " + entries)
      })
      .then(function(entries){
        //assign the user the first piece of content
        contentSlice = entries[0];
        if (contentSlice == null || campaignName == null){
          throw new Error("Missing Campaign name, or worse: out of content!");
        }
        else {
          //add the content to that users content,
          user.content.push(contentSlice);
          //and add the campaign to their causes
          user.causes.push(campaignName);
          //mark the content as used
          contentSlice.used = true
          //push changes to contentful
          space.updateEntry(contentSlice)
        }
      })
      .catch(function(error){cb(error)});
  }

  /** Sends an email to a user about a new piece of content to view.
  @param [Object] User - the user
  @param [Object] Entry - the contentful entry in question
  and notifies them via mailchimp of a new piece of content.
  */
  var notifyUser = function(user, entry){
    //do email shit
    user.app.models.Email.send({
      from: "support@directgiving.com",
      to: user.email,
      subject: "There's a new story to read!",
      text: entry
    })
    .catch(function(error){cb(error)});
  };
};
