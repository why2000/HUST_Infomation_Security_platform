'use strict'

exports.getIndexPage = async (req, res, next) => {
    if(!req.session.loginUser){
        res.render('index');
    }
    else{
        res.redirect('/catalog');        
    }
}