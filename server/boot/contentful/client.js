/*
Create a Contentful-Management.js client.
Pull the api key from keymap.js based on space name
*/
var keymap = require('keyMap.js')
var contentful = require('contentful-management');

module.exports = function(app) {
  var space = function(space){
      contentful.createClient({
        // A valid access token within the Space
        accessToken: keymap[space]
      })
      .then(function(client){
        return client;
      })
      .catch(function(err){
        console.log(err)
        throw (err);
      })
  }
};
