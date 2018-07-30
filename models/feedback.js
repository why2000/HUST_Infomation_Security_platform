var db = require('./db')

// 通过学生ID和模块ID获得报告
const getReportByStudentIDAndModuleID = (student_id, module_id) => {

}

// 通过学生ID获得所有报告
const getReportsByStudentID = (student_id) => {

}

// 通过模块ID获得所有报告
const getReportsByModuleID = (module_id) => {

}

// 插入报告
const insertReport = (student_id, module_id, file_id) => {

}

// 移除报告
const removeReport = (student_id, module_id, file_id) => {

}

// 通过学生ID和模块ID获得教师评价
const getFeedbackByStudentIDAndModuleID = (student_id, module_id) => {

}

// 通过学生ID获得所有评价
const getFeedbacksByStudentID = (student_id) => {

}

// 通过模块ID获得所有评价
const getFeeckbacksByModuleID = (module_id) => {

}

// 插入评价
const insertFeedback = (student_id, module_id, score, text) => {

}

// 移除评价
const removeFeedback = (student_id, module_id) => {
    
}


module.exports = {
    getFeeckbacksByModuleID,
    getFeedbackByStudentIDAndModuleID,
    getFeedbacksByStudentID,
    getReportByStudentIDAndModuleID,
    getReportsByModuleID,
    getReportsByStudentID,
    insertReport,
    insertFeedback,
    removeReport,
    removeFeedback
}