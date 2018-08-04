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

exports.UserLogger = winston.createLogger({
    level: "verbose",
    transports: [
        new (winston.transports.File)({
            filename: 'logs/user.log'
        }),
        new (winston.transports.Console)()
    ]
})

exports.ExamLogger = winston.createLogger({
    level: "verbose",
    transports: [
        new (winston.transports.File)({
            filename: 'logs/exam.log'
        }),
        new (winston.transports.Console)()
    ]
})