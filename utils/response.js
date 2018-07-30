/* utils for make response */

const successResponse = (res, data) => {
    res.json({
        status: 200,
        data: data
    });
}

const errorResponse = (res, status_code, msg) => {
    res.status(status_code);
    res.json({
        status: status_code,
        msg: msg
    });
}

//simulation for overload
const response = function() {
    switch(arguments.length) {
        case 2:
            return successResponse(arguments[0], arguments[1]);
        case 3:
            return errorResponse(arguments[0], arguments[1], arguments[2]);
        default:
            return undefined;
    }
}


module.exports = response;