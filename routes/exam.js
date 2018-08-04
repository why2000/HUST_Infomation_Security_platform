var express = require('express');
var router = express.Router();
let ExamLogger = require('../logger').ExamLogger;
let ExamController = require('../controllers/exam_controller');

var favor = "no";
/* GET exam page. */
router.get('/', async (req, res, next) => {
  var page = "exam";
  var classindex = req.params.classindex;
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
  res.render(page, {name: null, favor: "no", classinfo: null});
});

router.get('/:classindex', async(req, res, next) => {
  var page = "exam";
  var classindex = req.params.classindex.toString(); // String
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
    var params = {
      "classindex": classindex,
      "userid": userid
    }
    if(await ExamController.getFavor(params)){
      favor = "yes";
    }else{
      favor = "no";
    }
    var classinfo = await ExamController.getClassInfo(classindex);
    res.render(page, {name: null, favor: favor, classinfo: classinfo});
  }catch(err){
    res.render(page, {name: null, favor: "no", classinfo: classinfo});
    next(err);
  }
});

router.post('/:classindex', async (req, res, next) => {
  var classindex = req.params.classindex;
  var userid = "U201714635";
  var params ={
    "favor": req.body.favor,
    "classindex": classindex,
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
})

router.delete('/:classindex', async (req, res, next) => {
  var classindex = req.params.classindex;
  var userid = "U201714635";
  var params ={
    "favor": req.body.favor,
    "classindex": classindex,
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
})

module.exports = router;
