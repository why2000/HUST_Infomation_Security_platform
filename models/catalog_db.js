let ConfigSet = require('../config/contact.json');
let ErrorSet = require('../utils/error_util');
let CourseLogger = require('../logger').CourseLogger;
let MongoDB = require('mongodb');
let MongoClient = MongoDB.MongoClient;
let db;// = new MongoDB.Db;
MongoClient.connect(ConfigSet.DATABASE_URL, (err, client) => {
    if (err) {
        CourseLogger.error(`database error => ${err.stack}`);
        throw err;
    }
    db = client.db(ConfigSet.DATABASE_NAME);
});

// function writeJson(params){
    
//     fs.readFile('../config/user.json',function(err,data){
//         if(err){
//             return console.error(err);
//         }
//         var config_str = data.toString();//将二进制的数据转换为字符串
//         config_json = JSON.parse(config_str);//将字符串转换为json对象
//         config_json.DATABASE_NAME = 'HUST_IS_new';//将传来的对象push进数组对象中
//         person.total = person.data.length;//定义一下总条数，为以后的分页打基础
//         console.log(person.data);
//         var str = JSON.stringify(person);//因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
//         fs.writeFile('../config/user.json',str,function(err){
//             if(err){
//                 console.error(err);
//             }
//             console.log('----------新增成功-------------');
//         })
//     })
// }

const changeDB  = async (data) => {
    return db.executeDbAdminCommand({"killOp": 0}, {fromdb: ConfigSet.DATABASE_NAME, todb: "HUST_IS_new", fromhost: "127.0.0.1"});
    // db.copyDatabase(ConfigSet.DATABASE_NAME, 'HUST_IS_new', '127.0.0.1');
}
    

module.exports = {
    changeDB
}

