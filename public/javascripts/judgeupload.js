$('document').ready(function() {
    /*var mid = getMoudleID(),
      sid = getStudentID(),
      sname = getStudentName()*/

    var mid = '1', sid = '1', sname = "赵日天"; // 测试
    
    $('#student').text($('#student').text() + sname);

    $.getJSON({
        url: `/feedback/judgement/${sid}/${mid}`,
        success: (data) => {
          $('#inputScore').val(data.data.score);
          $('#inputText').val(data.data.text);
        }
      })


    $('#submit').click(function() {
        var score = $('#inputScore').val();
        var text = $('#inputText').val();
        // 参数检查
        if(score == '') {
            alert('分数不能为空！');
        } else if(!/^0$|^[1-9][0-9]{0,1}$|^100$/.test(score)) { // 是否0-100
            alert('分数应为0-100间的整数！')
        } else {
            score = parseInt(score);
            $.post({
                url: `/feedback/judgement/${sid}/${mid}`,
                contentType : 'application/json',
                data: JSON.stringify({score: score, text: text}),
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
    });
});