'use strict';

let ConfigSet = require('../config/experiment.json');
let ErrorSet = require('../utils/error_util');
let Joi = require('joi');
let ExperimentLogger = require('../logger').ExperimentLogger;
let MongoDB = require('mongodb');
let MongoClient = MongoDB.MongoClient;
let IsEmpty = require('is-empty');


const setExperimentContent = async function (data) {
    var experiment = db.collection('experiment');
    await experiment.findOne({title: data.title}, function (err, res){
        if(!res){
            experiment.insertOne({ title: data.title, content: data.content }, function (err, res) {
                if (err) {
                    UserLogger.error(`database error => ${err.stack}`);
                    throw err;
                }
            });
        }
        else{
            experiment.updateOne({ title: data.title }, { $set: { content: data.content} }, function (err, res) {
                if (err) {
                    UserLogger.error(`database error => ${err.stack}`);
                    throw err;
                }
            });
        }
        if(err){
            CourseLogger.error(`database error => ${err.stack}`);
            throw err;
        }
    });
    
    return true;
}

const changeCurrentExperiment = async function (data) {

}



//先find标题，再用标题find内容
const getCurrentExperiment = async function () {
    var experiment = db.collection('experiment');
    await experiment.findOne({type: "currentflag"}, function (err, res){

    }
}

module.exports = {
    setExperimentContent,
    changeCurrentExperiment,
    getCurrentExperiment
}
