'use strict'
let favor;
let taskinfo;
let username;
let tasklist;
let favorlist;
let timelimit;
var current_url_valid = window.location.protocol+window.location.pathname;


/* General */

function creatURL(URLarray){
    var length;
    if(URLarray){
        length = URLarray.length
    }else{
        return URLarray;
    }
    var newURLarray = URLarray.filter( function(currentValue) { 
        return currentValue && currentValue!= null && currentValue != undefined;
    });
    var result = "";
    result = result + newURLarray[0];
    for(var i = 1; i<length; i++){
        if(result.endsWith('/')){
            result = result + newURLarray[i];
        }else{
            result = result + '/' + newURLarray[i];
        }
    }
    return result;
}



function setXmlHttp(){
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

/* SideBar */

$(function sideBarInit(){
    $(".has-submenu").hover(function(){
        var height;
        var current_list = $(this).find('.submenu').attr("id");
        current_list = current_list.split('-').join('');
        if(current_list !=null && current_list != undefined){
            height = eval(current_list).length * 41;
        }
        else {
            height = 0;
        }
        $(this).find('.submenu').stop().css("height", `${height}px`).slideDown(300);
        $(this).find(".list-icon").addClass("fa-rotate-90").css("width", "30px").css("transform", "translateY(-12px) rotate(90deg)");
    }, function(){
        $(this).find(".submenu").stop().slideUp(300);
        $(this).find(".list-icon").removeClass("fa-rotate-90").css("width", "55px").css("height", "36px").css("transform", "");
    });
    $(".main-menu").hover(function(){
        $(".settings").stop().animate({opacity: 1},100);
        // $(".settings").css("visibility", "");
    }, function(){
        $(".settings").stop().animate({opacity: 0},300);
        // $(".settings").css("visibility", "hidden");
    });
    getUserName(setUserName);
    setUserName();
    getFavor();
    getTaskList(setTaskList);
    getFavorList(setFavorList);
    onFavorClicked();
});


function getUserName(callback){
    var xmlhttp = setXmlHttp();
    RESTful(xmlhttp, "GET", creatURL([current_url_valid, 'username']), null, true, function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                // alert(xmlhttp.responseText);
                username = JSON.parse(xmlhttp.responseText).result.username;
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

function setUserName(){
    if (!username) {
        username = "伍瀚缘testingtestingtesting";
    }
    var hello = "欢迎！" + username;
    $(".settings").text(hello);
}


function onFavorClicked(){
    $("#favor").click(function () {
        // alert(favor);
        if(!isIndex())
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
function getTaskList(callback){
    var xmlhttp = setXmlHttp();
    RESTful(xmlhttp, "GET", creatURL([current_url_valid, 'tasklist']), null, true, function() {
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
        var single = tasklist[i];
        var singleindex = single.index;
        var singlename = single.name;
        $(`#task-list li:nth-child(${i+1}) a span`).text(singlename);
    };
}


// FavorList
function getFavorList(callback){
    var xmlhttp = setXmlHttp();
    RESTful(xmlhttp, "GET", creatURL([current_url_valid,'favorlist']), null, true, function() {
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
    // alert(length);
    // alert(favorlist);
    for(var i = 0; i<length; i++){
        var single = favorlist[i];
        var singleindex = single.index;
        var singlename = single.name;
        $('#favor-list').append(`<li><a href="/exam/${singleindex}"><i class="fa fa-dot-circle-o fa-lg"></i><span class="nav-text-small">${singlename}</span></a></li>`);
    };
}


// Favor
function getFavor(callback){
    var xmlhttp = setXmlHttp();
    RESTful(xmlhttp, "GET", creatURL([current_url_valid, 'favor']), null, true, function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                favor = JSON.parse(xmlhttp.responseText).result.favor;
                // alert(favorstatus);
                if(favor){
                    $("#favor-icon").css("color", "#3E9AF2");
                    $("#favor-icon").removeClass("fa-star-o");
                    $("#favor-icon").addClass("fa-star");
                }else{
                    $("#favor-icon").css("color", "");
                    $("#favor-icon").removeClass("fa-star");
                    $("#favor-icon").addClass("fa-star-o");
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
    RESTful(xmlhttp, "POST", creatURL([current_url_valid, 'favor']), JSON.stringify(data), true, function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                console.log("post success" + xmlhttp.status);
                $("#favor-icon").css("color", "#3E9AF2");
                $("#favor-icon").removeClass("fa-star-o");
                $("#favor-icon").addClass("fa-star");
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
    RESTful(xmlhttp, "DELETE", creatURL([current_url_valid, 'favor']), JSON.stringify(data), true, function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                console.log("delete success" + xmlhttp.status);
                $("#favor-icon").css("color", "");
                $("#favor-icon").removeClass("fa-star");
                $("#favor-icon").addClass("fa-star-o");
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





















/* MainPart */

$(function mainPartInit(){
    $('form').attr('action', creatURL([current_url_valid, "submit"]));
    setTimeLimit();
    setAnswerSheet();
    onAnswerClicked();
    getIndex(setIndex);
});

function isIndex(){
    var reg = /index\#*$/;
    if(reg.test(current_url_valid)){
        return true;
    }else{
        return false
    }
}

function getIndex(callback){
    if(isIndex()){
        $('.test_main').remove();
        var xmlhttp = setXmlHttp();
        RESTful(xmlhttp, "GET", creatURL([current_url_valid, 'indexinfo']), null, true, function() {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    // alert(xmlhttp.responseText);
                    username = JSON.parse(xmlhttp.responseText).result.message;
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
}

function setIndex(){

}
    


function findCheckedAnswer(examId){
    var result = new Array();
    var answers = $(`#${examId}`).find('.radioOrCheck');
    answers.each(function(){
        if($(this).is(':checked')){
            result.push($(this).attr('value'));
        }
    })
    // alert(result);
    return result;
}

function onAnswerClicked() {
    $('li.option label').click(function () {
        // debugger;
        var currentExam = $(this).closest('.test_content_nr_main').closest('li');
        var examId = currentExam.attr('id'); // 得到题目ID
        var cardLi = $('a[href=#' + examId + ']'); // 根据题目ID找到对应答题卡
        // 设置已答题
        if (!cardLi.hasClass('hasBeenAnswer')) {
            cardLi.addClass('hasBeenAnswer');
        }else {
            var answered = findCheckedAnswer(examId)
            // alert(answered);
            // alert($.inArray($(this).prev('.radioOrCheck').attr('value'), answered));
            // alert($(this).prev('.radioOrCheck').attr('class'));
            if(answered.length == 1 && $.inArray($(this).prev('.radioOrCheck').attr('value'), answered) != -1 && currentExam.find('.radioOrCheck').attr('type') == 'checkbox'){
                cardLi.removeClass('hasBeenAnswer');
            }
        }
    });
}

function formatTime(timeArray){
    var result = "";
    if(!timeArray.length){
        return "00:00:00";
    }
    if(timeArray[0]<10){
        result = result + 0;
    }
    result = result + timeArray[0]
    for(var i = 0; i<timeArray.length;i++){
        if(i!=0){
            var single = timeArray[i]
            if(single < 10){
                result = result + ":0" + single;
            }else{
                result = result + ":" + single;
            }
            
        }   
    }
    return result;
}

function setTimeLimit(callback){
    if (!timelimit){
        timelimit = formatTime([0,0,30]);
    }
    $('.alt-1').text(timelimit);
    $('#all-start').click(function(){
        if($(this).hasClass('waiting')){
            $(this).removeClass('waiting');
            startTimeCountDown(callback);
            $('.alt-1').on('time.elapsed', function () {
                $('#all-submit').trigger('click')
            });
        }
    });
}
function startTimeCountDown(callback){
    $('time').countDown({
        with_separators: false
    });
    $('.alt-1').countDown({
        css_class: 'countdown-alt-1'
    });
    $('.alt-2').countDown({
        css_class: 'countdown-alt-2'
    });
    setTaskInfo(callback);
}

function setAnswerSheet(callback){
    var sc = $('li[id*="sc"]');
    var mc = $('li[id*="mc"]');
    var fb = $('li[id*="fb"]');
    var answersheet = $('.rt_nr1');
    var all = new Array('sc', 'mc', 'fb');
    $.each(all, function(index, value){
        var length;
        var obj = eval(value);
        var objsheet = answersheet.find(`#rt_content_${value} .answerSheet ul`);
        if(obj.length){
            length = obj.length;
            answersheet.find(`#rt_content_${value} .content_lit`).text(length.toString());
        }else{
            length = 0;
            objsheet.closest('.rt_content').remove();
            return true;
        }
        
        // alert(value);
        for(var i = 0; i<length; i++){
            //这里的空格不能删
            objsheet.append(` <li><a href="#${value}${i}">${i+1}</a></li>`);
        }

    });
    if(callback){
        callback();
    }     

}

// TaskInfo
function getTaskInfo(callback){
    var xmlhttp = setXmlHttp();
    RESTful(xmlhttp, "GET", creatURL([current_url_valid, 'taskinfo']), null, false, function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                taskinfo = JSON.parse(xmlhttp.responseText).result.favor;
                // alert(favor);
                if(favor){
                    $("#favor-icon").css("color", "#3E9AF2");
                    $("#favor-icon").removeClass("fa-star-o");
                    $("#favor-icon").addClass("fa-star");
                    return "yes";
                }else{
                    $("#favor-icon").css("color", "");
                    $("#favor-icon").removeClass("fa-star");
                    $("#favor-icon").addClass("fa-star-o");
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

function setTaskInfo(callback){
    if(isIndex()){
        return false;
    }


    if(callback){
        callback();
    }
}


