/*
* 对象属性封装
* lhj
*/
var  $=function(){
	return document.getElementById?document.getElementById(arguments[0]):eval(arguments[0]);
};
var addOnloadEvent=function(func) {
	var oldOnload = window.onload;
	if(typeof oldOnload != "function") {
		window.onload = func;
	}
	else {
		window.onload = function() {
			oldOnload();
			func();
		}
	}
}

//取得外部class的属性值
var  getCurrentStyle=function(o) {
	if (o.currentStyle) {
		return o.currentStyle;
	}else {
		return document.defaultView.getComputedStyle(o,null);
	}
}

//取得第一个元素子节点

var  getFirstElementNode=function(o) {
	if(o.firstChild.nodeType == 1) {
		return o.firstChild;
	}
	if(o.firstChild.nextSibling.nodeType == 1) {
		return o.firstChild.nextSibling;
	}
	return null;
}

//将对象定时移动到某个位置

var  moveElement=function(elementID,final_x,final_y,interval,speed) {
	if(!$(elementID)) return false;
	var o = getFirstElementNode($(elementID));
	if(o.movement) {
		clearTimeout(o.movement);
	}
	var ypos = parseInt(o.style.marginTop);
	var xpos = parseInt(o.style.marginLeft);
	if(xpos == final_x && ypos == final_y) {
		return true;
	}
	if(xpos < final_x) {
		var dist = Math.ceil((final_x - xpos)/speed);
		xpos += dist;
	}
	if(xpos > final_x) {
		var dist = Math.ceil((xpos - final_x)/speed);
		xpos -= dist;
	}
	if(ypos < final_y) {
		var dist = Math.ceil((final_y - ypos)/speed);
		ypos += dist;
	}
	if(ypos > final_y) {
		var dist = Math.ceil((ypos - final_y)/speed);
		ypos -= dist;
	}
	o.style.marginLeft = xpos + "px";
	o.style.marginTop = ypos + "px";
	var again = "moveElement('" + elementID + "'," + final_x + "," + final_y + "," + interval + "," + speed + ")";
	o.movement = setTimeout(again,interval);
}

//对被移动对象的属性进行设置
var  positionMessage=function(oo,oWidth,x) {
	var o1 = getFirstElementNode($(oo));
	var oStyles = getCurrentStyle(o1);
	o1.style.marginLeft = oStyles.marginLeft;
	o1.style.marginTop = oStyles.marginTop;
	var xposNow = -oWidth*x;
	moveElement(oo,xposNow,0,10,12);
}



var Class = {
  create: function() {
	return function() {
	  this.initialize.apply(this, arguments);
	};
  }
};

Object.extend = function(destination, source) {
	for (var property in source) {
		destination[property] = source[property];
	}
	return destination;
};

//遍历集合对象
var  Each=function(list, fun){
		for (var i = 0, len = list.length; i < len; i++) { fun(list[i], i); }
};

//判断样式是否存在
var  hasClass=function(obj, cls) {  
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
}  
 // 为指定的dom元素添加样式
var addClass=function(obj, cls) {  
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;  
}  
 //删除指定dom元素的样式
var removeClass=function(obj, cls) {  
    if (hasClass(obj, cls)) {  
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');  
        obj.className = obj.className.replace(reg, ' ');  
    }  
}  
 //如果存在(不存在)，就删除(添加)一个样式 
var toggleClass=function(obj,cls){  
    if(hasClass(obj,cls)){  
        removeClass(obj, cls);  
    }else{  
        addClass(obj, cls);  
    }  
}  
  
var toggleClassTest=function(){  
    var obj = document. getElementById('test');  
    toggleClass(obj,"testClass");  
} 


//设置对象属性值
var  setObjAttr=function(attribute,objId,value){
	var obj=$(objId);
	switch (attribute){
		case "background": //设置背景图
			if(obj!=null){
				obj.style.background="url("+value+")";
			}
		break;
		case "innerHTML": //设置背景图
			if(obj!=null){
				obj.innerHTML=value;
			}
		break;
		case "font": //设置字体颜色
			if(obj!=null){
				obj.style.color=value;
			}
		break;
	}
}
//获取对象属性值
var getObjAttr=function(attribute,objId){
	var res;
	var obj=$(objId);
	switch (attribute){
		case "innerHTML": //获取div内容
			if(obj==null){
				res = null;
			}else{
				res = obj.innerHTML;
			}
		break;
		case "background": //获取div内容
			//res = obj.style.background-image;
		break;
		case "index": //获取div对象下标值
			var ind=0;
			if(objId !=null && objId!=""){
				if(objId.lastIndexOf("_")!=-1){
					ind = objId.substring(objId.lastIndexOf("_")+1,objId.length);
				}
			}
			res=parseInt(ind);
		break;
		case "prefix": //获取div对象下标值
			var st="";
			if(objId !=null && objId!=""){
				if(objId.lastIndexOf("_")!=-1){
					st = objId.substring(0,objId.lastIndexOf("_"));
				}else{
					st = objId;
				}
			}
			res=st;
		break;
	}
	return res;
}

/*
获取字符长度
*/
String.prototype.getBytesLength = function() {   
    var totalLength = 0;     
    var charCode;  
    for (var i = 0; i < this.length; i++) {  
        charCode = this.charCodeAt(i);  
        if (charCode < 0x007f)  {     
            totalLength++;     
        } else if ((0x0080 <= charCode) && (charCode <= 0x07ff))  {     
            totalLength += 2;     
        } else if ((0x0800 <= charCode) && (charCode <= 0xffff))  {     
            totalLength += 3;   
        } else{  
            totalLength += 4;   
        }          
    }  
    return totalLength;   
}  


/*iframe自适应高度*/
function SetWinHeight(obj){
	var win=obj;
	if (document.getElementById){
	if (win && !window.opera)
	{
		if (win.contentDocument && win.contentDocument.body.offsetHeight) 
			win.height = win.contentDocument.body.offsetHeight; 
		else if(win.Document && win.Document.body.scrollHeight)
			win.height = win.Document.body.scrollHeight;
		}
	}
}


/*
监听控制
*/
var addEventHandler=function(target, type, func) {
    if (target.addEventListener)
        target.addEventListener(type, func, false);
    else if (target.attachEvent)
        target.attachEvent("on" + type, func);
    else target["on" + type] = func;
}

var removeEventHandler=function(target, type, func) {
    if (target.removeEventListener)
        target.removeEventListener(type, func, false);
    else if (target.detachEvent)
        target.detachEvent("on" + type, func);
    else delete target["on" + type];
}
Array.prototype.baoremove = function(dx)
{
　　if(isNaN(dx)||dx>this.length){return false;}
　　this.splice(dx,1);
}
//判断指定值是否存在数组中
Array.prototype.Exists=function(v){var b=false;for(var i=0;i<this.length;i++){if(this[i]==v){b=true;break;}}return b;}



/*
追加
*/
function insertAfter( newElement, targetElement ){ // newElement是要追加的元素 targetElement 是指定元素的位置 
	var parent = targetElement.parentNode; // 找到指定元素的父节点 
	if( parent.lastChild == targetElement ){ // 判断指定元素的是否是节点中的最后一个位置 如果是的话就直接使用appendChild方法 
		parent.appendChild( newElement, targetElement ); 
	}else{ 
		parent.insertBefore( newElement, targetElement.nextSibling );
	};
}


//获取当前时间 hours:minutes
function getTimes(){
	var d=new Date();
	var add_zero=function(temp){
		if(temp<10) return "0"+temp;
		else return temp;
	}
	//setInterval(getTimes,100);
	var hours = add_zero(d.getHours());
	var minutes = add_zero(d.getMinutes());
	return hours+":"+minutes;
}


/*
获得给定的时间日期
*/
function getDateStr(){
	var date = new Date();
	return (parseInt(date.getMonth())+1)+"月"+parseInt(date.getDate())+"日";
}

/*
对图片预加载控制
*/
function loadImage(url, callback) {
    var img = new Image(); //创建一个Image对象，实现图片的预下载
     img.src = url;
  
    if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
         callback.call(img);
        return; // 直接返回，不用再处理onload事件
     }

     img.onload = function () { //图片下载完毕时异步调用callback函数。
         callback.call(img);//将回调函数的this替换为Image对象
     };
};