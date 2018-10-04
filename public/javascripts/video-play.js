'use strict';

let videofile;
let courseID;
let username;
let courselist;
let info;

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

$(document).ready(function () {
  let localURLArgs = location.href.split('/');
  videofile = localURLArgs[localURLArgs.length - 1];
  courseID = localURLArgs[localURLArgs.length - 2];
  $('#class-to-exam').attr('href', `/exam/${courseID}`);
  $('#catalog').attr('href', `/tutorial/index#${courseID}`);
  $('#class-to-feedback').attr('href', `/feedback/${courseID}/class/null`);
  $('#class-to-courseware').attr('href', `/courseware/course/${courseID}`);

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
  setVideo();
});

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
    url: '/tutorial/username'
  }).done(result => {
    username = result.username;
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

function setVideo(videofile) {
  $('#pim_content').css('width', '100%').css('margin', '0px');
  $('.main_content .notice_title_01').empty().text('正在播放');
  // todo
  $('.main_content .notice_content_01').empty().append(`<div class="flowplayer"><video controls="controls" width="100%"> <source type="video/mp4" src='/public/videos/${videofile}'></video></div>`)
}
