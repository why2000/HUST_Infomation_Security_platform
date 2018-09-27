'use strict'

let courseList;
let studentList;
let courseID;
let studentID;

$(document)
  .ready(function () {
    $('#inputScore').val('');
    $('#inputText').val('');
    $.get({
      url: '/course',
    }).done(result => {
      courseList = result.data;
      for (let n = 0; n < courseList.length; n++) {
        $('#course-select').append('<option nid="' + n + '">课程名称: ' + courseList[n].name + '</option>')
      };
    });
  })
  .on("change", '#course-select', function () {
    let $this = $(this);
    $('#student-select').empty();
    $('#inputScore').val('');
    $('#inputText').val('');
    if ($this.val() != '请选择课程') {
      let nid = $this.find("option:selected").attr('nid');
      let selectedCorse = courseList[nid];
      courseID = selectedCorse._id;
      $.get({
        url: `/feedback/${courseID}/list`,
      }).done(result => {
        studentList = result;
        for (let n = 0; n < studentList.length; n++) {
          if (studentList[n].file_id) {
            $('#student-select').append('<a class="list-group-item list-group-item-action student-select-item" nid="' + n + '">' + ' 学号: ' + studentList[n].id + ' 学生名称: ' + studentList[n].name + '<span style="float:right;" class="badge badge-success badge-pill">[已上传报告]</span></a > ')
          } else {
            $('#student-select').append('<a class="list-group-item list-group-item-action student-select-item" nid="' + n + '">' + ' 学号: ' + studentList[n].id + ' 学生名称: ' + studentList[n].name + '<span style="float:right;" class="badge badge-danger badge-pill">[未上传报告]</span></a > ')
          }
        };
      });
    }
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
      let url = `/feedback/${courseID}/${studentID}/judgement`
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
    let nid = $('.list-group-item-success').attr('nid');
    let selectedStudent = studentList[nid];
    let url = 'http://' + window.location.host + '/file/' + selectedStudent.file_id;

    let $form = $('<form method="GET"></form>');
    $form.attr('action', url);
    $form.appendTo($('body'));
    $form.submit();
  })
  .on("click", ".student-select-item", function () {
    console.log('item');
    $('.student-select-item').removeClass('list-group-item-success');
    $(this).addClass('list-group-item-success');

    let $this = $(this);
    $('#inputScore').val('');
    $('#inputText').val('');
    let nid = $this.attr('nid');
    studentID = studentList[nid].id;
    $.get({
      url: `/feedback/${courseID}/${studentID}/judgement`,
      success: (data) => {
        $('#inputScore').val(data.result.info.score);
        $('#inputText').val(data.result.info.text);
      }
    })
    if (studentList[nid].file_id) {
      $('.my-download-button').removeAttr('disabled');
    }
    else {
      $('.my-download-button').attr('disabled', 'disabled');
    }
  })