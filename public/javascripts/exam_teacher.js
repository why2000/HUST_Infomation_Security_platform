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
.on('click', ".exam-preview-item", function(){
  $.post({
    url: `/exam/${courseid}/${$(this).parent().attr('eid')}/start`
  }).done(result => {
    let questions = result.data.content;
    let time = result.data.timelimit;
    setExamPreview(time, questions);
  });
})
.on('mouseover', '.exam-preview-item', function(){
  $('.exam-select-item').attr('disabled', 'disabled');
})
.on('mouseleave', '.exam-preview-item', function(){
  $('.exam-select-item').removeAttr('disabled');
})


async function setExamPreview(time, questions) {
  $('#exam-select-card').attr('style', 'display:none;')
  console.log('start render');
  let last_id = 0;
  let html = '';
  html += (`<div class="card"><div class="card-body"><div class="card"><h5 style="font-size:16px">时间限制:</h5>
  <P type='number' id="exam-time" style="font-size:20px"></P></div><div class="question card-body" qid="${last_id}">`);
  html += (`<p><span style="font-weight:bold;">第${last_id + 1}题  </span>`);
  questions.forEach(question => {
    if (question.id != last_id) {
      last_id = question.id;
      html += ('</div></div><br>');
      html += (`<div class="card"><div class="question card-body" qid="${question.id}">`);
      html += (`<p><span style="font-weight:bold;">第${question.id + 1}题  </span>`);
    }
    if (question.type == "text") {
      html += (`${question.text}</p>`);
    } else if (question.type == 'img') {
      $(`#exam-body`).append(`<img src="${question.src}" class="img-rounded">`);
    } else if (question.type == 'sc') {
      html += "<label>(单选题)</label>";
      html += `${question.text}</p>`;
      html += `<div class="radio question-options" qtype="sc" qid="${question.id}">`;
      question.options.forEach(
        option => {
          html += (
            `  <label>
                <input type="radio" name="optionsRadios-${question.id}" qid="${question.id}" value="${option.choice}"> ${option.choice}.${option.text}
              </label>`
          )
        })
      html += '</div>';
    } else if (question.type == 'mc') {
      html += "<label>(多选题)</label>";
      html += `${question.text}</p>`;
      html += `<div class="checkbox question-options" qtype="mc" qid="${question.id}">`;
      question.options.forEach(
        option => {
          html += (
            `<label>
                <input type="checkbox" class="mc-options" class="question-options" qtype="mc" qid="${question.id}" value="${option.choice}"> ${option.choice}.${option.text}
              </label>`
          )
        })
      html += '</div>';
    } else if (question.type == 'fb') {
      html += "<label>(填空题)</label>";
      html += `${question.text}</p>`;
      html += `<div class="text question-options" qtype="fb" qid="${question.id}">`;
      html += (
        `<label>
          <input type="text" class="fb-options" class="question-options" qid="${question.id} "style="border: 0;border-bottom:1px solid #666666; outline: none;">
          </label>`
      )
      html += '</div>';
    }
  });
  html += ('</div></div>');
  $('#exam-body').empty().append(html);
  setTimeLimit(time);
}

function setTimeLimit(time) {
  let hours = 0,
    minutes = 0,
    seconds = time;
  if (seconds >= 60) {//如果秒数大于60，将秒数转换成整数
    //获取分钟，除以60取整数，得到整数分钟
    minutes = parseInt(seconds / 60);
    //获取秒数，秒数取佘，得到整数秒数
    seconds = parseInt(seconds % 60);
    //如果分钟大于60，将分钟转换成小时
    if (minutes >= 60) {
      //获取小时，获取分钟除以60，得到整数小时
      hours = parseInt(minutes / 60);
      //获取小时后取佘的分，获取分钟除以60取佘的分
      minutes = parseInt(minutes % 60);
    }
  }
  if (hours < 10) hours = `0${hours}`;
  if (minutes < 10) minutes = `0${minutes}`;
  if (seconds < 10) seconds = `0${seconds}`;



  $('#exam-time').text(`${hours}:${minutes}:${seconds}`);
}



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
      $('#exams-select').append('<a class="list-group-item list-group-item-action exam-select-item" eid="' + examlist[n]._id + '">' + '练习名称: ' + examlist[n].title + `<button type="button" class="badge exam-preview-item" mid="${examlist[n].title}" style="float: right">查看</button></a >`)
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