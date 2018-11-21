'use strict'

let courseid;
let studentID;
let courselist;
let classname;
let username;
let examlist;

$(document).ready(function () {
  getCourseid();
  getCourseList();
  getUserName();
  sideBarInit();
  getExamList();
  $(this).find('#add-exam-a').attr('href', `/exam/add#${courseid}`);
})
  .on("click", ".exam-select-item", function () {
    $('.exam-select-item').removeClass('list-group-item-success');
    $(this).addClass('list-group-item-success');

    let $this = $(this);

    $.get({
      url: `/exam/${courseid}/${$this.attr('eid')}/score`
    }).done(result => {
      let studentScores = result.data;
      let html = '';
      studentScores.forEach(result => {
        html += '<tr class="report-row">'
          + `<td class="studentName">${result.name}</td>`
          + `<td class="studentID" > ${result.userid}</td >`;
        if (result.has_done) {
          html += `<td class="studentScore" > ${result.score}</td >`;
        } else {
          html += `<td class="studentScore" > 未完成</td >`;
        }
        html += '</tr >';
      })
      $('#exam-result-table').empty().append(html);
    })
  })

function deleteExam(){
  let eid;
  let selected = $('.list-group-item-success');
  if(selected.length == 0){
    alert("请选择要删除的练习！");
    return;
  }
  else{
    eid = selected.attr('eid');
  }
  console.log(eid);
  $.ajax({
    url:`/exam/${courseid}/${eid}`,
    type:'DELETE'
    }).done(result =>{
      if(result.status == 200)
      location.reload();
    })
}

function getExamList() {
  $.get({
    url: `/exam/${courseid}`
  }).done(result => {
    examlist = result.data;
    for (let n = 0; n < examlist.length; n++) {
      $('#exams-select').append('<a class="list-group-item list-group-item-action exam-select-item" eid="' + examlist[n]._id + '">' + '练习名称: ' + examlist[n].title + '</a >')
    };
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