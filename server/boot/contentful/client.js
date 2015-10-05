/*
Create a Contentful-Management.js client.
Pull the api key from keymap.js based on space name
*/
var keymap = require('./keyMap')
var contentful = require('contentful-management');

var exports = module.exports = {}

exports.space = function(space){
  return new Promise(function(fulfill, reject){
    contentful.createClient({
      // A valid access token within the Space
      accessToken: keymap[space]
    })
    .then(function(client){
      fulfill(client)
    })
    .catch(function(err){
      reject(err)
    })
  })
};
