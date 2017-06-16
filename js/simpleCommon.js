var gCurObjId = "";
var marqueeObj = null;
//var backUrl = "";
function deal_number(){
	
}
function deal_up(){
	keyEventAuto("upmove");	
}
function deal_down(){
	keyEventAuto("downmove");	
}
function deal_left(){
	keyEventAuto("leftmove");
}
function deal_right(){
	keyEventAuto("rightmove");	
}
function deal_return(){
	keyEventAuto("action");		
}
function deal_exit(){
	
}
function deal_back(){
	/*if(typeof(backUrl) == "undefined"){
		
		parent.showDetails.hideDetails();
		return;
	}else{
		window.location.href = backUrl;
		return;	
	}*/
	if(mediaPlayer.playerType == "ANDROID" && IS_BACK_EXIT == true){
		android_userAgent.exit();
	}
	return;
	if(fromPage == "HOME"){
		window.location.href = "../home/index.html";
	}else if(fromPage == "LIST"){
		parent.showDetails.hideDetails();	
	}else if(fromPage == "SEARCH"){
		window.location.href = "../../search.html";	
	}
	return;
	if(backUrl != ""){
		if(typeof(loader) == "object"){
			if(typeof(loader.backward) == "function"){
				loader.backward(1);	
			}
		}	
		return;
	}
	window.location.href = backUrl;
}
function deal_menu(){
	
}
function deal_volume_up(){
	
}
function deal_volume_down(){
	
}
function deal_pause(){
	
}
function deal_play(){

}
function deal_seek_left(){
	
}
function deal_seek_right(){
	
}
function keyEventAuto(_vDir){
    if (typeof(gCurObjId) == "undefined" || gCurObjId == "") {
        return;
    }

    var curObj = document.getElementById(gCurObjId);
	if(curObj == null){
		return;
	}
    var nextObjId = curObj.getAttribute(_vDir);
	if (nextObjId == null || nextObjId == "" || nextObjId == "#") {
        return;
    }
	//loseFocus(gCurObjId);
    var arrObjId = nextObjId.split(";"); /* 处理多个操作定义 */
    for (var i = 0; i < arrObjId.length; i = i + 1) {
        if (arrObjId[i].length > 2 && arrObjId[i].substr(0, 1) == "#") {
            var vFunc = arrObjId[i].substr(1, arrObjId[i].length - 1);
            eval(vFunc);
        } else {
			if(_vDir == "action"){
				window.location.href = arrObjId[i];
			}else{
			    var obj = document.getElementById(arrObjId[i]);
				if(obj!=null){
					loseFocus(gCurObjId);
					getFocus(arrObjId[i]);
				}
			}
        }
    }
}

/*
getFocusCallback  //得到焦点后回调的方法,不当当要改变自身属性，需要改变其他的对象属性时候用
loseFocusCallback //失去焦点后回调的方法
getFocusStyle //得到得到后，文本的样式，包含div里面嵌套的DIV,必须嵌套的是地  {'font': '22','color': }
loseFocusStyle //失去焦点后,恢复文本的样式，如果自身没有设置，将恢复成之前的
getFocusPic //得到焦点后，本身对象的背景图片，包含div里面嵌套的DIV  注意:嵌套的DIV必须包含此属性值才可以
loseFocusPic //失去焦点后,背景图片改为什么图片
getFocusBorder  //得到焦点边框样式
loseFocusBorder  //失去焦点边框样式
scrollText //滚动文本的内容
noScrollText //不滚动的内容
getFocusClass //得到焦点className样式
loseFocusClass //失去焦点className样式
*/
function loseFocus(_objId){
	var curObj = document.getElementById(_objId);
	loseFocusStyle(curObj);
	var divArr = curObj.getElementsByTagName("div");
	if(divArr.length > 0){
		for(var i = 0; i < divArr.length; i++){
			loseFocusStyle(divArr[i]);
		}	
	}
}

function loseFocusStyle(_obj){
	var loseFocusCallback = _obj.getAttribute("loseFocusCallback");
	var loseFocusStyle = _obj.getAttribute("loseFocusStyle");
	var loseFocusPic = _obj.getAttribute("loseFocusPic");
	var noScrollText = _obj.getAttribute("noScrollText");
	var loseFocusBorder = _obj.getAttribute("loseFocusBorder");
	var loseFocusClass = _obj.getAttribute("loseFocusClass");
	if(loseFocusStyle != null && loseFocusStyle != "" && loseFocusStyle != "#"){
		var _json = eval("(" + loseFocusStyle + ")");
		for(var attr in _json){
			if(typeof(_obj.style[attr]) != "undefined"){
				_obj.style[attr] = _json[attr];
			}
		}
	}
	if(loseFocusClass != null && loseFocusClass != "" && loseFocusClass != "#"){
		_obj.className = loseFocusClass;
	}
	if(loseFocusBorder != null && loseFocusBorder != "" && loseFocusBorder != "#"){
		//curObj.style.border = loseFocusBorder;
		hideFrame();
	}
	if(loseFocusCallback != null && loseFocusCallback != "" && loseFocusCallback != "#"){
		eval(loseFocusCallback);
	}
	if(noScrollText != null && noScrollText != "" && noScrollText != "#"){
		if(marqueeObj != null){
			marqueeObj.removeScroll();	
			_obj.innerText = noScrollText;
		}	
	}
	if(loseFocusPic != null && loseFocusPic != "" && loseFocusPic != "#"){
		_obj.style.backgroundImage = "url(" + loseFocusPic + ")";
	}	
}
function getFocus(_objId){
	var focusObjId = document.getElementById(_objId);
	getFocusStyle(focusObjId);
	var focusChlidsDiv = focusObjId.getElementsByTagName("div");
	if(focusChlidsDiv.length > 0){
		for(var i = 0; i < focusChlidsDiv.length; i++){
			getFocusStyle(focusChlidsDiv[i]);
		}	
	}
	gCurObjId = _objId;	
}
/*
getFocusCallback  //得到焦点后回调的方法,不当当要改变自身属性，需要改变其他的对象属性时候用
loseFocusCallback //失去焦点后回调的方法
getFocusStyle //得到得到后，文本的样式，包含div里面嵌套的DIV,必须嵌套的是地  {'font': '22','color': }
loseFocusStyle //失去焦点后,恢复文本的样式，如果自身没有设置，将恢复成之前的
getFocusPic //得到焦点后，本身对象的背景图片，包含div里面嵌套的DIV  注意:嵌套的DIV必须包含此属性值才可以
loseFocusPic //失去焦点后,背景图片改为什么图片
getFocusBorder  //得到焦点边框样式
loseFocusBorder  //失去焦点边框样式
scrollText //滚动文本的内容
noScrollText //不滚动的内容

getFocusClass  //得到焦点设置样式
loseFocusClass //失去焦点设置样式
*/
function getFocusStyle(_obj){
	var getFocusCallback = _obj.getAttribute("getFocusCallback");
	var getFocusStyle = _obj.getAttribute("getFocusStyle");
	var getFocusPic = _obj.getAttribute("getFocusPic");
	var scrollText = _obj.getAttribute("scrollText");
	var getFocusBorder = _obj.getAttribute("getFocusBorder");
	var getFocusClass = _obj.getAttribute("getFocusClass");
	if(getFocusClass != null && getFocusClass != "" && getFocusClass != "#"){
		var loseFocusClass = _obj.getAttribute("loseFocusClass");
		if(loseFocusClass == null || loseFocusClass == "" || loseFocusClass == "#"){
			_obj.setAttribute("loseFocusClass", _obj.className);
		}	
		_obj.className = getFocusClass;
	}
	if(getFocusStyle != null && getFocusStyle != "" && getFocusStyle != "#"){
		var _json = eval("(" + getFocusStyle + ")");
		for(var attr in _json){
			if(typeof(_obj.style[attr]) != "undefined"){
				_obj.style[attr] = _json[attr];
			}
		}
	}
	//这里可以什么都不需要处理
	if(getFocusBorder != null && getFocusBorder != "" && getFocusBorder != "#"){
		drawFrame(_obj.id);
	}
	if(getFocusCallback != null && getFocusCallback != "" && getFocusCallback != "#"){
		eval(getFocusCallback);
	}
	if(scrollText != null && scrollText != "" && scrollText != "#"){
		marqueeObj = new marqueeClass(_obj.id, scrollText);
		marqueeObj.scroll();	
	}
	if(getFocusPic != null && getFocusPic != "" && getFocusPic != "#"){
		_obj.style.backgroundImage = "url(" + getFocusPic + ")";
	}		
}
/*
	getFocusCallback  //得到焦点后回调的方法,不当当要改变自身属性，需要改变其他的对象属性时候用
	loseFocusCallback //失去焦点后回调的方法
	getFocusTextStyle //得到得到后，文本的样式，包含div里面嵌套的DIV,必须嵌套的是地
	loseFocusTextStyle //失去焦点后,恢复文本的样式，如果自身没有设置，将恢复成之前的
	getFocusPic //得到焦点后，本身对象的背景图片，包含div里面嵌套的DIV  注意:嵌套的DIV必须包含此属性值才可以
	loseFocusPic //失去焦点后,背景图片改为什么图片
	getFocusBorder  //得到焦点边框样式
	loseFocusBorder  //失去焦点边框样式
	scrollText //滚动文本的内容
	noScrollText //不滚动的内容
	isGetFocusShow //得到焦点显示
	isLoseFocusHidden // 失去焦点隐藏
*/
