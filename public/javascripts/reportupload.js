let current_url_valid = window.location.protocol + window.location.pathname;
let userid;
let username;
let score;
let judgetext;
let courseid;
let classname;
let courseList;
let fileid;

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
  getCourseid();
  getUserId();
  getUserName();
  getClassname();
  sideBarInit();


  $('.my-upload-button').click(function () {
    var file = $('#upload')[0].files[0];
    if (!file) {
      alert('您还未选择文件！');
    } else {
      const acceptFile = /^.*(\.doc|\.docx|\.txt|\.pdf)$/;
      if (acceptFile.test(file.name)) {
        var form = new FormData();
        form.append('upload', file);
        $.ajax({
          type: 'post',
          url: `/feedback/${courseid}/report/`,
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
  });
})
  .on('click', '.my-download-button', async () => {
    let url = 'http://' + window.location.host + '/file/' + fileid;

    let $form = $('<form method="GET"></form>');
    $form.attr('action', url);
    $form.appendTo($('body'));
    $form.submit();
  })

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
    console.log(current_list);
    if (current_list != null && current_list != undefined) {
      console.log(eval(current_list))
      height = eval(current_list).length * 41;
    } else {
      height = 0;
    }
    $(this).find('.submenu').stop().css("height", `${height}px`).slideDown(300);
    $(this).find(".mlist-icon").addClass("fa-rotate-90").css("width", "30px").css("transform", "translateY(-12px) rotate(90deg)");
  }, function () {
    $(this).find(".submenu").stop().slideUp(300);
    $(this).find(".mlist-icon").removeClass("fa-rotate-90").css("width", "55px").css("height", "36px").css("transform", "");
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
}

function getUserId(callback) {
  $.get({
    url: 'userid'
  }).done(result => {
    userid = result.result.userid;
    $.get({
      url: `/feedback/${courseid}/${userid}/report`,
    }).done(data => {
      fileid = data.data.file_id;
      $('#result-table tbody .uploaded').text('已上传');
      $('#control-button-group').append('<button type="button" class="my-download-button btn btn-primary">下载</button>');
      getJudge();
    })
  })
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
  $.get({
    url: '/course',
  }).done(result => {
    courseList = result.data;
    let selectedCourse = courseList.filter(e => {
      return e._id == courseid;
    });
    classname = selectedCourse[0].name;
    setClassName();
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
    console.log(courselist);
    for (var i = 0; i < length; i++) {

      $('#course-list').append(`<li><a href="/tutorial/${courselist[i]._id}"><i class="fa fa-dot-circle-o fa-lg"></i><span class="nav-text-small">${courselist[i].name}</span></a></li>`);
    };
  });
}

function getCourseid() {
  let localURLArgs = location.href.split('/');
  courseid = localURLArgs[localURLArgs.length - 3];
}

function getJudge() {
  $.get({
    url: `judgement/${courseid}/${userid}/${fileid}/judgement`
  }).done(result => {
    score = result.score;
    judgetext = result.text;
    console.log(judgetext);
    setResult();
  })
}

function setClassName() {
  if (classname) {
    $('#big-title').text('上传报告 当前课程: ' + classname);
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

function setResult() {
  if (score) {
    $('#result-table tbody .score').text(score);
  }
  if (judgetext) {
    $('#judgement-text').text(judgetext);
  }
}