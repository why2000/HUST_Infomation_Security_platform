'use strict'

let courseid;
let courselist;
let username;
let studentlist;
let teacherlist;
let userID;

$(document).ready(function () {
  getUserId();
  //getCourseid();
  getCourseList();
  getUserName();
  sideBarInit();
  setSemester();
})
  .on('click', '.course-select-item', function () {
    $('#course-info-name').text(`${courselist[$(this).attr('nid')].name}`);
    $('#course-info-description').text(`${courselist[$(this).attr('nid')].description}`);
    $('.course-select-item').removeClass('list-group-item-success');
    $(this).addClass('list-group-item-success');
    $('#course-info-div').attr('style', 'display:blcok');
    $('.course-delete-button').attr('cid', courselist[$(this).attr('nid')]._id);
    getMemberList(courselist[$(this).attr('nid')]._id);
    $('.course-add-member-button').removeAttr('disabled');
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
  .on('click', '.teacher-delete-button.btn-warning', function () {
    $(this).addClass('btn-danger');
    $(this).removeClass('btn-warning');
    $(this).text('确认删除?');
  })
  .on('mouseleave', '.teacher-delete-button.btn-danger', function () {
    $(this).addClass('btn-warning');
    $(this).removeClass('btn-danger');
    $(this).text('删除');
  })
  .on('click', '.teacher-delete-button.btn-danger', function () {
    if ($(this).attr('uid') == userID) {
      alert("不能删除自己！")
    }
    else {
      let $this = $(this)
      $(this).attr('disabled', 'disabled');
      $(this).text('删除中...');
      console.log($(this).attr('cid'));
      let select_courseid = $('.course-delete-button').attr('cid');
      $.ajax({
        url: `/course/${select_courseid}/teacher/delete`,
        data: { id: $(this).attr('uid') },
        method: 'POST'
      }).done(function () {
        $this.addClass('btn-success');
        $this.removeClass('btn-danger');
        $this.text('删除成功');
        getMemberList($('.course-delete-button').attr('cid'));
      })
    }
  })
  .on('click', '.student-delete-button.btn-warning', function () {
    $(this).addClass('btn-danger');
    $(this).removeClass('btn-warning');
    $(this).text('确认删除?');
  })
  .on('mouseleave', '.student-delete-button.btn-danger', function () {
    $(this).addClass('btn-warning');
    $(this).removeClass('btn-danger');
    $(this).text('删除');
  })
  .on('click', '.student-delete-button.btn-danger', function () {
    let $this = $(this)
    $(this).attr('disabled', 'disabled');
    $(this).text('删除中...');
    console.log($(this).attr('cid'));
    let select_courseid = $('.course-delete-button').attr('cid');
    $.ajax({
      url: `/course/${select_courseid}/student/delete`,
      data: { id: $(this).attr('uid') },
      method: 'POST'
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
    if (teacherlist && studentlist) {
      if (teacherlist.indexOf(new_member_id) != -1 && studentlist.indexOf(new_member_id) != -1) {
        alert('请勿重复添加同一人');
        return;
      }
    }

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
  .on('click', '#course-member-multi-add-button-confirm', function () {
    let new_members_id = $('#new-members-id').val();
    alert(new_members_id);
    $('#new-members-id').val('');
    let new_members_ids = new_members_id.split(/[ \n\t,]/);
    let new_member_type = 'student';
    new_members_ids.forEach(function(new_member_id){
      // alert(new_member_id);
      if (teacherlist && studentlist) {
        if (teacherlist.indexOf(new_member_id) != -1 && studentlist.indexOf(new_member_id) != -1) {
          alert('请勿重复添加同一人');
          return;
        }
      }

      let type_url = 'student';
      if (new_member_id && new_member_type) {
        let select_courseid = $('.course-delete-button').attr('cid');
        $.post({
          url: `/course/${select_courseid}/${type_url}`,
          data: { id: new_member_id }
        }).done(function () {
          getMemberList($('.course-delete-button').attr('cid'));
        });
      } else {
        alert('添加失败，请检查格式');
        // alert('身份选择、工号不得为空。');
      }
    });
    alert('新成员添加成功!');
  })
  .on('click', '.semester-select-item', function () {
    $.ajax({
      url: `/course/setsemester`,
      data: { newSemester: $(this).attr('mid') },
      method: 'POST'
    }).done(function () {
      setSemester();
      getCourseList();
      alert("学期切换成功");
    })
  })
  .on('click', '#semester-add-button', function () {
    $.get({
      url: `/course/createsemester`
    }).done(function () {
      setSemester();
      getCourseList();
      alert("开始学期成功");
    })
  })

function setSemester() {
  let now_buffer;
  $.get({
    url: '/course/semester'
  }).done(now_semester => {
    now_semester = now_semester.data;
    let char_buffer = "";
    if (now_semester.substring(4, 5) == 'a') {
      char_buffer = "第一学期";
    } else {
      char_buffer = "第二学期";
    }
    now_buffer = `当前学期为 20${now_semester.substring(0, 2)}-20${now_semester.substring(2, 4)} ` + char_buffer;

    $.get({
      url: '/course/allsemester'
    }).done(all_semester => {
      all_semester = all_semester.data;
      let new_semester = all_semester[all_semester.length - 1];
      let char_buffer = "";
      if (new_semester.substring(4, 5) == 'a') {
        char_buffer = "第一学期";
      } else {
        char_buffer = "第二学期";
      }
      $('#now-semester-label').text(now_buffer + ` / 最新学期为 20${new_semester.substring(0, 2)}-20${new_semester.substring(2, 4)} ` + char_buffer)
      $('#semester-select').empty();
      all_semester.forEach(semester => {
        let char_buffer = "";
        if (semester.substring(4, 5) == 'a') {
          char_buffer = "第一学期";
        } else {
          char_buffer = "第二学期";
        }
        $('#semester-select').append(`<a class="list-group-item list-group-item-action semester-select-item" mid="${semester}">20${semester.substring(0, 2)}-20${semester.substring(2, 4)} ${char_buffer}</a>`)
      })

    })
  })
}

function getCourseid() {
  courseid = window.location.href.substring(window.location.href.lastIndexOf('#') + 1, window.location.href.length);
}

function sideBarInit() {
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
  let oritype = 'student';
  if (type === '管理员') {
    oritype = 'teacher'
  }
  html += `<td class="member-row-name">${name}</td>`
  html += `<td class="member-row-id">${user}</td>`
  html += `<td class="member-row-type">${type}</td>`
  html += `<td><button type="button" class="${oritype}-delete-button btn btn-warning" uid='${user}'>删除</button></td>`

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