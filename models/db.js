var mongodb = require('mongodb');
var cfg = require('../config/mongodb.json');

var client = mongodb.MongoClient;


client.connect(cfg.DATABASE_URL, { useNewUrlParser: true }, (err, client) => {
    console.log('connected!');
    if(err) {
        console.log(err);
        throw err;
    }
    db = client.db(cfg.DATABASE_NAME);
});

/**
 * 
 * @param {string} name
 * @returns {mongodb.Collection} collection 
 */
const collection = (name) => {
    return db.collection(name);
}

module.exports = {
    collection
}