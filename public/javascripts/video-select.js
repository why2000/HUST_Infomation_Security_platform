'use strict'

let courseID;
let username;
let courselist;
let Videolist;
let courseName;

$(document).ready(function () {
  courseID = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1, window.location.pathname.length);
  $('#class-to-exam').attr('href', `/exam/${courseID}`);
  $('#class-to-feedback').attr('href', `/feedback/${courseID}/class/null`);
  $('#class-to-courseware').attr('href', `/courseware/course/${courseID}`);
  $('#class-to-information').attr('href', `/information`);


  $(".has-submenu").hover(function () {
    var height;
    var current_list = $(this).find('.submenu').attr("id");
    current_list = current_list.split('-').join('');
    console.log(current_list);
    if (current_list != null && current_list != undefined) {
      console.log(eval(current_list))
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
  getVideoList();
  getUserName();
})

function getVideoList() {
  $.get({
    // todo
    url: '/course/video' + courseID
  }).done(result => {
    videolist = result.data;
    let html = '';
    for (let n = 0; n < videolist.length; n++) {
      // todo
      html += '<a class="list-group-item" href="/video/' + courseID + videolist[n]._id + '">'
        + "  视频名称: " + videolist[n].name
        + '</li >';
    }
    $('#video-select').empty().append(html);
  })
}

function getCourseList() {
  $.get({
    url: '/course',
  }).done(result => {
    courselist = result.data;
    for (let i = 0; i < courselist.length; i++) {
      $('#course-list').empty().append(`<li><a href="/tutorial/${courselist[i]._id}"><i class="fa fa-dot-circle-o fa-lg"></i><span class="nav-text-small">${courselist[i].name}</span></a></li>`);
    };
    let selectedCourse = courselist.filter(e => {
      return e._id == courseID;
    });
    courseName = selectedCourse[0].name;
    setCourseName();
  });
}

function logout() {
  $.get({
    url: '/tutorial/logout'
  }).done(function () {
    alert("退出成功！");
    window.location.href = '/';
  })
}

function getUserName() {
  $.get({
    url: '/tutorial/username'
  }).done(result => {
    username = result.username;
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
  if (courseName) {
    $('#big-title').text('上传报告 当前课程: ' + courseName);
  }
}