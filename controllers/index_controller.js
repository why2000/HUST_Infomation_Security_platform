'use strict'

exports.getIndexPage = async (req, res, next) => {
    if(!req.session.loginUser){
        res.render('index');
    }
    else{
        res.redirect('/catalog');        
    }
}

exports.getSimulatorPage = async (req, res, next) => {
    if(!req.session.loginUser){
        res.redirect('/');
    }
    else{
        res.render('simulator');        
    }
}