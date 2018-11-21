'use strict'

let courseid;
let username;
let courselist;
let examlist;
let classname;
let examid;
let countIT;

$(document).ready(function () {
  courseid = window.location.href.substring(window.location.href.lastIndexOf('#') + 1, window.location.href.length);
  $('#class-to-exam').attr('href', `/exam/index#${courseid}`);
  $('#class-to-feedback').attr('href', `/feedback/index#${courseid}`);
  $('#class-to-courseware').attr('href', `/courseware/course/${courseid}`);
  $('#class-home-page').attr('href', `/tutorial/index#${courseid}`);
  $('#class-to-video').attr('href', `/tutorial/video#${courseid}`);
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
  getExamList();
  getUserName();
})
  .on('click', '#start-btn.btn-exam-check', function () {
    $(this).removeClass('btn-exam-check');
    $(this).removeClass('btn-primary');
    $(this).addClass('btn-exam-ready');
    $(this).addClass('btn-warning');
    $(this).text('确认开始？');
  })
  .on('mouseleave', '#start-btn.btn-exam-ready', function () {
    $(this).removeClass('btn-exam-ready');
    $(this).removeClass('btn-warning');
    $(this).addClass('btn-exam-check');
    $(this).addClass('btn-primary');
    $(this).text('开始练习');
  })
  .on('click', '#start-btn.btn-exam-ready', function () {
    $(this).removeClass('btn-exam-ready');
    $(this).removeClass('btn-warning');
    $(this).addClass('btn-info');
    $(this).addClass('btn-sub-check');
    getExamContent();
    $(this).text('提交答案');
  })
  .on('click', '#start-btn.btn-sub-check', function () {
    $(this).removeClass('btn-sub-check');
    $(this).removeClass('btn-info');
    $(this).addClass('btn-sub-ready');
    $(this).addClass('btn-warning');
    $(this).text('确认提交？');
  })
  .on('mouseleave', '#start-btn.btn-sub-ready', function () {
    $(this).removeClass('btn-sub-ready');
    $(this).removeClass('btn-warning');
    $(this).addClass('btn-sub-check');
    $(this).addClass('btn-info');
    $(this).text('提交答案');
  })
  .on('click', '#start-btn.btn-sub-ready', function () {
    $(this).attr('disabled', 'disabled');
    $(this).text('提交中...');
    setExamStop();
  })
  .on('click', '.exam-select-item', function () {
    examid = $(this).attr('eid');
    getExamInformation();
  })

function setTimeCount(time) {
  let curr_time = parseInt(Date.parse(new Date()) / 1000);
  let end_time = time + curr_time;

  countIT = setInterval(`timeCountDown(${end_time})`, 1000);
}

function timeCountDown(end_time) {
  let curr_time = parseInt(Date.parse(new Date()) / 1000);
  let diff_time = parseInt(end_time - curr_time);
  if (diff_time >= 0) {
    setTimeLimit(diff_time);
  } else {
    clearInterval(countIT);
    setExamStop();
  }
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

function getExamContent() {
  $.post({
    url: `/exam/${courseid}/${examid}/start`
  }).done(result => {
    let questions = result.data.content;
    let time = result.data.timelimit;
    setExamStart(time, questions);
  })
}

async function setExamStop() {
  clearInterval(countIT);
  let answer = [];
  $('#exam-body').find('.question-options').each(function () {
    if ($(this).attr('qtype') == 'sc') {
      answer.push({
        'id': $(this).attr('qid'),
        'answer': $(this).find(':checked').val() ? $(this).find(':checked').val() : ''
      });
    } else if ($(this).attr('qtype') == 'mc') {
      let mc_answer = [];
      $(this).find(':checked').each(function () {
        mc_answer.push($(this).val());
      })
      answer.push({ 'id': $(this).attr('qid'), 'answer': mc_answer.join(',') });
    } else if ($(this).attr('qtype') == 'fb') {
      answer.push({
        'id': $(this).attr('qid'),
        'answer': $(this).find('.fb-options').val().toString()
      });
    }
  })
  uploadExamAnswer(answer)
}

function uploadExamAnswer(answer) {
  $.post({
    url: `/exam/${courseid}/${examid}/commit`,
    contentType: 'application/json',
    data: JSON.stringify(answer),
  }).done(function (result) {
    let $btn = $('#start-btn.btn-sub-ready');
    $btn.removeClass('btn-sub-ready');
    $btn.removeClass('btn-warning');
    $btn.addClass('btn-exam-check');
    $btn.addClass('btn-primary');
    $btn.removeAttr('disabled');
    $btn.text('开始练习');
    examid = null;
    countIT = null;
    $('#exam-select-card').attr('style', 'display:block;')
    alert('答对题目数:' + result.data.score);
  })
}

async function setExamStart(time, questions) {
  $('#exam-select-card').attr('style', 'display:none;')
  console.log('start render');
  let last_id = 0;
  let html = '';
  html += (`<div class="card"><div class="question card-body" qid="${last_id}">`);
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
                <input type="checkbox" class="mc-options question-options" qtype="mc" qid="${question.id}" value="${option.choice}"> ${option.choice}.${option.text}
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
  setTimeCount(time);
}

function getExamList() {
  $.get({
    url: `/exam/` + courseid
  }).done(result => {
    examlist = result.data;
    let html = '';
    for (let n = 0; n < examlist.length; n++) {
      html += '<li class="list-group-item list-group-item-action exam-select-item" eid="' + examlist[n]._id + '">'
        + "  练习名称: " + examlist[n].title
        + '</li>';
    }
    $('#exam-select').empty().append(html);
  })
}

function getExamInformation() {
  $.get({
    url: `/exam/${courseid}/${examid}`
  }).done(result => {
    $('#exam-name').text(result.data.title);
    $('#exam-description').text(result.data.description);
    $('#start-btn').removeAttr('disabled');
    let time = result.data.timelimit;
    $('#exam-body').empty();
    setTimeLimit(time);
  })

}

function getCourseList() {
  $.get({
    url: '/course',
  }).done(result => {
    courselist = result.data;
    $('#course-list').empty();
    for (let i = 0; i < courselist.length; i++) {
      $('#course-list').append(`< li > <a href="/tutorial/index#${courselist[i]._id}"><i class="fa fa-dot-circle-o fa-lg"></i><span class="nav-text-small">${courselist[i].name}</span></a></li > `);
    };
    let selectedCourse = courselist.filter(e => {
      return e._id == courseid;
    });
    classname = selectedCourse[0].name;
    setCourseName();
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

function setUserName() {
  if (!username) {
    username = "数据获取失败";
  }
  var hello = "欢迎！" + username;
  $(".settings").text(hello);
}

function setCourseName() {
  if (classname) {
    $('#big-title').text('课程练习 当前课程: ' + classname);
  }
}
