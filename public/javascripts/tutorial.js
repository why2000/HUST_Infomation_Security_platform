'use strict';

let courseid;
let username;
let courselist;

/* TopBar*/

function Logout() {
  $.get({
    url: '/tutorial/logout'
  }).done(function () {
    alert("退出成功！");
    window.location.href = '/';
  })
}

/* SideBar */

$(function sideBarInit() {
  courseid = window.location.href.substring(window.location.href.lastIndexOf('#') + 1, window.location.href.length);
  $('#class-to-exam').attr('href', `/exam/${courseid}`);
  $('#class-to-video').attr('href', `/tutorial/video#${courseid}`);
  $('#catalog').attr('href', `/tutorial/index#${courseid}`);
  $('#class-to-feedback').attr('href', `/feedback/${courseid}/class/null`);
  $('#class-to-courseware').attr('href', `/courseware/course/${courseid}`);

  $(".has-submenu").hover(function () {
    var height;
    var current_list = $(this).find('.submenu').attr("id");
    current_list = current_list.split('-').join('');
    if (current_list != null && current_list != undefined) {
      if (eval(current_list) <= 8) {
        height = eval(current_list).length * 41;
      } else {
        height = 328;
      }
    } else {
      height = 0;
    }
    $('#sidebar-back').css('display', 'none');
    $(this).find('.submenu').stop().css("height", `${height}px`).slideDown(300);
    $(this).find(".list-icon").addClass("fa-rotate-90").css("width", "30px").css("transform", "translateY(-12px) rotate(90deg)");
  }, function () {
    $(this).find(".submenu").stop().slideUp(300);
    $(this).find(".list-icon").removeClass("fa-rotate-90").css("width", "55px").css("height", "36px").css("transform", "");
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
  getUserName();
  getCourseInfo();
  setButton();
});

function setButton(){
  $('#exam-a').attr('href', `/exam/${courseid}`);
  $('#video-a').attr('href', `/tutorial/video#${courseid}`);
  $('#report-a').attr('href', `/feedback/${courseid}/class/null`);
  $('#courseware-a').attr('href', `/courseware/course/${courseid}`); 
}

function getCourseList() {
  $.get({
    url: '/course',
  }).done(result => {
    courselist = result.data;
    $('#course-list').empty();
    var length = 0;
    if (courselist) {
      length = courselist.length;
    }
    for (var i = 0; i < length; i++) {

      $('#course-list').append(`<li><a href="/tutorial/index#${courselist[i]._id}"><i class="fa fa-dot-circle-o fa-lg"></i><span class="nav-text-small">${courselist[i].name}</span></a></li>`);
    };
  });
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
    username = "未获取数据";
  }
  var hello = "欢迎！" + username;
  $(".settings").text(hello);
}

function getCourseInfo() {
  $.get({
    url: '/course/all'
  }).done(result => {
    let nowCourse = result.data.filter(e => {
      return e._id == courseid;
    })
    setCourseInfo(nowCourse[0]);
  })
}

function setCourseInfo(info) {
  $('#class-title').text(`课程名称:${info.name}`);
  $('#class-description').text(`课程描述:${info.description}`);
  $('#teacher-list').empty();
  let html = '';
  html += '<p>教师列表:</p>';
  info.teacher.forEach(teacherID => {
    $.get({
      url: '/user/username/' + teacherID
    }).done(result => {
      html += '<p>'+result.result.username + '</p>';
      $('#teacher-list').empty().append(html);
    })
  })
}