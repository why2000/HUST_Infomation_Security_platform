'use strict';

let classindex;
let username;
let courselist;
let info;
let current_url_valid = window.location.protocol + window.location.pathname;


/* General */

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

/* TopBar*/

function Logout(callback) {
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

/* SideBar */

$(function sideBarInit() {
    classindex = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1, window.location.pathname.length);
    $('#exam-to-class').attr('href', `/exam/${classindex}`);
    $('#class-to-feedback').attr('href', `/feedback/${classindex}/class/null`);
    $('#class-to-courseware').attr('href', `/courseware`);

    $(".has-submenu").hover(function () {
        var height;
        var current_list = $(this).find('.submenu').attr("id");
        current_list = current_list.split('-').join('');
        console.log(current_list);
        if (current_list != null && current_list != undefined) {
            console.log(eval(current_list))
            height = eval(current_list).length * 41;
        } else {
            height = 0;
        }
        $(this).find('.submenu').stop().css("height", `${height}px`).slideDown(300);
        $(this).find(".list-icon").addClass("fa-rotate-90").css("width", "30px").css("transform", "translateY(-12px) rotate(90deg)");
    }, function () {
        $(this).find(".submenu").stop().slideUp(300);
        $(this).find(".list-icon").removeClass("fa-rotate-90").css("width", "55px").css("height", "36px").css("transform", "");
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
        console.log(courselist);
        for (var i = 0; i < length; i++) {

            $('#course-list').append(`<li><a href="/tutorial/${courselist[i]._id}"><i class="fa fa-dot-circle-o fa-lg"></i><span class="nav-text-small"></span></a></li>`);
        };
        for (var i = 0; i < length; i++) {
            let single = courselist[i];
            let name = single.name;
            $(`#course-list li:nth-child(${courselist[i]._id}) a span`).text(name);
        };
    });
}

function getUserName(callback) {
    var xmlhttp = setXmlHttp();
    RESTful(xmlhttp, "GET", creatURL([current_url_valid, 'username']), null, true, function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                // alert(xmlhttp.responseText);
                username = JSON.parse(xmlhttp.responseText).result.username;
                // alert(tasklist);
                // setTaskList(tasklist);
                setUserName();
                if (callback) {
                    callback();

                }
            } else {
                console.log("发生错误" + xmlhttp.status);
            }
        }
    });
}

function setUserName() {
    if (!username) {
        username = "伍瀚缘testingtestingtesting";
    }
    var hello = "欢迎！" + username;
    $(".settings").text(hello);
}

function onFavorClicked() {
    $("#favor").click(function () {
        // alert(favor);
        if (!isIndex())
            if (!favor) {
                postFavor();
            } else {
                deleteFavor();
            }
    });
}

// TaskList
function getTaskList(callback) {
    var xmlhttp = setXmlHttp();
    RESTful(xmlhttp, "GET", creatURL([current_url_valid, 'tasklist']), null, true, function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                // alert(xmlhttp.responseText);
                tasklist = JSON.parse(xmlhttp.responseText).result.tasklist;
                // alert(tasklist);
                // setTaskList(tasklist);
                setTaskList();
                if (callback) {
                    callback();

                }
            } else {
                console.log("发生错误" + xmlhttp.status);
            }
        }
    });
}

function setTaskList() {
    // alert(tasklist);
    $('#task-list').empty();
    var length = 0;
    if (tasklist) {
        length = tasklist.length;
    }
    for (var i = 0; i < length; i++) {

        $('#task-list').append(`<li><a href="/tutorial/${i + 1}"><i class="fa fa-dot-circle-o fa-lg"></i><span class="nav-text-small"></span></a></li>`);
    };
    for (var i = 0; i < length; i++) {
        var single = tasklist[i];
        var singleindex = single.index;
        var singlename = single.name;
        $(`#task-list li:nth-child(${i + 1}) a span`).text(singlename);
    };
}

// FavorList
function getFavorList(callback) {
    var xmlhttp = setXmlHttp();
    RESTful(xmlhttp, "GET", creatURL([current_url_valid, 'favorlist']), null, true, function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                // alert(xmlhttp.responseText);
                favorlist = JSON.parse(xmlhttp.responseText).result.favorlist;
                // alert(favorlist);
                // setTaskList(tasklist);
                setFavorList()
                if (callback) {
                    callback();

                }
            } else {
                console.log("发生错误" + xmlhttp.status);
            }
        }
    });
}

function setFavorList() {
    $('#favor-list').empty();
    var length = 0;
    if (favorlist) {
        length = favorlist.length;
    }
    // alert(length);
    // alert(favorlist);
    for (var i = 0; i < length; i++) {
        var single = favorlist[i];
        var singleindex = single.index;
        var singlename = single.name;
        $('#favor-list').append(`<li><a href="/tutorial/${singleindex}"><i class="fa fa-dot-circle-o fa-lg"></i><span class="nav-text-small">${singlename}</span></a></li>`);
    };
}

// Favor
function getFavor(callback) {
    var xmlhttp = setXmlHttp();
    RESTful(xmlhttp, "GET", creatURL([current_url_valid, 'favor']), null, true, function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                favor = JSON.parse(xmlhttp.responseText).result.favor;
                // alert(favorstatus);
                if (favor) {
                    $("#favor-icon").css("color", "#3E9AF2");
                    $("#favor-icon").removeClass("fa-star-o");
                    $("#favor-icon").addClass("fa-star");
                } else {
                    $("#favor-icon").css("color", "");
                    $("#favor-icon").removeClass("fa-star");
                    $("#favor-icon").addClass("fa-star-o");
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

function postFavor(callback) {
    var data = {
        favor: favor
    };
    // alert(window.location.href)
    var xmlhttp = setXmlHttp();
    RESTful(xmlhttp, "POST", creatURL([current_url_valid, 'favor']), JSON.stringify(data), true, function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                // console.log("post success" + xmlhttp.status);
                $("#favor-icon").css("color", "#3E9AF2");
                $("#favor-icon").removeClass("fa-star-o");
                $("#favor-icon").addClass("fa-star");
                favor = true;
                getFavorList();
                if (callback) {
                    callback();
                }
            } else {
                console.log("发生错误" + xmlhttp.status);
                favor = false;
            }
        }
    });
}

function deleteFavor(callback) {
    var data = {
        favor: favor
    };
    var xmlhttp = setXmlHttp();
    RESTful(xmlhttp, "DELETE", creatURL([current_url_valid, 'favor']), JSON.stringify(data), true, function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                // console.log("delete success" + xmlhttp.status);
                $("#favor-icon").css("color", "");
                $("#favor-icon").removeClass("fa-star");
                $("#favor-icon").addClass("fa-star-o");
                favor = false;
                getFavorList();
                if (callback) {
                    callback();
                }
            } else {
                console.log("发生错误" + xmlhttp.status);
                favor = true;
            }
        }
    });
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
        $('.test-main').remove();
    } else {
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

    // Testing
    function foo(pass) {
        /* info = {
            type: "exam-info",
            taskindex: "1",
            content: [
                {
                    type: "text",
                    text: "因主校区东边泵房升级改造施工，定于8月3日23:30——8月4日2:00停水，主校区大部分区域停水（喻园小区、西边高层小区、紫菘学生公寓与紫菘教师小区不受影响），请各单位和各住户做好储水备用，早完工，早送水，不便之处敬请谅解。",
                    indents: 0,
                },
                {
                    type: "text",
                    text: "",
                    indents: 0,
                },
                {
                    type: "sc",
                    text: "测试单选",
                    indents: 0,
                    options: [
                        {
                            src: "",
                            text: "第一个答案测试",
                            choice: "A"
                        },
                        {
                            src: "",
                            text: "第二个答案测试",
                            choice: "B"
                        }
                    ]
                },
                {
                    type: "text",
                    text: "后勤集团建安总公司",
                    indents: 15,
                },
                {
                    type: "text",
                    text: "2018年8月3日",
                    indents: 15,
                },
                {
                    type: "mc",
                    text: "测试多选题如果很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长",
                    indents: 0,
                    options:[
                        {
                            text: "第一个多选项",
                            choice: "A"
                        },
                        {
                            text: "第二个",
                            choice: "B"
                        }
                    ]
                },
                {
                    type: "img",
                    src: "",
                },
                {
                    type: "fb",
                    text: "这是一道_____题",
                    indents: 0,
                    options: [
                        {
                            src: "",
                            text: "",
                            choice: "1"
                        }
                    ]
                }
            ],
            title: '主校区短时停水通知',
            author: 'why',
            category: '通知',
            time: '2018-08-03 15:52',
            hot: '111'
        } */
    }
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