'use strict'

let studentList;
let courseID;
let studentID;

$(document)
  .ready(function () {
    $('#inputScore').val('');
    $('#inputText').val('');
    getCourseID();

    $.get({
      url: `/feedback/${courseID}/list`,
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
      let url = `/feedback/${courseID}/${studentID}/${$('.report-select-item.list-group-item-success').attr('fid')}/judgement`
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
      url: `/feedback/${courseID}/${studentID}/report`,
    }).done((reportList) => {
      $.get({
        url: `/feedback/${courseID}/${studentID}/judgement`,
      }).done(judgementList => {
        for (let n = 0; n < reportList.data.length; n++) {
          let reportInjudgementList = judgementList.data.find(e => {
            return e.file_id == reportList.data[n].file_id;
          })
          if (reportInjudgementList) {
            $('#report-select').append('<a class="list-group-item list-group-item-action report-select-item" fid="' + reportList.data[n].file_id + '">' + '报告名称' + reportList.data[n].file_name + '<span style="float:right;" class="badge badge-success badge-pill">[已评价]]</span></a > ');
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
      url: `/feedback/${courseID}/${studentID}/${fileID}/judgement`,
    }).done(result => {
      $('#inputScore').val(result.result.info.score);
      $('#inputText').val(result.result.info.text);
    })
  })

function getCourseID() {
  let localURLArgs = location.href.split('/');
  courseID = localURLArgs[localURLArgs.length - 3];
}