'use strict'

let courseid;
let username;
let courselist;
let examlist;
let classname;
let examid;
let countIt;

$(document).ready(function () {
  courseid = window.location.href.substring(window.location.href.lastIndexOf('#') + 1, window.location.href.length);
  $('#class-to-exam').attr('href', `/exam/index#${courseid}`);
  $('#class-to-feedback').attr('href', `/feedback/index#${courseid}`);
  $('#class-to-courseware').attr('href', `/courseware/course/${courseid}`);
  $('#class-home-page').attr('href', `/tutorial/index#${courseid}`);
  $('#class-to-video').attr('href', `/tutorial/video#${courseid}`);
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
  getCourseList();
  getExamList();
  getUserName();
})
  .on('click', '#start-btn .btn-primary', function () {
    $(this).addClass('btn-warning');
    $(this).removeClass('btn-primary');
    $(this).text('确认开始？');
  })
  .on('mouseleave', '#start-btn .btn-warning', function () {
    $(this).addClass('btn-primary');
    $(this).removeClass('btn-warning');
    $(this).text('开始练习');
  })
  .on('click', '#start-btn .btn-warning', function () {
    $(this).attr("disabled", "disabled");
    getExamContent();
    $(this).text('已开始');
  })

function setTimeCount(time) {
  let curr_time = parseInt(Date.parse(new Date()) / 1000);
  let end_time = time + curr_time;
  countIt = setInterval(timeCountDown, 1000, end_time);
}

function timeCountDown(end_time) {
  let curr_time = parseInt(Date.parse(new Date()) / 1000);
  let diff_time = parseInt(end_time - curr_time);
  if (diff_time >= 0) {
    setTimeLimit(diff_time);
  } else {
    clearInterval(countIT);
    //setExamStop();
  }
}

function setTimeLimit(time) {
  let hours = parseInt(time / 3600);
  let minutes = parseInt((time - hours * 3600) / 60)
  let seconds = parseInt(time - hours * 3600 - minutes * 60)
  $('#exam-time').text(`${hours}:${minutes}:${seconds}`);
}

function getExamContent() {
  $.get({
    url: `/exam/${courseid}/${examid}/start`
  }).done(result => {
    let questions = result.data.content;
    let time = result.data.timelimit;
    setExamContent(time, questions);
  })
}

async function setExamStop() {

}

async function setExamStart(time, questions) {
  setTimeCount(time);
  $('#exam-body').empty();
  let qid = 0;
  questions.forEach(question => {
    $('#exam-body').append(`<div class="question card-body" id="qid-${qid}">`);
    $('#exam-body').append(`<p><span style="font-weight:bold;">第${qid + 1}题</span> ${question.text}</p>`);
    if (question.src != '') {
      $(`#qid-${qid}`).append(`<img src="${question.src}" class="img-rounded">`);
    }
    $('#exam-body').append('</div>');
  });
}

function getExamList() {
  $.get({
    url: `/ exam / ` + courseid
  }).done(result => {
    examlist = result.data;
    let html = '';
    for (let n = 0; n < examlist.length; n++) {
      html += '<a class="list-group-item list-group-item-action video-select-item" vid="' + examlist[n]._id + '">'
        + "  练习名称: " + examlist[n].title
        + '</a>';
    }
    $('#examlist-select').empty().append(html);
  })
}

function getExamInformation(examid) {
  $.get({
    url: `/ exam / ${courseid} / ${examid}`
  }).done(result => {
    $('#exam-name').text(result.data.title);
    $('#exam-description').text(result.data.description);
    let time = result.data.timelimit;
    setTimeLimit(time);
    $('#exam-time').text(`${hours}: ${minutes}: ${seconds}`);
  })

}

function getCourseList() {
  $.get({
    url: '/course',
  }).done(result => {
    courselist = result.data;
    $('#course-list').empty();
    for (let i = 0; i < courselist.length; i++) {
      $('#course-list').append(`< li > <a href="/tutorial/index#${courselist[i]._id}"><i class="fa fa-dot-circle-o fa-lg"></i><span class="nav-text-small">${courselist[i].name}</span></a></li > `);
    };
    let selectedCourse = courselist.filter(e => {
      return e._id == courseid;
    });
    classname = selectedCourse[0].name;
    setCourseName();
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

function setUserName() {
  if (!username) {
    username = "数据获取失败";
  }
  var hello = "欢迎！" + username;
  $(".settings").text(hello);
}

function setCourseName() {
  if (classname) {
    $('#big-title').text('课程练习 当前课程: ' + classname);
  }
}
