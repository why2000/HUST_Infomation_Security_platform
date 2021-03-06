'use strict'

let coursewareFileList;
let courselist;
let courseNum = new Set();
let courseid;
let classname;
let username;

$(document).ready(function () {
  courseid = window.location.href.substring(window.location.href.lastIndexOf('/') + 1, window.location.href.length);
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
  getCourseList();
  getUserName();

})
  .on('click', '.my-download-button', async function () {
    let file_id = $(this).attr('fid');
    console.log(file_id);
    let url = 'http://' + window.location.host + '/file/' + file_id;
    let $form = $('<form method="GET"></form>');
    $form.attr('action', url);
    $form.appendTo($('body'));
    $form.submit();
  })

async function render(coursewareFileList, courseName) {
  let html = "";
  for (let n = 0, dLen = coursewareFileList.length; n < dLen; n++) {
    html += '<li class="list-group-item" >'
      + "  课程名称: " + courseName + "  课件名称: " + coursewareFileList[n].file_name
    html += `<button type="button" class="my-download-button btn btn-primary pull-right" fid='${coursewareFileList[n].file_id}'>下载</button>`
      + '</li >';
  }
  $('#courseware-list').empty().append(html);
}

/* TopBar*/

function logout() {
  $.get({
    url: '/login/logout'
  }).done(function () {
    alert("退出成功！");
    window.location.href = '/';
  })
}

function getCourseList() {
  $.get({
    url: '/course',
  }).done(result => {
    courselist = result.data;
    let selectedCourse = courselist.filter(e => {
      return e._id == courseid;
    });
    classname = selectedCourse[0].name;
    setClassName();
    getCoursewareList();
    for (let n = 0; n < courselist.length; n++) {
      $('#course-list').append(`<li><a href="/tutorial/index#${courselist[n]._id}"><i class="fa fa-dot-circle-o fa-lg"></i><span class="nav-text-small">${courselist[n].name}</span></a></li>`);
    };
  });
}

function getCoursewareList() {
  $.get({
    url: '/courseware/list/' + courseid,
    success: (data) => {
      coursewareFileList = data.data;
      if (coursewareFileList) {
        render(coursewareFileList, classname);
      } else {
        $('#courseware-list').empty().append('<li class="list-group-item" >暂无课件</li>');
      }
    }
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

function setClassName() {
  if (classname) {
    $('#big-title').text('下载课件 当前课程: ' + classname);
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