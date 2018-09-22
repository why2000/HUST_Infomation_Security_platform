'use strict'
let coursewareFileList;
let url = window.location.protocol + window.location.pathname;
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
  console.log("get list suc");
})
  .on('click', '.btn-warning', async function () {
    $(this).removeClass("btn-warning");
    $(this).addClass("btn-danger");
    $(this).text("确认删除？");
  })
  .on('mouseleave', '.btn-danger', async function () {
    $(this).removeClass("btn-danger");
    $(this).addClass("btn-warning");
    $(this).text("删除");
  })
  .on('click', '.btn-danger', async function () {
    let $this = $(this);
    let cid = $(this).attr('cid');
    let nid = $(this).attr('nid');
    let file_id = coursewareFileList[nid].file_id;

    $.ajax({
      url: '/courseware/file/' + file_id,
      type: 'DELETE',
      data: {}
    }).done(function () {
      $this.removeClass("btn-primary");
      $this.removeClass("btn-danger");
      $this.addClass("btn-success");
      $this.text("删除成功");
      $this.attr('disabled', 'disabled');
      $(`.my-download-button[cid='${cid}']`).attr('disabled', 'disabled');
    }).fail(function () {
      $this.text("删除失败，请重试。");
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
  .on('click', '.my-upload-button', async function () {
    let cid = $("#uploadCourse").val();
    let file = $("#uploadFile")[0].files[0]

    if (!file) {
      alert('您还未选择文件！');
    } else {
      const acceptFile = /^.*(\.doc|\.docx|\.ppt|\.pptx|\.pdf)$/;
      if (acceptFile.test(file.name)) {
        let form = new FormData();
        form.append('upload', file);
        $.ajax({
          type: 'post',
          url: `/courseware/file/${cid}`,
          data: form,
          contentType: false,
          processData: false,
          mimeType: 'multipart/form-data',
          success: () => {
            alert('上传成功！');
            location.reload();
          },
          error: xhr => {
            alert(JSON.parse(xhr.responseText).msg);
            location.reload();
          }
        });
      } else {
        alert("文件格式错误！");
      }
    }
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
        + '<div class="btn-group pull-right">'
      html += `<button type="button" class="my-delete-button btn btn-primary btn-warning" cid='${coursewareFileList[n].course_id}' nid='${n}'>删除</button>`
        + `<button type="button" class="my-download-button btn btn-primary" cid='${coursewareFileList[n].course_id}' nid='${n}'>下载</button>`
        + '</div > </li>';
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