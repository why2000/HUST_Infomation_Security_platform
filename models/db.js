var mongodb = require('mongodb');
var config = require('../config/mongodb.json');

var client = mongodb.MongoClient;
var db = mongodb.Db;

client.connect(config.DATABASE_URL, function(err, client) {
    if(err) {
        db = undefined;
        return; // Nothing to do.
    }
    db = client.db(config.DATABASE_NAME);
});

module.exports = db;