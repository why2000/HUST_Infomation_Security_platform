var response = require('./response')

function checkLogin(req, res, next) {
    if(!req.session.loginUser) {
        response(res, 401, 'Not login.')
    }
    next()
}

module.exports = {
    checkLogin
}