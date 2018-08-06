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

exports.creatUser = async function(params) {
    var user = db.collection('user');
    var whyere = {
        "type": "userid-username",
        "userid": params.userid
    }
    if(user.find(whyere).length){
        var data = {
            "type": "userid-username",
            "userid": params.userid,
            "username": params.username,
            "usertype": params.usertype
        }
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
    return false;
}

exports.findUserByName = async function(username){
    var user = db.collection('user');
    var doc = user.find(username);
    if(!doc){
        return false;
    }
    else{
        return doc;
    }
}

exports.findUserById = async function(userid){
    var user = db.collection('user');
    var doc = user.findOne({userid: userid});
    if(!doc){
        return false;
    }else{
        return doc;
    }
}