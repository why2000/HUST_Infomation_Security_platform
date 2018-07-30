$(document).ready(function () {
  alert("ready~");
  $('#upload').on('change', function () {
    var fileName = $(this)[0].files[0]['name'];
    $('#fileHelpId').html(fileName);
  });

  $('#submit').click(function() {
    alert("上传成功！");
    location.reload();
  });
});
