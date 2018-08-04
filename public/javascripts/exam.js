$(".has-submenu").hover(function(){
    $(".has-submenu .submenu").css("display","table");
    $(".has-submenu #list-icon").addClass("fa-rotate-90");
    $(".has-submenu #list-icon").css("width", "30px");
    $(".has-submenu #list-icon").css("transform", "translateY(-12px) rotate(90deg)");
}, function(){
    $(".has-submenu .submenu").css("display","none");
    $(".has-submenu #list-icon").removeClass("fa-rotate-90");
    $(".has-submenu #list-icon").css("width", "55px");
    $(".has-submenu #list-icon").css("height", "36px");
    $(".has-submenu #list-icon").css("transform", "");
});
$(".main-menu").hover(function(){
    $(".settings").animate({opacity: 1},10);
    // $(".settings").css("visibility", "");
}, function(){
    $(".settings").animate({opacity: 0},300);
    // $(".settings").css("visibility", "hidden");
});

if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
} else { // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
}

function RESTful(method, url, queryString, fnc) { //获取JSON数据
    xmlhttp.open(method, url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    xmlhttp.send(queryString);
    xmlhttp.onreadystatechange = fnc;
}

