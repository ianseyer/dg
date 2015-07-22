module.exports = function(app) {
  app.dataSources.postgres.autoupdate("user", function(err) {
    if (err) throw err;
  });
};
