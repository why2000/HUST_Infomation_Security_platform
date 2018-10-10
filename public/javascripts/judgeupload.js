'use strict'

let studentList;
let courseid;
let studentID;
let courselist;
let classname;
let username;

$(document).ready(function () {
  $('#inputScore').val('');
  $('#inputText').val('');
  getCourseid();
  getCourseList();
  getUserName();
  sideBarInit();
  $.get({
    url: `/feedback/${courseid}/list`,
  }).done(result => {
    studentList = result;
    for (let n = 0; n < studentList.length; n++) {
      if (studentList[n].file_id != undefined && studentList[n].file_id == false) {
        $('#student-select').append('<a class="list-group-item list-group-item-action student-select-item" nid="' + n + '">' + ' 学号: ' + studentList[n].id + ' 名称: ' + studentList[n].name + '<span style="float:right;" class="badge badge-danger badge-pill">[未上传]</span></a > ')
      } else {
        $('#student-select').append('<a class="list-group-item list-group-item-action student-select-item" nid="' + n + '">' + ' 学号: ' + studentList[n].id + ' 名称: ' + studentList[n].name + '<span style="float:right;" class="badge badge-success badge-pill">[已上传]</span></a > ')
      }
    };
  });
})
  .on('click', '#submit', function () {
    var score = $('#inputScore').val();
    var text = $('#inputText').val();
    // 参数检查
    if (score == '') {
      alert('分数不能为空！');
    } else if (!/^0$|^[1-9][0-9]{0,1}$|^100$/.test(score)) { // 是否0-100
      alert('分数应为0-100间的整数！')
    } else {
      let url = `/feedback/${courseid}/${studentID}/${$('.report-select-item.list-group-item-success').attr('fid')}/judgement`
      score = parseInt(score);
      $.ajax({
        type: "post",
        url: url,
        contentType: 'application/json',
        data: JSON.stringify({ score: score, text: text }),
        success: () => {
          alert('上传成功！');
          location.reload();
        },
        error: xhr => {
          alert(JSON.parse(xhr.responseText).msg);
          // location.reload();
        }
      })
    }
  })
  .on('click', '.my-download-button', function () {
    let file_id = $('.report-select-item.list-group-item-success').attr('fid')
    let url = 'http://' + window.location.host + '/file/' + file_id

    let $form = $('<form method="GET"></form>');
    $form.attr('action', url);
    $form.appendTo($('body'));
    $form.submit();
  })
  .on("click", ".student-select-item", function () {
    $('#inputScore').val('');
    $('#inputText').val('');
    $('.student-select-item').removeClass('list-group-item-success');
    $(this).addClass('list-group-item-success');
    $('#report-select').empty();
    let $this = $(this);
    let nid = $this.attr('nid');
    studentID = studentList[nid].id;
    $.get({
      url: `/feedback/${courseid}/${studentID}/report`,
    }).done((reportList) => {
      $.get({
        url: `/feedback/${courseid}/${studentID}/judgement`,
      }).done(judgementList => {
        for (let n = 0; n < reportList.data.length; n++) {
          let reportInjudgementList = judgementList.data.find(e => {
            return e.file_id == reportList.data[n].file_id;
          })
          if (reportInjudgementList) {
            $('#report-select').append('<a class="list-group-item list-group-item-action report-select-item" fid="' + reportList.data[n].file_id + '">' + '报告名称' + reportList.data[n].file_name + '<span style="float:right;" class="badge badge-success badge-pill">[已评价]</span></a > ');
          } else {
            $('#report-select').append('<a class="list-group-item list-group-item-action report-select-item" fid="' + reportList.data[n].file_id + '">' + '报告名称' + reportList.data[n].file_name + '<span style="float:right;" class="badge badge-danger badge-pill">[未评价]</span></a > ');
          }
        }
      })
    })
  })
  .on('click', '.report-select-item', function () {
    $('#inputScore').val('');
    $('#inputText').val('');
    $('.report-select-item').removeClass('list-group-item-success');
    $(this).addClass('list-group-item-success');
    $('.my-download-button').removeAttr('disabled');
    let fileID = $(this).attr('fid');
    $.get({
      url: `/feedback/${courseid}/${studentID}/${fileID}/judgement`,
    }).done(result => {
      $('#inputScore').val(result.result.info.score);
      $('#inputText').val(result.result.info.text);
    })
  })

function getCourseid() {
  courseid = window.location.href.substring(window.location.href.lastIndexOf('#') + 1, window.location.href.length);
}

function sideBarInit() {
  $('#class-to-exam').attr('href', `/exam/index#${courseid}`);
  $('#class-to-feedback').attr('href', `/feedback/index#${courseid}`);
  $('#class-to-courseware').attr('href', `/courseware/course/${courseid}`);
  $('#class-to-video').attr('href', `/tutorial/video#${courseid}`);
  $('#class-home-page').attr('href', `/tutorial/index#${courseid}`);
  $('#class-to-logout').attr('href', `/login/logout`);

  $(".has-submenu").hover(function () {
    var height;
    var current_list = $(this).find('.submenu').attr("id");
    console.log(current_list);
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
}

function logout() {
  $.get({
    url: '/login/logout'
  }).done(function () {
    alert("退出成功！");
    window.location.href = '/';
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

function getUserId() {
  $.get({
    url: '/user/userid'
  }).done(result => {
    userid = result.result.userid;
    getReportList();
  })
}

function getCourseList() {
  $.get({
    url: '/course',
  }).done(result => {
    courselist = result.data;
    $('#course-list').empty();
    for (let i = 0; i < courselist.length; i++) {
      $('#course-list').append(`<li><a href="/tutorial/index#${courselist[i]._id}"><i class="fa fa-dot-circle-o fa-lg"></i><span class="nav-text-small">${courselist[i].name}</span></a></li>`);
    };
    let selectedCourse = courselist.filter(e => {
      return e._id == courseid;
    });
    classname = selectedCourse[0].name;
    console.log(classname);
    setClassName();
  });
}

function setClassName () {
  if (classname) {
    $('#big-title').text('教师评分 当前课程: ' + classname);
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