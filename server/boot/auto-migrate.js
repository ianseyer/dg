module.exports = function(app) {
  app.dataSources.db.autoupdate("user", function(err) {
    if (err) throw err;
  });
};
