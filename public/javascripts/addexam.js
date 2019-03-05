'use strict'

let courseid;
let studentID;
let courselist;
let classname;
let username;
let examlist;
let currentsingle = 0;
let singlelist = new Array();
let currentmulti = 0;
let multilist = new Array();
let currentfill = 0;
let filllist = new Array();

$(document).ready(function () {
  window.onbeforeunload = function (e) {
    var e = window.event || e;
    e.returnValue = ("确定离开当前页面吗？");
  }
  getCourseid();
  getCourseList();
  getUserName();
  sideBarInit();
  getExamList();
})
  .on("click", ".exam-select-item", function () {
    $('.exam-select-item').removeClass('list-group-item-success');
    $(this).addClass('list-group-item-success');

    let $this = $(this);

    $.get({
      url: `/exam/${courseid}/${$this.attr('eid')}/score`
    }).done(result => {
      let studentScores = result.data;
      let html = '';
      studentScores.forEach(result => {
        html += '<tr class="report-row">'
          + `<td class="studentName">${result.name}</td>`
          + `<td class="studentID" > ${result.userid}</td >`;
        if (result.has_done) {
          html += `<td class="studentScore" > ${result.score}</td >`;
        } else {
          html += `<td class="studentScore" > 未完成</td >`;
        }
        html += '</tr >';
      })
      $('#exam-result-table').empty().append(html);
    })
  })


function AddSingle() {
  singlelist[currentsingle] = 1;
  $('#questions').append("<div class=\"card\" id=\"singlechoose" + currentsingle.toString() + "\" style=\"margin-left:20px; margin-right:20px;\"> <div class=\"card-body\" style=\"padding-left:20px; padding-right:20px;\"> <input class=\" text-center form-control\" style=\"background-color: white; border:#ced4da solid 1px;color:black; margin-bottom:10px;\" id=\"questionname\" placeholder=\"题目内容\"> <div class=\"card\"> <div class=\"card-body\"> <div id=\"options\"> <div class=\"input-group mb-3\"> <div class=\"input-group-prepend\"> <div class=\"input-group-text\"> <input type=\"radio\" aria-label=\"Checkbox for following text input\" checked=\"checked\" name=\"single" + currentsingle.toString() + "\"> </div> </div> <input type=\"text\" class=\"form-control text-center\" id= \"singleoption\" aria-label=\"Text input with checkbox\" placeholder=\"选项\"> </div> <div class=\"input-group mb-3\"> <div class=\"input-group-prepend\"> <div class=\"input-group-text\"> <input type=\"radio\" aria-label=\"Checkbox for following text input\" name=\"single" + currentsingle.toString() + "\"> </div> </div> <input type=\"text\" class=\"form-control text-center\" id= \"singleoption\" aria-label=\"Text input with checkbox\" placeholder=\"选项\" > </div> </div> <div class=\"row form-inline \" style=\"padding-left:20px; padding-right:20px; \"> <div class=\"col-6 \"> <button type=\"button \" id=\"addopt \" class=\"btn btn-outline-info btn-block btn-lg \" onclick = \"AddOption(this)\">增加选项</button> </div> <div class=\"col-6 \"> <button type=\"button \" id=\"decopt \" class=\"btn btn-outline-info btn-block btn-lg \" onclick= \"DecOption(this);\">减少选项</button> </div> </div> 				<br>			 <div class=\"row form-inline \" style=\"padding-left:20px; padding-right:20px; \"><button type=\"button \" id=\"decq \" class=\"btn btn-outline-info btn-block btn-lg \" onclick= \"DecQuestion(this);\">去掉本题</button> </div> </div> </div> </div> </div>")
  currentsingle++;
}

function AddMulti() {
  multilist[currentmulti] = 1;
  $('#questions').append("<div class=\"card\" id=\"multichoose" + currentmulti.toString() + "\" style=\"margin-left:20px; margin-right:20px;\"> <div class=\"card-body\" style=\"padding-left:20px; padding-right:20px;\"> <input class=\" text-center form-control\" style=\"background-color: white; border:#ced4da solid 1px;color:black; margin-bottom:10px;\" id=\"questionname\" placeholder=\"题目内容\"> <div class=\"card\"> <div class=\"card-body\"> <div id=\"options\"> <div class=\"input-group mb-3\"> <div class=\"input-group-prepend\"> <div class=\"input-group-text\"> <input type=\"checkbox\" aria-label=\"Checkbox for following text input\" checked=\"checked\" name=\"multi" + currentmulti.toString() + "\"> </div> </div> <input type=\"text\" class=\"form-control text-center\" id= \"multioption\" aria-label=\"Text input with checkbox\" placeholder=\"选项\"> </div> <div class=\"input-group mb-3\"> <div class=\"input-group-prepend\"> <div class=\"input-group-text\"> <input type=\"checkbox\" aria-label=\"Checkbox for following text input\" name=\"multi" + currentmulti.toString() + "\"> </div> </div> <input type=\"text\" class=\"form-control text-center\" id= \"multioption\" aria-label=\"Text input with checkbox\" placeholder=\"选项\" > </div> </div> <div class=\"row form-inline \" style=\"padding-left:20px; padding-right:20px; \"> <div class=\"col-6 \"> <button type=\"button \" id=\"addopt \" class=\"btn btn-outline-info btn-block btn-lg \" onclick = \"AddmOption(this)\">增加选项</button> </div> <div class=\"col-6 \"> <button type=\"button \" id=\"decopt \" class=\"btn btn-outline-info btn-block btn-lg \" onclick= \"DecOption(this);\">减少选项</button> </div> </div> 				<br>			 <div class=\"row form-inline \" style=\"padding-left:20px; padding-right:20px; \"><button type=\"button \" id=\"decq \" class=\"btn btn-outline-info btn-block btn-lg \" onclick= \"DecQuestion(this);\">去掉本题</button> </div> </div> </div> </div> </div>")
  currentmulti++;
}

function AddFill() {
  filllist[currentfill] = 1;
  $('#questions').append("<div class=\"card\" id=\"fillgap" + currentfill.toString() + "\" style=\"margin-left:20px; margin-right:20px;\"> <div class=\"card-body\" style=\"padding-left:20px; padding-right:20px;\"> <input class=\" text-center form-control\" style=\"background-color: white; border:#ced4da solid 1px;color:black; margin-bottom:10px;\" id=\"questionname\" placeholder=\"题目内容\"> <div class=\"card\"> <div class=\"card-body\"> <div id=\"options\"> <div class=\"input-group mb-3\"> <div class=\"input-group-prepend\"> </div> <input name=\"gaps" + currentfill.toString() + "\" type=\"text\" class=\"form-control text-center\" id= \"gapcontent\" aria-label=\"Text input with checkbox\" placeholder=\"可选答案（如有多个空，答案间用逗号隔开）\"> </div> </div> <div class=\"row form-inline \" style=\"padding-left:20px; padding-right:20px; \"> <div class=\"col-6 \"> <button type=\"button \" id=\"addopt \" nid=\"" + currentfill.toString() + "\" class=\"btn btn-outline-info btn-block btn-lg \" onclick = \"AddFillAnswer(this)\">增加可选答案</button> </div> <div class=\"col-6 \"> <button type=\"button \" id=\"decopt \" nid=\"" + currentfill.toString() + "\" class=\"btn btn-outline-info btn-block btn-lg \" onclick= \"DecFillAnswer(this);\">减少可选答案</button> </div> </div> 				<br>			 <div class=\"row form-inline \" style=\"padding-left:20px; padding-right:20px; \"><button type=\"button \" id=\"decq \" class=\"btn btn-outline-info btn-block btn-lg \" onclick= \"DecQuestion(this);\">去掉本题</button> </div> </div> </div> </div> </div>")
  currentfill++;
}

function Submit() {

  var contents = [];
  var content;
  var id = 0;
  var name = $('#examname').val();
  if (name == '') {
    alert("请填写测试名称！");
    return;
  }

  for (var i = 0; i < currentsingle; i++) {
    if (singlelist[i] != 1) continue;
    else {
      var op = [];
      var text = $("#singlechoose" + i.toString()).find('#questionname').val();
      //console.log(text);
      content = { "id": id, "type": "sc", "text": text, "indents": 0, "options": [], "src": "" };
      var options = $("#singlechoose" + i.toString()).find("input[type='text']");
      var radios = $("#singlechoose" + i.toString()).find("input[type='radio']");
      var trueanswer = 0;
      for (; trueanswer < radios.length; trueanswer++) {
        if (radios[trueanswer].checked == true) break;
      }
      for (var o = 0; o < options.length; o++) {
        op.push({ "text": options[o].value, "choice": String.fromCharCode('A'.charCodeAt() + o), "is_correct": o == trueanswer ? true : false });
      }
      content['options'] = op;
      contents.push(content);
      id++;
    }
  }
  for (var i = 0; i < currentmulti; i++) {
    if (multilist[i] != 1) continue;
    var op = [];
    var text = $("#multichoose" + i.toString()).find('#questionname').val();
    //console.log(text);
    content = { "id": id, "type": "mc", "text": text, "indents": 0, "options": [], "src": "" };
    var options = $("#multichoose" + i.toString()).find("input[type='text']");
    var checkboxes = $("#multichoose" + i.toString()).find("input[type='checkbox']");
    var trueanswer = [];
    for (var j = 0; j < checkboxes.length; j++) {
      if (checkboxes[j].checked == true) trueanswer.push(true);
      else trueanswer.push(false);
    }
    for (var o = 0; o < options.length; o++) {
      op.push({ "text": options[o].value, "choice": String.fromCharCode('A'.charCodeAt() + o), "is_correct": trueanswer[o] });
    }
    content['options'] = op;
    contents.push(content);
    id++;
  }

  for (let i = 0; i < currentfill; i++) {
    if (filllist[i] != 1) continue;

    var op = []
    var text = $("#fillgap" + i.toString()).find("#questionname").val();
    //console.log(text);
    content = { "id": id, "type": "fb", "text": text, "indents": 0, "options": [], "src": "" };
    var options = $("#fillgap" + i.toString()).find("input[type='text']");

    for (let i = 0; i < options.length; i++) {
      op.push({ "text": options[i].value });
    }
    content['options'] = op;
    contents.push(content);
    id++;
  }

  var request = { "course_id": courseid, "title": name, "content": contents, "timelimit": 300 };

  if ($("#examdescription").val()) {
    request["description"] = $("#examdescription").val();
  }
 
  if ($("#examtimehour").val() || $("#examtimeminute").val() || $("#examtimesecond").val()) {
    var timelimit = Number($("#examtimehour").val()) * 3600 + Number($("#examtimeminute").val()) * 60 + Number($("#examtimesecond").val());
    request["timelimit"] = timelimit;
  }

  // console.log(request);

  $.post({
    url: `/exam/${courseid}`,
    contentType: 'application/json',
    data: JSON.stringify(request)
  }).done(result => {
    if (result.status != 200) alert("提交错误！");
    else {
      alert("提交成功！");
      window.onbeforeunload = null;
      window.history.back(-1);
    }
  })
  
}

function DecQuestion(o) {
  $(o).parent().parent().parent().parent().parent().remove();
}

function AddFillAnswer(o) {
  var current = $(o).attr("nid");
  console.log(current);
  $(o).parent().parent().parent().find('#options').append("<div class=\"input-group mb-3\"><div class=\"input-group-prepend\"></div> <input name=\"gaps" + current + "\" type=\"text\" class=\"form-control text-center\" id= \"gapcontent\" aria-label=\"Text input with checkbox\" placeholder=\"可选答案（如有多个空，答案间用逗号隔开）\"></div>");
}

function DecFillAnswer(o) {
  let num = $(o).parent().parent().parent().find('#options').children().length;

  if (num <= 1) return;

  $(o).parent().parent().parent().find('#options').children(":eq(-1)").remove();
}

function AddOption(o) {
  var current = $(o).parent().parent().parent().parent().parent().parent().attr("id");
  current = current.substr(12);
  $(o).parent().parent().parent().find('#options').append("<div class=\"input-group mb-3\"><div class=\"input-group-prepend\"><div class=\"input-group-text\"><input type=\"radio\" aria-label=\"Checkbox for following text input\" name=\"single" + current + "\"></div></div><input type=\"text\" id= \"singleoption\" class=\"form-control text-center\" aria-label=\"Text input with checkbox\" placeholder=\"选项\" ></div>");
}

function AddmOption(o) {
  var current = $(o).parent().parent().parent().parent().parent().parent().attr("nid");
  current = current.substr(11);
  $(o).parent().parent().parent().find('#options').append("<div class=\"input-group mb-3\"><div class=\"input-group-prepend\"><div class=\"input-group-text\"><input type=\"checkbox\" aria-label=\"Checkbox for following text input\" name=\"multi" + current + "\"></div></div><input type=\"text\" id= \"multioption\" class=\"form-control text-center\" aria-label=\"Text input with checkbox\" placeholder=\"选项\" ></div>");
}

function DecOption(o) {
  let num = $(o).parent().parent().parent().find('#options').children().length;

  if (num <= 2) return;

  $(o).parent().parent().parent().find('#options').children(":eq(-1)").remove();
}

function getExamList() {
  $.get({
    url: `/exam/${courseid}`
  }).done(result => {
    examlist = result.data;
    for (let n = 0; n < examlist.length; n++) {
      $('#exams-select').append('<a class="list-group-item list-group-item-action exam-select-item" eid="' + examlist[n]._id + '">' + '练习名称: ' + examlist[n].title + '</a >')
    };
  })
}
function getCourseid() {
  courseid = window.location.href.substring(window.location.href.lastIndexOf('#') + 1, window.location.href.length);
}

function sideBarInit() {
  $('#class-to-exam').attr('href', `/exam/index#${courseid}`);
  $('#class-to-feedback').attr('href', `/feedback/index#${courseid}`);
  $('#class-to-courseware').attr('href', `/courseware/course/${courseid}`);
  $('#class-to-video').attr('href', `/tutorial/video#${courseid}`);
  $('#class-home-page').attr('href', `/tutorial/index#${courseid}`);
  $('#class-to-logout').attr('href', `/login/logout`);

  $(".has-submenu").hover(function () {
    var height;
    var current_list = $(this).find('.submenu').attr("id");
    current_list = current_list.split('-').join('');
    if (current_list != null && current_list != undefined) {
      height = eval(current_list).length * 41;
    } else {
      height = 0;
    }
    $('#sidebar-back').css('display', 'none');
    $(this).find('.submenu').stop().css("height", `${height}px`).slideDown(300);
    $(this).find(".mlist-icon").addClass("fa-rotate-90").css("width", "30px").css("transform", "translateY(-12px) rotate(90deg)");
  }, function () {
    $(this).find(".submenu").stop().slideUp(300);
    $(this).find(".mlist-icon").removeClass("fa-rotate-90").css("width", "55px").css("height", "36px").css("transform", "");
    $('#sidebar-back').css('display', '');
  });
  $(".main-menu").hover(function () {
    $(".settings").stop().animate({
      opacity: 1
    }, 100);
    // $(".settings").css("visibility", "");
  }, function () {
    $(".settings").stop().animate({
      opacity: 0
    }, 300);
    // $(".settings").css("visibility", "hidden");
  });
}

function logout() {
  $.get({
    url: '/login/logout'
  }).done(function () {
    alert("退出成功！");
    window.location.href = '/';
  })
}

function getUserName() {
  $.get({
    url: '/user/username'
  }).done(result => {
    username = result.result.username;
    setUserName();
  })
}

function getUserId() {
  $.get({
    url: '/user/userid'
  }).done(result => {
    userid = result.result.userid;
    getReportList();
  })
}

function getCourseList() {
  $.get({
    url: '/course',
  }).done(result => {
    courselist = result.data;
    $('#course-list').empty();
    for (let i = 0; i < courselist.length; i++) {
      $('#course-list').append(`<li><a href="/tutorial/index#${courselist[i]._id}"><i class="fa fa-dot-circle-o fa-lg"></i><span class="nav-text-small">${courselist[i].name}</span></a></li>`);
    };
    let selectedCourse = courselist.filter(e => {
      return e._id == courseid;
    });
    classname = selectedCourse[0].name;
    console.log(classname);
    setClassName();
  });
}

function setClassName() {
  if (classname) {
    $('#big-title').text('教师评分 当前课程: ' + classname);
    $('#result-table tbody .classname').text(classname);
  }
}

function setUserName() {
  if (username) {
    $('#result-table tbody .username').text(username);
    var hello = "欢迎！" + username;
    $(".settings").text(hello);
  }
}