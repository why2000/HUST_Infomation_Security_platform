'use strict';

let ConfigSet = require('../config/user.json');
let ErrorSet = require('../utils/error_util');
let Joi = require('joi');
let UserLogger = require('../logger').UserLogger;
let MongoDB = require('mongodb');
let MongoClient = MongoDB.MongoClient;
let IsEmpty = require('is-empty');

let db;
MongoClient.connect(ConfigSet.DATABASE_URL, (err, client) => {
    if (err) {
        UserLogger.error(`database error => ${err.stack}`);
        throw err;
    } else {
        db = client.db(ConfigSet.DATABASE_NAME);
        db.createCollection(ConfigSet.COLLECTION_NAME, function(err, res) {
            if (err) {
                UserLogger.error(`database error => ${err.stack}`);
                throw err;
            } else {
                //console.log("Successfully creat col");
                ;
            }
          });
    }
})

exports.addUser = async function(params) {
    var user = db.collection('user');
    var data = params;
    //console.log(data);
    user.insert(data, function(err, result){
        if(err){
            UserLogger.error(`database error => ${err.stack}`);
            throw err;
        } else {
            data = result;
        }
    });
    return data;
}

exports.findUser = async function(username){
    var user = db.collection('user');
    var doc = user.findOne(username);
    if(!doc){
        return false;
    }
    else{
        return true;
    }
}