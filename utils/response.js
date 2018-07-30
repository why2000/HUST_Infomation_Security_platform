/* utils for make response */

const successResponse = (data) => {
    return {
        status: 200,
        data: data
    };
}

const errorResponse = (status_code, msg) => {
    return {
        status: status_code,
        msg: msg
    };
}

//simulation for overload
const response = function() {
    switch(arguments.length) {
        case 1:
            return successResponse(arguments[0]);
        case 2:
            return successResponse(arguments[0], arguments[1]);
        default:
            return undefined;
    }
}


module.exports = response;