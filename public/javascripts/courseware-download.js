'use strict'

let coursewareFileList;
let courselist;
let current_url_valid = window.location.protocol + window.location.pathname;
let courseNum = new Set();
let courseid

$(document).ready(function () {
  let localURLArgs = location.href.split('/');
  courseid = localURLArgs[localURLArgs.length - 1];
  sideBarInit();
  $.get({
    url: '/courseware/list/' + courseid,
    success: (data) => {
      coursewareFileList = data.data;
      let selectedCourse = coursewareFileList.filter(e => {
        return e._id == courseid;
      })
      if (selectedCourse[0]) {
        render(coursewareFileList, selectedCourse[0].name);
      } else {
        $('#courseware-list').empty().append('<li class="list-group-item" >暂无课件</li>');
      }
    }
  })
})
  .on('click', '.my-download-button', async function () {
    let nid = $(this).attr('nid');
    let file_id = coursewareFileList[nid].file_id;
    let url = 'http://' + window.location.host + '/file/' + file_id;
    let $form = $('<form method="GET"></form>');
    $form.attr('action', url);
    $form.appendTo($('body'));
    $form.submit();
  })

function sideBarInit() {
  $('#class-to-exam').attr('href', `/exam/${courseid}`);
  $('#class-to-feedback').attr('href', `/feedback/${courseid}/class/null`);
  $('#class-to-courseware').attr('href', `/courseware/course/${courseid}`);
  $('#class-to-information').attr('href', `/information`);
  $('#catalog').attr('href', `/tutorial/${courseid}`);

  $(".has-submenu").hover(function () {
    var height;
    var current_list = $(this).find('.submenu').attr("id");
    current_list = current_list.split('-').join('');
    if (current_list != null && current_list != undefined) {
      console.log(eval(current_list))
      height = eval(current_list).length * 41;
    } else {
      height = 0;
    }
    $('#sidebar-back').css('display','none');
    $(this).find('.submenu').stop().css("height", `${height}px`).slideDown(300);
    $(this).find(".mlist-icon").addClass("fa-rotate-90").css("width", "30px").css("transform", "translateY(-12px) rotate(90deg)");
  }, function () {
    $(this).find(".submenu").stop().slideUp(300);
    $(this).find(".mlist-icon").removeClass("fa-rotate-90").css("width", "55px").css("height", "36px").css("transform", "");
    $('#sidebar-back').css('display','');
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
  //getUserName();
}

async function render(coursewareFileList, courseName) {
  let html = "";
  for (let n = 0, dLen = coursewareFileList.length; n < dLen; n++) {
    html += '<li class="list-group-item" >'
      + "  课程名称: " + courseName + "  课件名称: " + coursewareFileList[n].file_name
    html += `<button type="button" class="my-download-button btn btn-primary pull-right" nid='${n}'>下载</button>`
      + '</li >';
  }
  $('#courseware-list').empty().append(html);
}

/* General */

function creatURL(URLarray) {
  var length;
  if (URLarray) {
    length = URLarray.length
  } else {
    return URLarray;
  }
  var newURLarray = URLarray.filter(function (currentValue) {
    return currentValue && currentValue != null && currentValue != undefined;
  });
  var result = "";
  result = result + newURLarray[0];
  for (var i = 1; i < length; i++) {
    if (result.endsWith('/')) {
      result = result + newURLarray[i];
    } else {
      result = result + '/' + newURLarray[i];
    }
  }
  return result;
}

function setXmlHttp() {
  var xmlhttp;
  if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  } else { // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  return xmlhttp;
}

function RESTful(xmlhttp, method, url, queryString, async, fnc) { //获取JSON数据
  xmlhttp.open(method, url, async);
  xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  xmlhttp.send(queryString);
  xmlhttp.onreadystatechange = fnc;
}

/* TopBar*/

function Logout(callback) {
  var xmlhttp = setXmlHttp();
  RESTful(xmlhttp, "GET", creatURL([current_url_valid, 'logout']), null, true, function () {
    if (xmlhttp.readyState == 4) {
      if (xmlhttp.status == 200) {
        alert("退出成功！");
        window.location.href = '/';
        if (callback) {
          callback();
        }
      } else {
        console.log("发生错误" + xmlhttp.status);
      }
    }
  });
}

function getCourseList(callback) {
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

      $('#course-list').append(`<li><a href="/tutorial/${courselist[i]._id}"><i class="fa fa-dot-circle-o fa-lg"></i><span class="nav-text-small">${courselist[i].name}</span></a></li>`);
    };
  });
}

function getUserName(callback) {

  var xmlhttp = setXmlHttp();
  RESTful(xmlhttp, "GET", creatURL([current_url_valid, 'username']), null, true, function () {
    if (xmlhttp.readyState == 4) {
      if (xmlhttp.status == 200) {
        // alert(xmlhttp.responseText);
        username = JSON.parse(xmlhttp.responseText).result.username;
        // alert(tasklist);
        // setTaskList(tasklist);
        setUserName();
        if (callback) {
          callback();
        }
      } else {
        console.log("发生错误" + xmlhttp.status);
      }
    }
  });
}