'use strict';

let ConfigSet = require('../config/experiment.json');
let ErrorSet = require('../utils/error_util');
let Joi = require('joi');
let ExperimentLogger = require('../logger').ExperimentLogger;
let MongoDB = require('mongodb');
let MongoClient = MongoDB.MongoClient;
let IsEmpty = require('is-empty');
let db;
MongoClient.connect(ConfigSet.DATABASE_URL, (err, client) => {
    if (err) {
        ExperimentLogger.error(`database error => ${err.stack}`);
        throw err;
    } else {
        db = client.db(ConfigSet.DATABASE_NAME);
        db.createCollection(ConfigSet.COLLECTION_NAME, function (err, res) {
            if (err) {
                ExperimentLogger.error(`database error => ${err.stack}`);
                throw err;
            } else {
                // Successfully creat col
                ;
            }
        });
        db.createCollection('report', function (err, res) {
            if (err) {
                ExperimentLogger.error(`database error => ${err.stack}`);
                throw err;
            } else {
                // Successfully creat col
                ;
            }
        });
        db.createCollection('judgement', function (err, res) {
            if (err) {
                ExperimentLogger.error(`database error => ${err.stack}`);
                throw err;
            } else {
                // Successfully creat col
                ;
            }
        });
    }
});

const setExperimentContent = async function (data) {
    var experiment = db.collection('experiment');
    await experiment.findOne({title: data.title}, function (err, res){
        if(!res){
            experiment.insertOne({ type: "experiment", title: data.title, content: data.content }, function (err, res) {
                if (err) {
                    ExperimentLogger.error(`database error => ${err.stack}`);
                    throw err;
                }
            });
        }
        else{
            experiment.updateOne({ title: data.title }, { $set: { content: data.content} }, function (err, res) {
                if (err) {
                    ExperimentLogger.error(`database error => ${err.stack}`);
                    throw err;
                }
            });
        }
        if(err){
            ExperimentLogger.error(`database error => ${err.stack}`);
            throw err;
        }
    });
    
    return true;
}


const getExperimentList = async function () {
    var experiment = db.collection('experiment');
    return await experiment.find({type: "experiment"}, {title: 1}).toArray();
}

const changeCurrentExperiment = async function (data) {
    var experiment = db.collection('experiment');
    await experiment.findOne({type: "currentflag"}, function (err, res){
        if(!res){
            experiment.insertOne({ type: "currentflag", currenttitle: data.title }, function (err, res) {
                if (err) {
                    ExperimentLogger.error(`database error => ${err.stack}`);
                    throw err;
                }
            });
        }
        else{
            experiment.updateOne({ type: "currentflag" }, { $set: { currenttitle: data.title} }, function (err, res) {
                if (err) {
                    ExperimentLogger.error(`database error => ${err.stack}`);
                    throw err;
                }
            });
        }
        if(err){
            ExperimentLogger.error(`database error => ${err.stack}`);
            throw err;
        }
    });
    return true;
}



//先find标题，再用标题find内容
const getCurrentExperiment = async function () {
    var experiment = db.collection('experiment');
    return experiment.findOne({type: "currentflag"}).then(res => {
        var data;
        if(res){
            data = experiment.findOne({title: res.currenttitle});
        }
        return data;
    });
}

module.exports = {
    setExperimentContent,
    changeCurrentExperiment,
    getCurrentExperiment,
    getExperimentList
}
