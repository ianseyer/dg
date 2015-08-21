//eventually, make this an environment variable
var access_token = "27fcf1574c6034393c8e568c903d6351fbf6e6b438ad4d953019b0cb6e882d02";
var contentful = require('contentful-management');

module.exports = function(app) {
  GLOBAL.contentfulClient = contentful.createClient({
    // A valid access token within the Space
    accessToken: access_token,

    // Enable or disable SSL. Enabled by default.
    secure: true,
  });
};
