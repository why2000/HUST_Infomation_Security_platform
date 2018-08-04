'use strict';

let ConfigSet = require('../config/contact.json');
let ErrorUtil = require('../utils/error_util');
let Joi = require('joi');
let ContactLogger = require('../logger').ContactLogger;
let MongoDB = require('mongodb');
let MongoClient = MongoDB.MongoClient;
let IsEmpty = require('is-empty');

let db;
MongoClient.connect(ConfigSet.DATABASE_URL, (err, client) => {
    if (err) {
        ContactLogger.error(`database error => ${err.stack}`);
        throw err;
    } else {
        db = client.db(ConfigSet.DATABASE_NAME);
        db.createCollection(ConfigSet.COLLECTION_NAME, function(err, res) {
            if (err) {
                ContactLogger.error(`database error => ${err.stack}`);
                throw err;
            } else {
                //console.log("Successfully creat col");
                ;
            }
          });
    }
})

exports.sendInf = async function(params) {
    var contact = db.collection('contact');
    var data = params;
    //console.log(data);
    
    contact.insert(data, function(err, result){
        if(err){
            ContactLogger.error(`database error => ${err.stack}`);
            throw err;
        } else {
            data = result;
        }
    });
    
    return data;
}

exports.getAllInf = async function() {
    var collection = db.collection('contact');
    var data = collection.find().toArray();
    return data;
}