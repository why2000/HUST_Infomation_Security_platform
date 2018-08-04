var express = require('express');
var router = express.Router();
let ExamLogger = require('../logger').ExamLogger;
let ExamController = require('../controllers/exam_controller');



/* GET exam page. */
router.get('/', async (req, res, next) => {
  var page = "exam";
  var taskindex = req.params.taskindex;
  if(req.cookies.teacher){
    await UserController.createUser(info);
    page += "_teacher"
  }
  else if(req.cookies.student){
    await UserController.createUser(info);
  }
  else{
    //这里改成redirect: /
    // res.redirect("/");
  }
  res.render(page, {name: null});
});



router.get('/:taskindex', async(req, res, next) => {
  var page = "exam";
  var taskindex = req.params.taskindex.toString(); // String
  var userid = "U201714635";
  var favor = "no";
  if(req.cookies.teacher){
    await UserController.createUser(info);
    page += "_teacher"
  }
  else if(req.cookies.student){
    await UserController.createUser(info);
  }
  else{
    //这里改成redirect: /
    // res.redirect("/");
  }
  try{
    res.render(page, {name: null});
  }catch(err){
    res.render(page, {name: null});
    next(err);
  }
});


// TaskList
router.get('/*/tasklist', async (req, res, next) => {
  var userid = "U201714635";
  var params = {
    "userid": userid
  }
  tasklist = await ExamController.getTaskList(params);
  res.json({result: {tasklist: tasklist}});
});



// FavorList
router.get('/*/favorlist', async(req, res, next) => {
  var userid = "U201714635";
  var params = {
    "userid": userid
  }
  favorlist = await ExamController.getFavorList(params);
  // console.log(favorlist);
  res.json({result: {favorlist: favorlist}});
});



// Favor
router.get('/:taskindex/favor', async (req, res, next) => {
  var taskindex = req.params.taskindex;
  var userid = "U201714635";
  var params = {
    "taskindex": taskindex,
    "userid": userid
  }
  favor = await ExamController.getFavor(params)
  res.json({result: {favor: favor}});
});


router.post('/:taskindex/favor', async (req, res, next) => {
  var taskindex = req.params.taskindex;
  var userid = "U201714635";
  var params ={
    "favor": req.body.favor,
    "taskindex": taskindex,
    "userid": userid
  }
  //console.log(req.body);
  try {
      let result = await ExamController.postFavor(params);
      ExamLogger.info(`add favor result => ${JSON.stringify(result, null, 2)}`);
      res.json({"result": result});
  } catch(err) {
      ExamLogger.error(`add favor error => ${err.stack}`);
      next(err);
  }
});




router.delete('/:taskindex/favor', async (req, res, next) => {
  var taskindex = req.params.taskindex;
  var userid = "U201714635";
  var params ={
    "favor": req.body.favor,
    "taskindex": taskindex,
    "userid": userid
  }
  //console.log(req.body);
  try {
      let result = await ExamController.deleteFavor(params);
      ExamLogger.info(`delete favor result => ${JSON.stringify(result, null, 2)}`);
      res.json({"result": result});
  } catch(err) {
      ExamLogger.error(`delete favor error => ${err.stack}`);
      next(err);
  }
});

router.get('/:taskindex/taskinfo', async (req, res, next) => {
  var taskindex = req.params.taskindex;
  var userid = "U201714635";
  var params = {
    "taskindex": taskindex,
    "userid": userid
  }
  var taskinfo = await ExamController.getTaskInfo(params);
  res.json({result: {taskinfo: taskinfo}});
});

module.exports = router;
