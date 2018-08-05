var db = require('./db');

// 复用连接是不是有点问题啊

// 通过学生ID和模块ID获得报告
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

// 通过学生ID获得所有报告
const getReportsByStudentID = async (student_id) => {
    let colReport = db.collection('IS_Reports');
    return colReport.find({student_id: student_id}).project({file_id: 1, module_id: 1}).toArray();
}

// 通过模块ID获得所有报告
const getReportsByModuleID = async (module_id) => {
    let colReport = db.collection('IS_Reports');
    return colReport.find({module_id: student_id}).project({file_id: 1, student_id: 1}).toArray();
}

// 插入报告
const insertReport = async (student_id, module_id, file_id) => {
    let colReport = db.collection('IS_Reports');
    let doc = {
        student_id: student_id,
        module_id: module_id,
        file_id: file_id
    };

    return colReport.insertOne(doc);
}

// 更新或插入报告
const upsertReport = async (student_id, module_id, file_id) => {
    let colReport = db.collection('IS_Reports');
    return colReport.updateOne({student_id: student_id, module_id, module_id}, {$set : {file_id: file_id}}, {upsert: true})
}

// 移除报告
const removeReport = async (student_id, module_id) => {
    let colReport = db.collection('IS_Reports');
    return colReport.deleteOne({student_id: student_id, module_id: module_id}); // 错误处理?
}

// 通过学生ID和模块ID获得教师评价
const getJudgementByStudentIDAndModuleID = async (student_id, module_id) => {
    let colJudgement = db.collection('IS_Judgements');
    var ret = undefined;
    let res = await colJudgement.findOne({student_id: student_id, module_id: module_id});
    if(res) {
        ret = {
            score: result.score,
            text: result.text
        };
    }

    return ret;
}

// 通过学生ID获得所有评价
const getJudgementsByStudentID = async (student_id) => {
    let colJudgement = db.collection('IS_Judgements');
    return colJudgement.find({student_id: student_id}).project({score: 1, text: 1, module_id: 1}).toArray();
}

// 通过模块ID获得所有评价
const getJudgementsByModuleID = async (module_id) => {
    let colJudgement = db.collection('IS_Judgements');
    return colJudgement.find({module_id: module_id}).project({score: 1, text: 1, student_id: 1}).toArray();
}

// 插入评价
const insertJudgement = async (student_id, module_id, score, text) => {
    let colJudgement = db.collection('IS_Judgements');
    let doc = {
        student_id: student_id,
        module_id: module_id,
        score: score,
        text: text
    };

    return colJudgement.insertOne(doc);
}

// 更新或插入评价
const upsertJudgement = async (student_id, module_id, score, text) => {
    let colReport = db.collection('IS_Judgements');
    return colReport.updateOne({student_id: student_id, module_id, module_id}, {$set: {score: score, text: text}}, {upsert: true})
}

// 移除评价
const removeJudgement = async (student_id, module_id) => {
    let colJudgement = db.collection('IS_Judgements');
    return colJudgement.deleteOne({student_id: student_id, module_id: module_id});
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