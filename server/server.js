var loopback = require('loopback');
var boot = require('loopback-boot');
var cors = require('cors');

var app = module.exports = loopback();
var _ = require('lodash');

//use dotenv to load in environment variables [defined in .env]
require('dotenv').load()

app.use(cors());
app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
