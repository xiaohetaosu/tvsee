document.write("<div id='FRAME_FOCUS' style='z-index: 9999; position: absolute; display: none; width: 0px; height: 0px;'></div>");
//-webkit-transition-duration:500ms;
//var isMove = false;
var globalFocusMoveParams = {
    borderSelected: "3px solid #90EF01",
    borderValue: 3,
    backgroundImage: "",
    isMoveAnimate: true,
    isBorder: false,
    //不是设置body颜色，即处理背景图片移动
    duration: "200ms"
}

function setFocusStyleBorder(borderSelected){
	globalFocusMoveParams.borderSelected = borderSelected;
	 setFocusMoveParams({isBorder: true});
}

function setFocusMoveAnimate(statue){
	 setFocusMoveParams({isMoveAnimate: statue});
}

function setFocusMoveParams(_args) {
    globalFocusMoveParams.borderSelected = typeof(_args.borderSelected) == "undefined" ? globalFocusMoveParams.borderSelected : _args.borderSelected;
    globalFocusMoveParams.borderValue = typeof(_args.borderValue) == "undefined" ? globalFocusMoveParams.borderValue : _args.borderValue;
    globalFocusMoveParams.backgroundImage = typeof(_args.backgroundImage) ==  "undefined" ? globalFocusMoveParams.backgroundImage : _args.backgroundImage;
    globalFocusMoveParams.isMoveAnimate = typeof(_args.isMoveAnimate) == "undefined" ? globalFocusMoveParams.isMoveAnimate : _args.isMoveAnimate;
    globalFocusMoveParams.isBorder = typeof(_args.isBorder) == "undefined" ? globalFocusMoveParams.isBorder : _args.isBorder;
    globalFocusMoveParams.duration = typeof(_args.duration) == "undefined" ?  globalFocusMoveParams.duration : globalFocusMoveParams.duration;
	if(document.getElementById("FRAME_FOCUS").innerHTML != ""){
		document.getElementById("FRAME_FOCUS").innerHTML = "";
	}
    if (globalFocusMoveParams.isBorder == true) {
        document.getElementById("FRAME_FOCUS").style.backgroundImage = "none";
		
        document.getElementById("FRAME_FOCUS").style.border = globalFocusMoveParams.borderSelected;
    } else {
        document.getElementById("FRAME_FOCUS").style.border = "";
        document.getElementById("FRAME_FOCUS").style.backgroundImage = "url(" + globalFocusMoveParams.backgroundImage + ")";
    }
    if (globalFocusMoveParams.isMoveAnimate == true) {
        document.getElementById("FRAME_FOCUS").style.webkitTransitionDuration = globalFocusMoveParams.duration;
    } else {
        document.getElementById("FRAME_FOCUS").style.webkitTransitionDuration = "0ms";
    }
    
    if(typeof(_args.width) != "undefined"){ 
		document.getElementById("FRAME_FOCUS").style.width = _args.width+"px";
	}
	if(typeof(_args.height) != "undefined"){
		document.getElementById("FRAME_FOCUS").style.height = _args.height+"px";
	}
	if(typeof(_args.left) != "undefined"){
		document.getElementById("FRAME_FOCUS").style.left = _args.left+"px";
	}
	if(typeof(_args.top) != "undefined"){
		document.getElementById("FRAME_FOCUS").style.top = _args.top+"px";
	}
}

function setFocusMoveFont(_args){
	document.getElementById("FRAME_FOCUS").style.color = _args.color;
	document.getElementById("FRAME_FOCUS").style.fontSize = _args.fontSize;
	document.getElementById("FRAME_FOCUS").style.lineHeight = _args.lineHeight;
	document.getElementById("FRAME_FOCUS").style.textAlign = _args.textAlign;
}

function setFocusMoveText(_text){
	document.getElementById("FRAME_FOCUS").innerHTML = _text;	
}

function drawFrame(objId) {
    divClone = document.getElementById(objId);
    if (divClone == null) {
        return;
    }
	
  //  gCurObjId = objId;
    divClone = document.getElementById(objId);
    oDiv = document.getElementById("FRAME_FOCUS");
    //oDiv.style.border=borderSelected;
    oDiv.style.display = "block";
    oDiv.style.zIndex = 9999;
    /*if(isMove){
		$("#FRAME_FOCUS").animate({opacity: "1",height: divClone.clientHeight + 0,width: divClone.clientWidth + 0}, 1);
	}else{*/
    //}

    if(globalFocusMoveParams.isBorder == true) {
        //oDiv.style.width=(divClone.clientWidth-2)+"px";
        //oDiv.style.height=(divClone.clientHeight-2)+"px";
        oDiv.style.width = (divClone.clientWidth - Math.ceil(globalFocusMoveParams.borderValue / 2)) + "px";
        oDiv.style.height = (divClone.clientHeight - Math.ceil(globalFocusMoveParams.borderValue / 2 )) + "px";
        //oDiv.style.width=(divClone.clientWidth-2 + 10)+"px";
        //oDiv.style.height=(divClone.clientHeight-2 + 10)+"px";
    }else {
        oDiv.style.width = (divClone.clientWidth) + "px";
        oDiv.style.height = (divClone.clientHeight) + "px";
    }

    var nowLeft = parseInt(getObjLeft(oDiv));
    var nowTop = parseInt(getObjTop(oDiv));
    var aimLeft = parseInt(getObjLeft(divClone));
    var aimTop = parseInt(getObjTop(divClone));
    moveSize = Math.ceil(Math.max(Math.abs(nowLeft - aimLeft), Math.abs(nowTop - aimTop)) / 5);
    move(aimLeft, aimTop);
    /*if(isMove){
		move1(aimLeft, aimTop);
	}else{
		move(aimLeft, aimTop);
	}*/
}
function move(aimLeft, aimTop) {
    var nowLeft = parseInt(getObjLeft(oDiv));
    var nowTop = parseInt(getObjTop(oDiv));
    if (globalFocusMoveParams.isBorder == true) {
        //oDiv.style.left = (getObjLeft(divClone)-3)+"px";
        //oDiv.style.top = (getObjTop(divClone)-3)+"px";
        oDiv.style.left = (getObjLeft(divClone) - Math.floor(globalFocusMoveParams.borderValue / 2)) + "px";
        oDiv.style.top = (getObjTop(divClone) - Math.floor(globalFocusMoveParams.borderValue / 2)) + "px";
    } else {
        oDiv.style.left = (getObjLeft(divClone)) + "px";
        oDiv.style.top = (getObjTop(divClone)) + "px";
    }
}

function move1(aimLeft, aimTop) {
    var nowLeft = parseInt(getObjLeft(oDiv));
    var nowTop = parseInt(getObjTop(oDiv));
    if (nowLeft > aimLeft + moveSize || nowLeft < aimLeft - moveSize || nowTop > aimTop + moveSize || nowTop < aimTop - moveSize) {
        oDiv.style.left = aimLeft > nowLeft + moveSize ? (nowLeft + moveSize) + "px": aimLeft < nowLeft - moveSize ? (nowLeft - moveSize) + "px": nowLeft + "px";
        oDiv.style.top = aimTop > nowTop + moveSize ? (nowTop + moveSize) + "px": aimTop < nowTop - moveSize ? (nowTop - moveSize) + "px": nowTop + "px";
        oTime = setTimeout("move(" + aimLeft + ", " + aimTop + ")", 1);
    } else {
        oDiv.style.left = (getObjLeft(divClone) - 3) + "px";
        oDiv.style.top = (getObjTop(divClone) - 3) + "px";

    }
}

function getObjTop(obj) {
    var vTop1 = obj.offsetTop;
    var vLeft1 = obj.offsetLeft;
    var pObj;
    pObj = obj;
    do {
        pObj = pObj.offsetParent;
        vTop1 = vTop1 + pObj.offsetTop;
        vLeft1 = vLeft1 + pObj.offsetLeft;
    } while ( pObj . tagName != "BODY");
    return vTop1;
}

function getObjLeft(obj) {
    var vTop1 = obj.offsetTop;
    var vLeft1 = obj.offsetLeft;
    var pObj;
    pObj = obj;
    do {
        pObj = pObj.offsetParent;
        vTop1 = vTop1 + pObj.offsetTop;
        vLeft1 = vLeft1 + pObj.offsetLeft;
    } while ( pObj . tagName != "BODY");
    return vLeft1;
}

function setHaveBorderFocus(borderSize){
	var divFocusObj = document.getElementById("FRAME_FOCUS");
	var width = parseInt(divFocusObj.style.width, 10);
	var height = parseInt(divFocusObj.style.height, 10);
	var top = parseInt(divFocusObj.style.top, 10);
	var left = parseInt(divFocusObj.style.left, 10);
	divFocusObj.style.width = (width + Math.ceil(borderSize / 2)) + "px";
	divFocusObj.style.height = (height + Math.ceil(borderSize / 2)) + "px";
	divFocusObj.style.left = (left + Math.floor(borderSize / 2)) + "px";
	divFocusObj.style.top = (top + Math.floor(borderSize / 2)) + "px";
	
}
/*function isInArray(vObj, vObjArray){
	for (var i=0; i<vObjArray.length; i=i+1) {
		if (vObj.toUpperCase()==vObjArray[i].toUpperCase()){ 
			return i;
		}
	}
	return -1;
}*/
function hideFrame() {
    document.getElementById("FRAME_FOCUS").style.display = "none";
}
function showFrame(){
	document.getElementById("FRAME_FOCUS").style.display = "block";	
}
function getFrameId(){
	return "FRAME_FOCUS";	
}

/* Modify bobo on 2014-02-28 for GITV */
//setFocusStyleBorder("3px solid #ef7e04");//#90EF01
//setFocusStyleBorder("3px solid #C0F954");//#90EF01
setFocusStyleBorder(FOCUS_STYLE.BORDER);
