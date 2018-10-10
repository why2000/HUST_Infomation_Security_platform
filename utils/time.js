
/**
 * 返回10位时间戳
 */
const getTimeStamp = () => Math.floor(Date.now() / 10e2);

module.exports = getTimeStamp;