module.exports = function(app) {
  app.dataSources.postgres.autoupdate(null, function(err) {
    if (err) throw err;
  });
};
