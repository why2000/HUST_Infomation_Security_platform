var response = require('./response')

function checkLogin(req, res, next) {
    if(!req.session.loginUser) {
        response(res, 401, 'Not login.')
    }
    next()
}

function checkIP(req, res, next) {
    // TODO: TODO
    next()
}

module.exports = {
    checkLogin,
    checkIP
}