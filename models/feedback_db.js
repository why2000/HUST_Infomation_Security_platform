var db = require('./report_db');
var user_db = require('./user_db')

// 复用连接是不是有点问题啊

/**
 * 通过学生ID和模块ID获得报告
 * @param {string} student_id 学生ID
 * @param {string} module_id 模块ID
 */
const getReportByStudentIDAndModuleID = async (student_id, module_id) => {
    let colReport = db.collection('IS_Reports');
    let ret = undefined;
    let res = await colReport.findOne({student_id: student_id, module_id: module_id})
    if(res) {
        ret = {
            file_id: res.file_id
        }
    };

    return ret;
}

/**
 * 通过学生ID获得所有报告
 * @param {string} student_id 学生ID
 */
const getReportsByStudentID = async (student_id) => {
    let colReport = db.collection('IS_Reports');
    return colReport.find({student_id: student_id}).project({_id: 0}).toArray();
}

/** 
 * 通过模块ID获得所有报告
 * @param {string} module_id 模块ID
 */
const getReportsByModuleID = async (module_id) => {
    let colReport = db.collection('IS_Reports');
    return colReport.find({module_id: module_id}).project({_id: 0}).toArray();
}

/**
 * 插入报告
 * @param {string} student_id 学生ID
 * @param {string} module_id 模块ID
 * @param {string} file_id 文件ID
 */
const insertReport = async (student_id, module_id, file_id) => {
    let colReport = db.collection('IS_Reports');
    let doc = {
        student_id: student_id,
        module_id: module_id,
        file_id: file_id
    };

    return colReport.insertOne(doc).then(res => res.result.ok == 1);
}

/**
 *  更新或插入报告
 *  建议用这个直接代替插入报告
 * @param {string} student_id 学生ID
 * @param {string} module_id 模块ID
 * @param {string} file_id 文件ID
 */
const upsertReport = async (student_id, module_id, file_id) => {
    let colReport = db.collection('IS_Reports');
    return colReport.updateOne({student_id: student_id, module_id, module_id}, {$set : {file_id: file_id}}, {upsert: true}).then(res => res.result.ok == 1)
}

/**
 * 移除报告
 * @param {string} student_id 学生ID
 * @param {string} module_id 模块ID
 */
const removeReport = async (student_id, module_id) => {
    let colReport = db.collection('IS_Reports');
    return colReport.deleteOne({student_id: student_id, module_id: module_id}).then(res => res.result.ok == 1);
}

/**
 * 通过学生ID和模块ID获得教师评价
 * @param {string} student_id 学生ID
 * @param {string} module_id 模块ID
 */
const getJudgementByStudentIDAndModuleID = async (student_id, module_id) => {
    let colJudgement = db.collection('IS_Judgements');
    var ret = undefined;
    let res = await colJudgement.findOne({student_id: student_id, module_id: module_id});
    if(res) {
        let name_res = await user_db.findUserById(student_id);
        ret = {
            score: res.score,
            text: res.text,
            name: name_res
        };
    }

    return ret;
}

/**
 * 通过学生ID获得所有评价
 * @param {string} student_id 学生ID
 */
const getJudgementsByStudentID = async (student_id) => {
    let colJudgement = db.collection('IS_Judgements');
    return colJudgement.find({student_id: student_id}).project({_id: 0}).toArray();
}

/**
 * 通过模块ID获得所有评价
 * @param {string} module_id 模块ID
 */
const getJudgementsByModuleID = async (module_id) => {
    let colJudgement = db.collection('IS_Judgements');
    return colJudgement.find({module_id: module_id}).project({_id: 0}).toArray();
}

/**
 * 插入评价
 * @param {string} student_id 学生ID
 * @param {string} module_id 模块ID
 * @param {number} score 成绩
 * @param {string} text 评价文字
 */
const insertJudgement = async (student_id, module_id, score, text) => {
    let colJudgement = db.collection('IS_Judgements');
    let doc = {
        student_id: student_id,
        module_id: module_id,
        score: score,
        text: text
    };

    return colJudgement.insertOne(doc).then(res => res.result.ok == 1);
}

/**
 * 更新或插入评价
 * 建议用这个直接代替插入评价
 * @param {string} student_id 学生ID
 * @param {string} module_id 模块ID
 * @param {string} score 成绩
 * @param {string} text 评价文字
 */
const upsertJudgement = async (student_id, module_id, score, text) => {
    let colReport = db.collection('IS_Judgements');
    return colReport.updateOne({student_id: student_id, module_id, module_id}, {$set: {score: score, text: text}}, {upsert: true}).then(res => res.result.ok == 1);
}

/**
 * 移除评价
 * @param {string} student_id 学生ID
 * @param {string} module_id 模块ID
 */
const removeJudgement = async (student_id, module_id) => {
    let colJudgement = db.collection('IS_Judgements');
    return colJudgement.deleteOne({student_id: student_id, module_id: module_id}).then(res => res.result.ok == 1);
}


module.exports = {
    getJudgementsByModuleID,
    getJudgementByStudentIDAndModuleID,
    getJudgementsByStudentID,
    getReportByStudentIDAndModuleID,
    getReportsByModuleID,
    getReportsByStudentID,
    insertReport,
    insertJudgement,
    removeReport,
    removeJudgement,
    upsertReport,
    upsertJudgement
}