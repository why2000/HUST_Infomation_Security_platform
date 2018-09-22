'use strict'

let coursewareFileList;
let current_url_valid = window.location.protocol + window.location.pathname;
let courseNum = new Set();

$(document).ready(function () {
  $.get({
    url: '/courseware/list',
    success: (data) => {
      coursewareFileList = data.data;
      coursewareFileList.sort()
      render(coursewareFileList, 'All');
      for (let n = 0, dLen = coursewareFileList.length; n < dLen; n++) {
        courseNum.add(coursewareFileList[n].course_id);
      }
      courseNum.forEach(val => { $('#course-select').append('<option>' + val + '</option>') });
    }
  });
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
  .on('change', '#course-select', async function () {
    render(coursewareFileList, $(this).val());
  })

async function render(coursewareFileList, courseLimit) {
  let html = "";
  $('#course-list').empty();
  for (let n = 0, dLen = coursewareFileList.length; n < dLen; n++) {
    if (courseLimit == 'All' || coursewareFileList[n].course_id == courseLimit) {
      html += '<li class="list-group-item" >'
        + "课程序号: " + coursewareFileList[n].course_id + " 课件名称: " + coursewareFileList[n].file_name
      html += `<button type="button" class="my-download-button btn btn-primary pull-right" nid='${n}'>下载</button>`
        + '</li >';
    }
  }
  $('#course-list').append(html);
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

function up(x, y) {
  return x.course_id - y.course_id
}
