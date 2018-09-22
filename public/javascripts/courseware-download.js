'use strict'

let current_url_valid = window.location.protocol + window.location.pathname;

$(document).ready(function () {
  let url = window.location.href;
  $.get({
    url: '/courseware/list',
    success: (data) => {
      let html = "";
      for (let course_id = 1, dLen = data.data.length; course_id <= dLen; course_id++) {
        html += '<li class="list-group-item" >'
          + "No." + course_id + "：" + data.data[course_id - 1].course_name
        let disable;
        if (data.data[course_id - 1].status == false) {
          disable = 'disabled="disabled"';
        } else {
          disable = '';
        }
        html += `<button type="button" class="my-download-button btn btn-primary pull-right" cid="course${course_id}" ${disable}>下载</button>`
          + '</li >';
      }
      $('#course-list').append(html);
    }
  });
  console.log("get list suc");
})
  .on('click', '.my-download-button', async function () {
    let cid = $(this).attr('cid');
    let url = window.location.href;
    let IFrameRequest = document.createElement("iframe");
    IFrameRequest.id = "FakeDownload";
    IFrameRequest.src = url + '/file/' + cid;
    IFrameRequest.style.display = "none";
    document.body.appendChild(IFrameRequest);
  })

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