var current_url_valid = window.location.protocol + window.location.pathname;

/* communication */
function creatURL(URLarray) {
    var length;
    if (URLarray) {
        length = URLarray.length
    } else {
        return URLarray;
    }
    var newURLarray = URLarray.filter(function (currentValue) {
        return currentValue && currentValue != null && currentValue != undefined;
    });
    var result = "";
    result = result + newURLarray[0];
    for (var i = 1; i < length; i++) {
        if (result.endsWith('/')) {
            result = result + newURLarray[i];
        } else {
            result = result + '/' + newURLarray[i];
        }
    }
    return result;
}

function setXmlHttp() {
    var xmlhttp;
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlhttp;
}

function RESTful(xmlhttp, method, url, queryString, async, fnc) { //获取JSON数据
    xmlhttp.open(method, url, async);
    xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    xmlhttp.send(queryString);
    xmlhttp.onreadystatechange = fnc;
}

function logout() {
    var xmlhttp = setXmlHttp();
    RESTful(xmlhttp, "GET", creatURL([current_url_valid, 'logout']), null, true, function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                alert("退出成功！");
                window.location.href = '/';
                if (callback) {
                    callback();
                }
            } else {
                console.log("发生错误" + xmlhttp.status);
            }
        }
    });
}

function setData() {
    if ($('#pw').val() != $('#rpw').val()) {
        alert('两次输入密码不一致');
    } else if ($('#pw').val() == '') {
        alert('密码不能为空');
    } else {
        $.ajax({
            url: '/information',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                name: $('#name').val(),
                col: $('#col').val(),
                uid: $('#uid').val(),
                pw: $('#pw').val(),
            }),
            success: () => {
                alert('修改成功！');
                location.reload();
            },
        });
    }
}
