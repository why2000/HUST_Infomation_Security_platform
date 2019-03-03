let username;
let userid;
let courselist;
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






function setExperimentContent() {
    let title = $('#title').val();
    let content =$('#userid').val();
    $.ajax({
        url: '/experiment/modify',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            title: title,
            content: content
        }),
        success: () => {
            alert('修改成功!');
        },
    });
}



$(function sideBarInit() {
    classindex = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1, window.location.pathname.length);
    $('#class-to-logout').attr('href', `/login/logout`);
    $('#class-to-information').attr('href', `/information`);
  
    $(".has-submenu").hover(function () {
      var height;
      var current_list = $(this).find('.submenu').attr("id");
      current_list = current_list.split('-').join('');
      if (current_list != null && current_list != undefined) {
        height = eval(current_list).length * 41;
      } else {
        height = 0;
      }
      $('#sidebar-back').css('display', 'none');
      $(this).find('.submenu').stop().css("height", `${height}px`).slideDown(300);
      $(this).find(".mlist-icon").addClass("fa-rotate-90").css("width", "30px").css("transform", "translateY(-12px) rotate(90deg)");
    }, function () {
      $(this).find(".submenu").stop().slideUp(300);
      $(this).find(".mlist-icon").removeClass("fa-rotate-90").css("width", "55px").css("height", "36px").css("transform", "");
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
  
  function getCourseList() {
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
  
        $('#course-list').append(`<li><a href="/tutorial/index#${courselist[i]._id}"><i class="fa fa-dot-circle-o fa-lg"></i><span class="nav-text-small">${courselist[i].name}</span></a></li>`);
      };
    });
  }
  
  function logout() {
    $.get({
      url: '/login/logout'
    }).done(function () {
      alert("退出成功！");
      window.location.href = '/';
    })
  }
  
  function getUserName() {
    $.get({
      url: '/user/username'
    }).done(result => {
      username = result.result.username;
      setUserName();
    })
  }
  
  function setUserName() {
    if (!username) {
      username = "数据获取失败";
    }
    var hello = "欢迎！" + username;
    $(".settings").text(hello);
  }
  