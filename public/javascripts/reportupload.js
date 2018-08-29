$(document).ready(function () {

  let localURLArgs = location.href.split('/')
  var mid = localURLArgs.pop(), sid = localURLArgs.pop();

  $.getJSON({
    url: `/feedback/report/${sid}/${mid}`,
    success: (data) => {
      $('#reportaddr').attr('href', `/file/${data.data.file_id}`);
      $('#fileUploaded').show();
    }
  })
  
  $('#upload').on('change', function () {
    var fileName = $(this)[0].files[0]['name'];
    $('#fileHelpId').html(fileName);
  });

  $('#submit').click(function () {
    var file = $('#upload')[0].files[0];
    if (!file) {
      alert('您还未选择文件！');
    } else {
      var form = new FormData();
      form.append('upload', file);
      $.post({
        url: `/feedback/report/${sid}/${mid}`,
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
    }

  });
});
