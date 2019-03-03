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



function getExperimentContent(){
    let title;
    let content;
    $.get({
        url: '/experiment/current'
      }).done(result => {
        title = result.result.title;
        content = result.result.content;
        $('#title').val(title);
        $('#content').val(content);
      });
      
}

function changeCurrentExperiment(title){
    $.ajax({
        url: '/experiment/current',
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({
            title: title
        }),
        success: () => {
            alert('修改成功!'); 
            location.reload();
        },
    });
}

function getExperimentList(){
    $.get({
        url: '/experiment/titlelist'
      }).done(result => {
        experimentlist = result.result;
        $('#course-list').empty();
        var length = 0;
        if (experimentlist) {
          length = experimentlist.length;
        }
        for (var i = 0; i < length; i++) {
            var title = experimentlist[i].title;
            $('#experiment-select').append(`<a class="list-group-item list-group-item-action experiment-select-item" mid="${title}">${title}</a>`);
        }
      });
}

function modifyExperimentContent() {
    let title = $('#title').val();
    let content = $('#content').val();
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
            location.reload();
        },
    });
}


$(document).ready(function () {
    sideBarInit();
    getCourseList();
    getUserName();
    getExperimentContent();
    getExperimentList();
}).on('click', '.experiment-select-item', function(){
    changeCurrentExperiment($(this).attr('mid'));
});




function sideBarInit() {
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
  }
  
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
  