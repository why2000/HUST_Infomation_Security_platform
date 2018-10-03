'use strict'

let classindex;
let username;
let courselist;

let current_url_valid = window.location.protocol + window.location.pathname;

$(document).ready(function () {
  $.get({
    url: '/course',
  }).done(result => {
    let courseList = result.data;
    let html = "";
    $('#course-lselectist').empty();
    for (let n = 0, dLen = courseList.length; n < dLen; n++) {
      html += '<a class="list-group-item" href="/tutorial/index#' + courseList[n]._id + '">'
        + "  课程名称: " + courseList[n].name
        + '</li >';
    }
    $('#course-select').append(html);
  })

})

$(function sideBarInit() {
  classindex = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1, window.location.pathname.length);
  $('#class-to-exam').attr('href', `/exam/${classindex}`);
  $('#class-to-feedback').attr('href', `/feedback/${classindex}/class/null`);
  $('#class-to-courseware').attr('href', `/courseware/course/${classindex}`);
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
  getUserName();
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
    console.log(courselist);
    for (var i = 0; i < length; i++) {

      $('#course-list').append(`<li><a href="/tutorial/index#${courselist[i]._id}"><i class="fa fa-dot-circle-o fa-lg"></i><span class="nav-text-small">${courselist[i].name}</span></a></li>`);
    };
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
