'use strict'
$(document).ready(function () {
  let url = window.location.href;
  $.get({
    url: '/courseware/list',
    success: (data) => {
      let html = "";
      for (let course_id = 1, dLen = data.data.length; course_id <= dLen; course_id++) {
        html += '<li class="list-group-item" href="' + url + '/file/course' + course_id + '" download>'
          + "No." + course_id + "：" + data.data[course_id - 1].course_name
          + '<div class="btn-group pull-right">'
        let disable;
        if (data.data[course_id - 1].status == false) {
          disable = 'disabled="disabled"';
        } else {
          disable = '';
        }
        html += `<button type="button" class="my-delete-button btn btn-primary btn-warning" cid="course${course_id}" ${disable}>删除</button>`
          + `<button type="button" class="my-download-button btn btn-primary" cid="course${course_id}" ${disable}>下载</button>`
          + `<button type="button" class="my-upload-button btn btn-primary" cid="course${course_id}">上传</button>`
          + '</div > </li>';
      }
      $('#course-list').append(html);
    }
  });
  console.log("get list suc");
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
    let cid = $(this).attr('cid');
    $.ajax({
      url: '/courseware/file/' + cid,
      type: 'DELETE',
      data: {}
    }).done(function () {
      $this.removeClass("btn-primary");
      $this.removeClass("btn-danger");
      $this.addClass("btn-success");
      $this.text("删除成功");
      $this.attr('disabled', 'disabled');
      $(`.my-download-button[cid='${cid}']`).attr('disabled', 'disabled');
    }).fail(function () {
      $this.text("删除失败，请重试。");
    })
  })
  .on('click', '.my-download-button', async function () {
    let cid = $(this).attr('cid');
    let url = window.location.href;
    let IFrameRequest = document.createElement("iframe");
    IFrameRequest.id = "FakeDownload";
    IFrameRequest.src = url + '/file/' + cid;
    IFrameRequest.style.display = "none";
    document.body.appendChild(IFrameRequest);
  })
  .on('click', '.my-upload-button', async function () {
    let cid = $(this).attr('cid');
    $("#FakeUpload").attr('cid', cid);
    $("#FakeUpload").trigger("click");
  })
  .on('change', '#FakeUpload', function () {
    console.log($(this));
    let file = $("#FakeUpload")[0].files[0]
    let cid = $(this).attr('cid');

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
  })
