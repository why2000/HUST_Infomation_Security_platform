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
            } else {
                console.log("发生错误" + xmlhttp.status);
                setTasks("加载失败");
            }
        }
    });
}

function keepAlive() {
    if (local_connect_flag) {
        console.log('sending Heartbeat');
        var xmlhttp = setXmlHttp();
        xmlhttp.timeout = 2000;
        RESTful(xmlhttp, "GET", creatURL([current_url_valid, 'keep']), null, true, function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    hb_try = 0;
                    console.log("Heartbeat success");
                    setTimeout(keepAlive, 10000);
                }
            }
        })
        xmlhttp.ontimeout = function () {
            console.log("Heartbeat fail");
            if (hb_try < 5) {
                hb_try = hb_try + 1;
                console.log("try %d time", hb_try);
                setTimeout(keepAlive, 1000);
            } else {
                console.log("connection lost");
                connectToCon();
            }
        }
    }
}

function Logout(){
    var xmlhttp = setXmlHttp();
    RESTful(xmlhttp, "GET", creatURL([current_url_valid, 'logout']), null, true, function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                alert("退出成功！");
                window.location.href='/';
                if (callback) {
                    callback();
                }
            } else {
                console.log("发生错误" + xmlhttp.status);
            }
        }
    });
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
                    setTimeout(keepAlive, 10000);
                } else {
                    console.log("发生错误" + xmlhttp.status);
                    document.getElementById("start_stop_sim_statue").innerText = "出现错误";
                }
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
                } else {
                    console.log("发生错误" + xmlhttp.status);
                    document.getElementById("start_stop_sim_statue").innerText = "出现错误";
                }
            }
        });
    }
}

/* tasks init */
$(function mainpart(){
    getTasks();
});
