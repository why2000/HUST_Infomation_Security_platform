let favor;
let taskinfo;
let name;
let tasklist;
let favorlist;
var current_url_vaild = window.location.protocol+window.location.pathname;

$(".has-submenu").hover(function(){
    $(this).find('.submenu').stop().show({
        duration: 300
    });
    $(this).find(".list-icon").addClass("fa-rotate-90").css("width", "30px").css("transform", "translateY(-12px) rotate(90deg)");
}, function(){
    $(this).find(".submenu").stop().hide({
        duration: 300
    });
    $(this).find(".list-icon").removeClass("fa-rotate-90").css("width", "55px").css("height", "36px").css("transform", "");
});
$(".main-menu").hover(function(){
    $(".settings").stop().animate({opacity: 1},100);
    // $(".settings").css("visibility", "");
}, function(){
    $(".settings").stop().animate({opacity: 0},300);
    // $(".settings").css("visibility", "hidden");
});


function setXmlHttp(){
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





// TaskList
function getTaskList(callback){
    var xmlhttp = setXmlHttp();
    RESTful(xmlhttp, "GET", current_url_vaild+'/tasklist', null, true, function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                // alert(xmlhttp.responseText);
                tasklist = JSON.parse(xmlhttp.responseText).result.tasklist;
                // alert(tasklist);
                // setTaskList(tasklist);
                if(callback){
                    callback();
                    
                }               
            } else {
                console.log("发生错误" + xmlhttp.status);
            }
        }
    });
}

function setTaskList(){
    // alert(tasklist);
    $('#task-list').empty();
    var length = 0;
    if(tasklist){
        length = tasklist.length;
    }
    for(var i = 0; i<length; i++){

        $('#task-list').append(`<li><a href="/exam/${i+1}"><i class="fa fa-dot-circle-o fa-lg"></i><span class="nav-text-small"></span></a></li>`);
    };
    for(var i = 0; i<length; i++){
        single = tasklist[i];
        index = single.index;
        name = single.name;
        $(`#task-list li:nth-child(${i+1}) a span`).text(name);
    };
}


// FavorList
function getFavorList(callback){
    var xmlhttp = setXmlHttp();
    RESTful(xmlhttp, "GET", current_url_vaild+'/favorlist', null, true, function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                // alert(xmlhttp.responseText);
                favorlist = JSON.parse(xmlhttp.responseText).result.favorlist;
                // alert(favorlist);
                // setTaskList(tasklist);
                if(callback){
                    callback();
                    
                }               
            } else {
                console.log("发生错误" + xmlhttp.status);
            }
        }
    });
}

function setFavorList(){
    $('#favor-list').empty();
    var length = 0;
    if(favorlist){
        length = favorlist.length;
    }
    // alert(favorlist);
    for(var i = 0; i<length; i++){
        single = favorlist[i];
        index = single.index;
        name = single.name;
        $('#favor-list').append(`<li><a href="/exam/${index}"><i class="fa fa-dot-circle-o fa-lg"></i><span class="nav-text-small">${name}</span></a></li>`);
    };
}


// Favor
function getFavor(callback){
    var xmlhttp = setXmlHttp();
    RESTful(xmlhttp, "GET", current_url_vaild+'/favor', null, true, function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                favor = JSON.parse(xmlhttp.responseText).result.favor;
                // alert(favorstatus);
                if(favor){
                    $("#favor-icon").css("color", "#f544f5");
                    $("#favor-icon").removeClass("fa-heart-o");
                    $("#favor-icon").addClass("fa-heart");
                }else{
                    $("#favor-icon").css("color", "");
                    $("#favor-icon").removeClass("fa-heart");
                    $("#favor-icon").addClass("fa-heart-o");
                }
                if(callback){
                    callback();
                }        
            } else {
                console.log("发生错误" + xmlhttp.status);
            }
        }
    });
}


function postFavor(callback){
    var data = {
            favor: favor
    };
    // alert(window.location.href)
    var xmlhttp = setXmlHttp();
    RESTful(xmlhttp, "POST", current_url_vaild+'/favor', JSON.stringify(data), true, function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                console.log("post success" + xmlhttp.status);
                $("#favor-icon").css("color", "#f544f5");
                $("#favor-icon").removeClass("fa-heart-o");
                $("#favor-icon").addClass("fa-heart");
                favor = true;
                if(callback){
                    callback();
                }     
            } else {
                console.log("发生错误" + xmlhttp.status);
                favor = false;
            }
        }
    });
}
function deleteFavor(callback){
    var data = {
            favor: favor
    };
    var xmlhttp = setXmlHttp();
    RESTful(xmlhttp, "DELETE", current_url_vaild+'/favor', JSON.stringify(data), true, function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                console.log("delete success" + xmlhttp.status);
                $("#favor-icon").css("color", "");
                $("#favor-icon").removeClass("fa-heart");
                $("#favor-icon").addClass("fa-heart-o");
                favor = false;
                if(callback){
                    callback();
                }     
            } else {
                console.log("发生错误" + xmlhttp.status);
                favor = true;
            }
        }
    });
}


// TaskInfo
function getTaskInfo(callback){
    var xmlhttp = setXmlHttp();
    RESTful(xmlhttp, "GET", current_url_vaild+'/taskinfo', null, false, function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                taskinfo = JSON.parse(xmlhttp.responseText).result.favor;
                // alert(favor);
                if(favor){
                    $("#favor-icon").css("color", "#f544f5");
                    $("#favor-icon").removeClass("fa-heart-o");
                    $("#favor-icon").addClass("fa-heart");
                    return "yes";
                }else{
                    $("#favor-icon").css("color", "");
                    $("#favor-icon").removeClass("fa-heart");
                    $("#favor-icon").addClass("fa-heart-o");
                    return "no";

                }
                if(callback){
                    callback();
                }     
            } else {
                console.log("发生错误" + xmlhttp.status);
            }
        }
    });
}