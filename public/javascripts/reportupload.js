let current_url_valid = window.location.protocol + window.location.pathname;
let userid;
let username;
let score;
let judgetext;
let classindex;
let classname;

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


$(document).ready(function () {

  let localURLArgs = location.href.split('/');
  var mid = localURLArgs.pop();

  $.getJSON({
    url: `/feedback/report/${userid}/${mid}`,
    success: (data) => {
      $('#reportaddr').attr('href', `/file/${data.data.file_id}`);
      $('#fileUploaded').show();
    }
  })

  $('#upload').on('change', function () {
    var fileName = $(this)[0].files[0]['name'];
    $('#fileHelpId').html(fileName);
  });

  $('#submit').click(function () {
    var file = $('#upload')[0].files[0];
    if (!file) {
      alert('您还未选择文件！');
    } else {
      var form = new FormData();
      form.append('upload', file);
      $.post({
        url: `/feedback/report/${mid}`,
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
    }

  });
});




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


function getUserId(callback) {
  var xmlhttp = setXmlHttp();
  RESTful(xmlhttp, "GET", creatURL([current_url_valid, 'userid']), null, true, function () {
    if (xmlhttp.readyState == 4) {
      if (xmlhttp.status == 200) {
        // alert(xmlhttp.responseText);
        userid = JSON.parse(xmlhttp.responseText).result.userid;
        // alert(tasklist);
        // setTaskList(tasklist);
        if (callback) {
          callback();
        }
      } else {
        console.log("发生错误" + xmlhttp.status);
      }
    }
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


function openJudge() {
  if ($('#judgement-text-form').hasClass('hidden')) {
    //打开评价窗口
    $('#judgement-text-form').removeClass('hidden');
    $('#judgement-text-form').addClass('shown');
    $('#judgement-text-form').css('display', 'block');
    $('#show-judgement').text('收起评价');
  } else if ($('#judgement-text-form').hasClass('shown')) {
    //关闭评价窗口
    $('#judgement-text-form').removeClass('shown');
    $('#judgement-text-form').addClass('hidden');
    $('#judgement-text-form').css('display', 'none');
    $('#show-judgement').text('显示评价');
  }
}

function getClassname() {
  classname = '没写好'
  setClassName();
}

$(function parpare() {
  classindex = window.location.pathname.substring;
  getUserName();
  getClassname();
  getJudge();
})



function getJudge(callback) {
  var xmlhttp = setXmlHttp();
  //此处学号随意输入，后台处理
  RESTful(xmlhttp, "GET", creatURL([current_url_valid, 'U201700000', 'judgement']), null, true, function () {
    // alert(userid);
    if (xmlhttp.readyState == 4) {
      if (xmlhttp.status == 200) {
        var info = JSON.parse(xmlhttp.responseText).result.info;
        score = info.score;
        judgetext = info.text;
        setResult();
        if (callback) {
          callback();
        }
      } else {
        console.log("发生错误" + xmlhttp.status);
      }
    }
  });
}

function setClassName() {
  if (classname) {
    $('#result-table tbody .classname').text(classname);
  }
}

function setUserName() {
  if (username) {
    $('#result-table tbody .username').text(username);
  }
}

function setResult() {
  if (score) {
    $('#result-table tbody .score').text(score);
  }
  if (judgetext) {
    $('textarea#judgement-text').text(judgetext);
  }
}