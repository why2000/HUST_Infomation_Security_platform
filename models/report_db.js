var mongodb = require('mongodb');
var cfg = require('../config/report.json');

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
 * 获得Collection
 * @param {string} name Collection名称
 * @returns {mongodb.Collection} Collection
 */
const collection = (name) => {
    return db.collection(name);
}

module.exports = {
    collection
}