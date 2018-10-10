

/**
 * project
 * @param {any} obj
 * @param {Array} arr
 */
const project = (obj, arr) => {
    if(!obj) return null;

    nobj = {}
    arr.forEach(i => {
        nobj[i] = obj[i] ? obj[i] : null;
    });

    return nobj;
}

module.exports = project;