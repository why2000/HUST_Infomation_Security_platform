const winston = require('winston');

exports.ContactLogger = winston.createLogger({
    level: "verbose",
    transports: [
        new (winston.transports.File)({
            filename: 'logs/contact.log'
        }),
        new (winston.transports.Console)()
    ]
})
