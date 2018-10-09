'use strict'

let courseid;
let courselist;
let username;
let studentlist;
let teacherlist;
let userID;

$(document).ready(function () {
  getUserId();
  getCourseid();
  getCourseList();
  getUserName();
  sideBarInit();
})
  .on('click', '.course-select-item', function () {
    $('#course-info-name').text(`${courselist[$(this).attr('nid')].name}`);
    $('#course-info-description').text(`${courselist[$(this).attr('nid')].description}`);
    $('.course-select-item').removeClass('list-group-item-success');
    $(this).addClass('list-group-item-success');
    $('#course-info-div').attr('style', 'display:blcok');
    $('.course-delete-button').attr('cid', courselist[$(this).attr('nid')]._id);
    getMemberList(courselist[$(this).attr('nid')]._id);
  })
  .on('click', '.course-delete-button.btn-warning', function () {
    $(this).addClass('btn-danger');
    $(this).removeClass('btn-warning');
    $(this).text('确认删除?');
  })
  .on('mouseleave', '.course-delete-button.btn-danger', function () {
    $(this).addClass('btn-warning');
    $(this).removeClass('btn-danger');
    $(this).text('删除');
  })
  .on('click', '.course-delete-button.btn-danger', function () {
    let $this = $(this);
    $(this).attr('disabled', 'disabled');
    $(this).text('删除中...');
    console.log($(this).attr('cid'));
    $.ajax({
      url: `/course/${$(this).attr('cid')}`,
      method: 'DELETE'
    }).done(function () {
      $this.addClass('btn-success');
      $this.removeClass('btn-danger');
      $this.text('删除成功');
      setTimeout(function () {
        window.location.reload();
      }, 500)
    })
  })
  .on('click', '.member-delete-button.btn-warning', function () {
    $(this).addClass('btn-danger');
    $(this).removeClass('btn-warning');
    $(this).text('确认删除?');
  })
  .on('mouseleave', '.member-delete-button.btn-danger', function () {
    $(this).addClass('btn-warning');
    $(this).removeClass('btn-danger');
    $(this).text('删除');
  })
  .on('click', '.member-delete-button.btn-danger', function () {
    let $this = $(this)
    $(this).attr('disabled', 'disabled');
    $(this).text('删除中...');
    $.ajax({
      url: `/course/${$(this).attr('uid')}/member`,
      method: 'DELETE'
    }).done(function () {
      $this.addClass('btn-success');
      $this.removeClass('btn-danger');
      $this.text('删除成功');
      getMemberList($('.course-delete-button').attr('cid'));
    })
  })
  .on('click', '#course-add-button-confirm', function () {
    let new_course_name = $('#new-course-name').val();
    $('#new-course-name').val('');
    let new_course_description = $('#new-course-description').val();
    $('#new-course-description').val('');

    let course_creater = [userID];
    if (new_course_description && new_course_name) {
      $.post({
        url: `/course/`,
        contentType: 'application/json',
        data: JSON.stringify({ name: new_course_name, description: new_course_description, teacher: course_creater })
      }).done(function () {
        alert('课程添加成功!');
        getCourseList();
        $('#course-add-modal').modal('hide');

      })
    } else {
      alert('课程名称、课程简介不得为空。');
    }
  })
  .on('click', '#course-member-add-button-confirm', function () {
    let new_member_id = $('#new-member-id').val();
    $('#new-member-id').val('');
    let new_member_type = $('#member-type-select').find(':checked').val();

    let type_url = '';
    if (new_member_id && new_member_type) {
      switch (new_member_type) {
        case 'admin':
          type_url = 'teacher';
          break;
        case 'student':
          type_url = 'student';
          break;
      }

      let select_courseid = $('.course-delete-button').attr('cid');
      $.post({
        url: `/course/${select_courseid}/${type_url}`,
        data: { id: new_member_id }
      }).done(function () {
        alert('新成员添加成功!');
        getMemberList($('.course-delete-button').attr('cid'));
      })
    } else {
      alert('身份选择、工号不得为空。');
    }
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

function getMemberList(select_courseid) {
  $('#course-member-table').empty();
  $.get({
    url: `/course/${select_courseid}/student`
  }).done(result => {
    studentlist = result.data;
    if (studentlist.length) {
      getMemberListUnit(studentlist, '学生');
    }
  })
  $.get({
    url: `/course/${select_courseid}/teacher`
  }).done(result => {
    teacherlist = result.data;
    if (teacherlist.length) {
      getMemberListUnit(teacherlist, '管理员');
    }
  })

}

function getMemberListUnit(userlist, type) {
  $('#course-member-table').empty()
  userlist.forEach(user => {
    $.get({
      url: `/user/username/${user}`
    }).done(result => {
      appendMemberList(result.result.username, user, type);
    })
      .fail(result => {
        //console.log(result);
        appendMemberList('未设置姓名', user, type)
      })
  })
}

function appendMemberList(name, user, type) {
  let html = '<tr class="member-row">';

  html += `<td class="member-row-name">${name}</td>`
  html += `<td class="member-row-id">${user}</td>`
  html += `<td class="member-row-type">${type}</td>`
  // todo add teacher/student delete from a course
  //html += `<button type="button" class="member-delete-button btn btn-warning" uid='${user}'>删除此成员</button></tr>`
  $('#course-member-table').append(html);
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
    userID = result.result.userid;
  })
}

function getCourseList() {
  $.get({
    url: '/course',
  }).done(result => {
    courselist = result.data;
    $('#course-list').empty();
    $('#course-select').empty();
    for (let i = 0; i < courselist.length; i++) {
      $('#course-list').append(`<li><a href="/tutorial/index#${courselist[i]._id}"><i class="fa fa-dot-circle-o fa-lg"></i><span class="nav-text-small">${courselist[i].name}</span></a></li>`);
      $('#course-select').append(`<a class="list-group-item list-group-item-action course-select-item" nid="${i}">课程名称:${courselist[i].name}</a>`)
    };
  });
}

function setUserName() {
  if (username) {
    $('#result-table tbody .username').text(username);
    var hello = "欢迎！" + username;
    $(".settings").text(hello);
  }
}