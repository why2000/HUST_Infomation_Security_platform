'use strict'
var address = "127.0.0.1";
var current_url_valid = window.location.protocol + window.location.pathname;
var local_connect_flag = false;
let hb_try = 0;

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

/* set css and html */
function setSimulatorWindow(target, visibility) {
    document.getElementById("simulator_window").style.display = visibility;
    document.getElementById("simulator_window").src = target;
}

function setTasks(tasks) {
    document.getElementById("sim_tasks_text").innerText = tasks;
}

function getTasks() {
    var xmlhttp = setXmlHttp();
    var tasks;
    RESTful(xmlhttp, "GET", creatURL([current_url_valid, 'tasks']), null, true, function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                tasks = JSON.parse(xmlhttp.responseText).result.tasks;
                setTasks(tasks);
                if (callback) {
                    callback();
                }
            } else {
                console.log("发生错误" + xmlhttp.status);
                setTasks("加载失败");
            }
        }
    });
}

function keepAlive() {
    if (local_connect_flag) {
        RESTful(xmlhttp, "GET", creatURL([current_url_valid, 'keep']), null, true, function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    hb_try = 0;
                    console.log("Heartbeat success");
                    setTimeout(keepAlive, 24000);
                    return;
                }
            } else {
                console.log("Heartbeat fail");
                if (hb_try < 5) {
                    hb_try = hb_try + 1;
                    console.log("try %d time", hb_try + 1);
                    setTimeout(keepAlive, 1000);
                } else {
                    console.log("connection lost");
                    connectToCon();
                }
            }
        })
    }
}

function connectToCon() {
    if (local_connect_flag == false) {
        alert("connecting");
        var xmlhttp = setXmlHttp();
        var port;
        RESTful(xmlhttp, "GET", creatURL([current_url_valid, 'start']), null, true, function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    port = JSON.parse(xmlhttp.responseText).result.port;
                    setSimulatorWindow("http://" + address + ":" + port.toString(), "block");
                    console.log("connected");
                    document.getElementById("start_stop_sim_text").innerText = "结束模拟";
                    document.getElementById("start_stop_sim_button").style.background = "#ff4949";
                    document.getElementById("start_stop_sim_statue").innerText = "连接成功";
                    local_connect_flag = true;
                    setTimeout(keepAlive, 25000);
                    return;
                }
            } else {
                console.log("发生错误" + xmlhttp.status);
                document.getElementById("start_stop_sim_statue").innerText = "出现错误";
            }
        });
    } else {
        alert("disconnecting");
        var xmlhttp = setXmlHttp();
        var port;
        RESTful(xmlhttp, "GET", creatURL([current_url_valid, 'stop']), null, true, function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    setSimulatorWindow("", "none");
                    console.log("disconnected");
                    document.getElementById("start_stop_sim_text").innerText = "开始模拟";
                    document.getElementById("start_stop_sim_button").style.background = "#206db0";
                    document.getElementById("start_stop_sim_statue").innerText = "断开成功";
                    local_connect_flag = false;
                    return;
                }
            } else {
                console.log("发生错误" + xmlhttp.status);
                document.getElementById("start_stop_sim_statue").innerText = "出现错误";
            }
        });
    }
}

/* SideBar */

$(function sideBarInit() {
    $(".has-submenu").hover(function () {
        var height;
        var current_list = $(this).find('.submenu').attr("id");
        current_list = current_list.split('-').join('');
        if (current_list != null && current_list != undefined) {
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
    getUserName(setUserName);
    setUserName();
    getFavor();
    getTaskList(setTaskList);
    getFavorList(setFavorList);
    onFavorClicked();
});


function getUserName(callback) {
    var xmlhttp = setXmlHttp();
    RESTful(xmlhttp, "GET", creatURL([current_url_valid, 'username']), null, true, function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                // alert(xmlhttp.responseText);
                username = JSON.parse(xmlhttp.responseText).result.username;
                // alert(tasklist);
                // setTaskList(tasklist);
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
                getFavorList(setFavorList);
            } else {
                deleteFavor();
                getFavorList(setFavorList);
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

        $('#task-list').append(`<li><a href="/exam/${i + 1}"><i class="fa fa-dot-circle-o fa-lg"></i><span class="nav-text-small"></span></a></li>`);
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
        $('#favor-list').append(`<li><a href="/exam/${singleindex}"><i class="fa fa-dot-circle-o fa-lg"></i><span class="nav-text-small">${singlename}</span></a></li>`);
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
                console.log("post success" + xmlhttp.status);
                $("#favor-icon").css("color", "#3E9AF2");
                $("#favor-icon").removeClass("fa-star-o");
                $("#favor-icon").addClass("fa-star");
                favor = true;
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
                console.log("delete success" + xmlhttp.status);
                $("#favor-icon").css("color", "");
                $("#favor-icon").removeClass("fa-star");
                $("#favor-icon").addClass("fa-star-o");
                favor = false;
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