'use strict'

let studentList;
let courseid;
let courselist;
let classname;
let username;

$(document).ready(function () {

  window.onbeforeunload = function (e) {
    var e = window.event || e;
    e.returnValue = ("确定离开当前页面吗？");
  }

  getCourseid();
  getCourseList();
  getUserName();
  sideBarInit();
  $.get({
    url: `/feedback/${courseid}/list`,
  }).done(result => {
    studentList = result;
    for (let n = 0; n < studentList.length; n++) {
      let html = '';
      html += '<div class="list-group-item">'
      html += '<div class="row">'
      html += '<div class="col-4">'
      html += '<p style="color: black; padding-bottom: 16px;">学号: ' + studentList[n].id + '  姓名: ' + studentList[n].name + '</p>'
      html += '</div>'
      html += '<div class="col-8">'
      html += '<div class=" btn-group pull-right">'
      html += '<button type="button" class="my-many-download-button btn btn-primary" sname=' + studentList[n].name + ' id="many-download" sid=' + studentList[n].id + '>批量下载该生所有报告</button>'
      html += '<button type="button" class="my-upload-button btn btn-primary" id="submit">提交</button>'
      html += '</div>'
      html += '</div>'
      html += '</div>'
      html += '<div class="row">'
      html += '<div class="col-12">'
      html += '<div class="student-list-body list-group" nid="' + n + '">';
      html += '</div> </div> </div> </div> <br>';
      console.log(studentList[n].id);
      $('.student-list').append(html);

      getReportList(n);
    };
  });
})
  .on('click', '#submit', function () {
    $('.report-list-body').each(function () {
      let studentID = $(this).attr('sid');
      let fid = $(this).attr('fid');
      var score = $(this).find('#inputScore').val();
      var text = $(this).find('#inputText').val();
      // 参数检查
      if (score == '') {
        alert('分数不能为空！');
      } else if (!/^0$|^[1-9][0-9]{0,1}$|^100$/.test(score)) { // 是否0-100
        alert('分数应为0-100间的整数！')
      } else {
        let url = `/feedback/${courseid}/${studentID}/${fid}/judgement`
        score = parseInt(score);
        $.ajax({
          type: "post",
          url: url,
          contentType: 'application/json',
          data: JSON.stringify({ score: score, text: text }),
          success: () => {
            //location.reload();
            console.log('done');
          },
          error: xhr => {
            alert(JSON.parse(xhr.responseText).msg);
            // location.reload();
          }
        })
      }
    })
  })
  .on('click', '.my-download-button', function () {
    let file_id = $(this).attr('fid')
    let url = 'http://' + window.location.host + '/file/' + file_id

    let $form = $('<form method="GET"></form>');
    $form.attr('action', url);
    $form.appendTo($('body'));
    $form.submit();
  })
  .on('click', '.my-many-download-button', function () {
    let student_name = $(this).attr('sname')
    let studentID = $(this).attr('sid');
    $.get({
      url: `/feedback/${courseid}/${studentID}/report`,
    }).done((reportList) => {

      let fileList = []

      reportList.data.forEach(report => {
        fileList.push(report.file_id);
      })

      let filesPackage = {
        fileName: classname + ' ' + student_name + ' 报告合集',
        fileList: fileList
      }

      let url = 'http://' + window.location.host + '/file?' + $.param(filesPackage);
      window.open(url);

    })
  })
  .on('click', '.my-all-download-button', function () {
    $.get({
      url: `/feedback/${courseid}/null/modulereport`,
    }).done((reportList) => {

      let fileList = []

      reportList.data.forEach(report => {
        report.report.forEach(file => {
          fileList.push(file.file_id);
        })
      })

      let filesPackage = {
        fileName: classname + ' 报告合集',
        fileList: fileList
      }

      let url = 'http://' + window.location.host + '/file?' + $.param(filesPackage);
      window.open(url);
    })

  })

async function getReportList(nid) {
  let studentID = studentList[nid].id;
  $.get({
    url: `/feedback/${courseid}/${studentID}/report`,
  }).done((reportList) => {
    reportList.data.sort(function (a, b) { return a.file_name - b.file_name });
    reportList.data.forEach(report => {
      $.get({
        url: `/feedback/${courseid}/${studentID}/${report.file_id}/judgement`,
      }).done(result => {
        let html = '';
        html += '<div class="report-list-body list-group-item" sid=' + studentID + ' fid=' + report.file_id + '>'
        html += '<div class="row">'
        html += '<div class="col-4">'
        html += '<label style="color:black; font-size:14px;">报告名称: ' + report.file_name + '</label>'
        html += '</div>'
        html += '<div class="col-8">'
        html += '<div class="btn-group pull-right">'
        html += '<button type="button" class="my-download-button btn btn-primary" fid=' + report.file_id + '>下载报告</button>'
        html += '</div>'
        html += '</div>'
        html += '</div>'
        html += '<div class="row">'
        html += '<div class="form-group col-4">'
        html += '<label style="color:black; font-size:14px;">分数</label>'
        html += '<input class="form-control" type="number" style="background-color: white; border:#ced4da solid 1px; color:black"'
        html += 'id="inputScore" placeholder="请输入0-100的数字" value="">'
        html += '</div> '
        html += '<div class="form-group col-8">'
        html += '<label style="color:black; font-size:14px;">评价</label>'
        html += '<textarea class="form-control" rows="1" style="background-color: white; border:#ced4da solid 1px; color:black;"'
        html += 'id="inputText"></textarea>'
        html += '</div> </div> </div>'
        $(`.student-list-body[nid=${nid}]`)
          .append(html)
        $(`.report-list-body[fid=${report.file_id}]`)
          .find('#inputScore').val(result.result.info.score);
        $(`.report-list-body[fid=${report.file_id}]`)
          .find('#inputText').val(result.result.info.text);
      })
    });
  })
}

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
    setClassName();
  });
}

function setClassName() {
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
