'use strict'

let coursewareFileList;
let courselist;
let courseNum = new Set();
let courseid;
let classname;
let username;

$(document).ready(function () {
  let localURLArgs = location.href.split('/');
  courseid = localURLArgs[localURLArgs.length - 1];

  $('#class-to-exam').attr('href', `/exam/${courseid}`);
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
    let file_id = $this.attr('fid');

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
      $(`.my-download-button[fid='${file_id}']`).attr('disabled', 'disabled');
      $('#course-select').trigger('change');
    }).fail(function () {
      $this.text("删除失败，请重试。");
    })
  })
  .on('click', '.my-download-button', async function () {
    let file_id = $(this).attr('fid');
    let url = 'http://' + window.location.host + '/file/' + file_id;

    let $form = $('<form method="GET"></form>');
    $form.attr('action', url);
    $form.appendTo($('body'));
    $form.submit();
  })
  .on('click', '.my-upload-button', async function () {
    if ($('#course-select').val() != '请选择课程') {
      let cid = courseid;
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
    }
  })

async function render(coursewareFileList, courseName) {
  let html = "";
  $('#courseware-list').empty();
  for (let n = 0, dLen = coursewareFileList.length; n < dLen; n++) {
    html += '<li class="list-group-item" >'
      + "  课程名称: " + courseName + " 课件名称: " + coursewareFileList[n].file_name
      + '<div class="btn-group pull-right">'
    html += `<button type="button" class="my-delete-button btn btn-primary btn-warning" fid='${coursewareFileList[n].file_id}'>删除</button>`
      + `<button type="button" class="my-download-button btn btn-primary" fid='${coursewareFileList[n].file_id}'>下载</button>`
      + '</div > </li>';
  }
  $('#courseware-list').append(html);
}

function Logout() {
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
      if (coursewareFileList.length) {
        render(coursewareFileList, classname);
      }
    }
  });
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