var ha = new Array();
var fixHight = 0; //由于postion变动高度变成不计算
function menuFixed(preid,id){
var obj = document.getElementById(id); //当前div ID对象
var preobj = document.getElementById(preid); //前一个DIV ID对象
var _getTop = obj.offsetTop-fixHight; //当前div距离顶端距离
var _preTop = preobj.offsetTop;//前一个DIV距离顶端距离
var _preHeight = preobj.offsetHeight;//前一个DIV高度
fixHight = fixHight+obj.offsetHeight;
console.log('preid:'+preid+" _preHeight:"+_preHeight);
ha.push({id:id,_getTop:_getTop,_preTop:_preTop,_preHeight:_preHeight,preid:preid});
console.log("arry:"+JSON.stringify(ha));
}
window.onscroll = function(){
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	var i = getIndex(scrollTop);
	console.log('index:'+i);
	
	changePos(ha[i].preid,ha[i]._preHeight,ha[i].id,ha[i]._getTop,scrollTop);
}
function getIndex(scrollTop){
	var length = ha.length;
	for(var i=0;i<length;i++){
		if(ha[i]._getTop >= scrollTop && scrollTop >= ha[i]._preTop)
			return i;
	}
	return length-1;
}
function changePos(preid,preheight,id,gettop,scrollTop){
var obj = document.getElementById(id);
var preobj = document.getElementById(preid);
console.log('scrollTop:'+scrollTop+' gettop:'+gettop);
if(scrollTop < gettop){
	preobj.style.position = 'fixed';
	obj.style.position = 'relative';
	if(scrollTop-gettop <= 0 && scrollTop-gettop >= -preheight){
		preobj.style.top = gettop - preheight - scrollTop + 'px';
	}else if(scrollTop-gettop <= 0){
		preobj.style.top = 0;
	}else{
		preobj.style.top = -preheight+'px';
	}
}else{
	obj.style.position = 'fixed';
	console.log('id:'+id);
}
}
window.onload = function(){
    menuFixed('headbar1','headbar2');
    }