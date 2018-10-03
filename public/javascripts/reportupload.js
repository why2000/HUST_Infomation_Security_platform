let current_url_valid = window.location.protocol + window.location.pathname;
let userid;
let username;
let score;
let judgetext;
let courseid;
let classname;
let courseList;

$(document).ready(async function () {
  getCourseid();
  getClassname();
  getUserName();
  sideBarInit();
  getCourseList();
  getUserId();


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
    let fileid = $(this).attr('fid');
    let url = 'http://' + window.location.host + '/file/' + fileid;

    let $form = $('<form method="GET"></form>');
    $form.attr('action', url);
    $form.appendTo($('body'));
    $form.submit();
  })
  .on('click', '.btn-warning', async function () {
    $(this).removeClass("btn-warning");
    $(this).addClass("btn-danger");
    $(this).text("确认");
  })
  .on('mouseleave', '.btn-danger', async function () {
    $(this).removeClass("btn-danger");
    $(this).addClass("btn-warning");
    $(this).text("删除");
  })
  .on('click', '.btn-danger', async function () {
    let $this = $(this);
    let fileid = $this.attr('fid');

    $.ajax({
      url: `/feedback/${courseid}/${userid}/${fileid}/report`,
      type: 'DELETE',
      data: {}
    }).done(function () {
      $this.removeClass("btn-primary");
      $this.removeClass("btn-danger");
      $this.addClass("btn-success");
      $this.text("成功");
      $this.attr('disabled', 'disabled');
      $(`.my-download-button[fid='${fileid}']`).attr('disabled', 'disabled');
      getReportList();
    }).fail(function () {
      $this.text("失败");
    })
  }).on('click', '.my-view-button', function () {
    let $this = $(this);
    $('#judge-dialog').append(`<p>${$this.attr('jtext')}</p>`);
    $('#judge-dialog').dialog({
      model: true
    })
  })

function Logout() {
  $.get({
    url: '/tutorial/logout'
  }).done(function () {
    alert("退出成功！");
    window.location.href = '/';
  })
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

function getUserId() {
  $.get({
    url: 'userid'
  }).done(result => {
    userid = result.result.userid;
    getReportList();
  })
}

function getReportList() {
  $.get({
    url: `/feedback/${courseid}/${userid}/report`,
  }).done(reportList => {
    $.get({
      url: `/feedback/${courseid}/${userid}/judgement`,
    }).done(judgementList => {
      let html = '';
      reportList.data.forEach(data => {
        html += '<tr class="report-row">'
          + `<td class="coursename">${classname}</td>`
          + `<td class="filename" > ${data.file_name}</td >`
        let reportInjudgementList = judgementList.data.find(e => {
          return e.file_id == data.file_id;
        })
        if (reportInjudgementList) {
          html += `<td class="score">${reportInjudgementList.score}</td>`
            + '<td class="panel">'
            + '<div class="btn-group pull-right">'
            + `<button type="button" class="my-delete-button btn btn-primary btn-warning" fid='${data.file_id}'>删除</button>`
            + `<button type="button" class="my-download-button btn btn-primary" fid='${data.file_id}'>下载</button>`
            + `<button type="button" class="my-view-button btn btn-primary" jtext='${reportInjudgementList.text}'>查看评价</button>`
            + '</div></td></tr >';
        } else {
          html += '<td class="score">未评分</td>'
            + '<td class="panel">'
            + '<div class="btn-group pull-right">'
            + `<button type="button" class="my-delete-button btn btn-primary btn-warning" fid='${data.file_id}'>删除</button>`
            + `<button type="button" class="my-download-button btn btn-primary" fid='${data.file_id}'>下载</button>`
            + '<button type="button" class="btn btn-disable" disabled="disabled">未评价</button>'
            + '</div></td></tr >';
        }
      })
      $('#report-tablet').empty().append(html);
    })
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

      $('#course-list').append(`<li><a href="/tutorial/${courselist[i]._id}"><i class="fa fa-dot-circle-o fa-lg"></i><span class="nav-text-small">${courselist[i].name}</span></a></li>`);
    };
  });
}

function getCourseid() {
  let localURLArgs = location.href.split('/');
  courseid = localURLArgs[localURLArgs.length - 3];
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