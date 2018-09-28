'use strict';

let classindex;
let username;
let courselist;
let info;
let current_url_valid = window.location.protocol + window.location.pathname;

/* General */

function
    creatURL(URLarray) {
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

/* TopBar*/

function Logout() {
    $.get({
        url: '/tutorial/logout'
    }).done(function () {
        alert("退出成功！");
        window.location.href = '/';
    })
}

/* SideBar */

$(function sideBarInit() {
    classindex = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1, window.location.pathname.length);
    $('#class-to-exam').attr('href', `/exam/${classindex}`);
    $('#catalog').attr('href', `/tutorial/${classindex}`);
    $('#class-to-feedback').attr('href', `/feedback/${classindex}/class/null`);
    $('#class-to-courseware').attr('href', `/courseware/course/${classindex}`);

    $(".has-submenu").hover(function () {
        var height;
        var current_list = $(this).find('.submenu').attr("id");
        current_list = current_list.split('-').join('');
        if (current_list != null && current_list != undefined) {
            if (eval(current_list) <= 8) {
                height = eval(current_list).length * 41;
            } else {
                height = 328;
            }
        } else {
            height = 0;
        }
        $('#sidebar-back').css('display', 'none');
        $(this).find('.submenu').stop().css("height", `${height}px`).slideDown(300);
        $(this).find(".list-icon").addClass("fa-rotate-90").css("width", "30px").css("transform", "translateY(-12px) rotate(90deg)");
    }, function () {
        $(this).find(".submenu").stop().slideUp(300);
        $(this).find(".list-icon").removeClass("fa-rotate-90").css("width", "55px").css("height", "36px").css("transform", "");
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
    getUserName();
});

function getCourseList(callback) {
    $.get({
        url: '/course',
    }).done(result => {
        courselist = result.data;
        $('#course-list').empty();
        var length = 0;
        if (courselist) {
            length = courselist.length;
        }
        for (var i = 0; i < length; i++) {

            $('#course-list').append(`<li><a href="/tutorial/${courselist[i]._id}"><i class="fa fa-dot-circle-o fa-lg"></i><span class="nav-text-small">${courselist[i].name}</span></a></li>`);
        };
    });
}

function getUserName() {
    $.get({
        url: '/tutorial/username'
    }).done(result => {
        username = result.username;
        setUserName();

    })
}

function setUserName() {
    if (!username) {
        username = "未获取数据";
    }
    var hello = "欢迎！" + username;
    $(".settings").text(hello);
}

/* MainPart */

$(function mainPartInit() {
    getInfo();
    // setAnswerSheet();
    // onAnswerClicked();

});

function isIndex() {
    var reg = /index\#*$/;
    if (reg.test(current_url_valid)) {
        return true;
    } else {
        return false
    }
}

function getInfo(callback) {
    if (isIndex()) {
        alert('1');
        $('.test-main').remove();
    } else {
        alert('2');
        $('.notice_mess_bar').remove();
        $('#pim_content').css('width', '100%').css('margin', '0px');
    }
    var xmlhttp = setXmlHttp();
    RESTful(xmlhttp, "GET", creatURL([current_url_valid, 'info']), null, true, function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                // alert(xmlhttp.responseText);
                info = JSON.parse(xmlhttp.responseText).result.info;
                // alert(tasklist);
                // setTaskList(tasklist);
                if (!info || (info == null)) {
                    alert('课程信息不存在');
                    //window.location.href = '../catalog';
                }

                if (isIndex()) {
                    setInfo();
                } else {
                    setVideo();
                }
                if (callback) {
                    callback();
                }
            } else {
                console.log("发生错误" + xmlhttp.status);
            }
        }
    });
}

function setVideo() {
    var videofile = info.videofile
    var title = info.title;
    $('.main_content .notice_title_01').empty().text(title);
    $('.main_content .notice_content_01').empty().append(`<div class="flowplayer"><video controls="controls" width="100%"> <source type="video/mp4" src='/public/videos/${videofile}'></video></div>`)
}

function setInfo() {
    var title = info.title;
    var content = info.content;
    var author = '发布者：' + info.author;
    var time = info.time;
    var category = '分类：' + info.category;
    // var hot = '访问量：' + info.hot;
    $('.main_content .notice_title_01').empty().text(title);
    $('.main_content .notice_mess_bar .info-author').empty().text(author);
    $('.main_content .notice_mess_bar .info-category').empty().text(category);
    $('.main_content .notice_mess_bar .info-time').empty().text(time);
    // $('.main_content .notice_mess_bar .info-hot').empty().text(hot);
    var length;
    if (content.length) {
        length = content.length;
    } else {
        return false;
    }
    var quenumber = 0;
    for (var i = 0; i < length; i++) {
        if (content[i].type == "text") {
            var indents = "";
            for (var j = 0; j < content[i].indents; j++) {
                indents = indents + "&#12288;&#12288;";
            }
            $('.main_content .notice_content_01>form>p').append(`<span style="font-size: 18px !important;">${indents}${content[i].text}</span><br>`);
        }
    }
}