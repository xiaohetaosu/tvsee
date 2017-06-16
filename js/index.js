this.focusDirection=true;//焦点位置，默认在菜单
/*
初始首页
*/
var menuLeft = 170;//菜单left单位距离
//var displayMenuCount = 5;//显示菜单个数
var menuSelectPos = 1;//选中菜单默认位置
var menuFocusPos = 1;//焦点菜单位置
var menuIndex = 0;//菜单滑动下标
var menuTimeOut = -1;//菜单切换定时器
var menuTimes = 3000;//焦点移到菜单上3秒执行确认键
var ifrFocusPos = 1; //记录子页面的焦点
var backLunBoCid = "";  //备份菜单轮播页面
var lunBoInterval = -1;
var historyChannelList = []; //历史频道对象储存
var menuGetTimeout = -1;
var indexBackParams = {
	videoTop: 0,
	videoLeft: 0,
	videoWidth: 0,
	videoHeight: 0,
	videoPlayUrl: '',
	cid: -1,
	fromPage: ''
}
function resetBackParams(){
	indexBackParams.cid = -1;	
	indexBackParams.fromPage = "";
}
function setBackHomeParams(_args){
	indexBackParams.cid = _args.cid || -1;	
	indexBackParams.fromPage = _args.fromPage || "";	
}
//初始化首页
function intoHome(){
	if(focusDirection){
		hashtable.put("pageName", 1);
		hashtable.put("professionType", 1);
		tvsee.eventFrame.saveLogUserActioncontent();
		initMenus();
	}
}
//初始化菜单
function initMenus(){
	var display;
	$("div_imtems").style.width = displayMenuCount*menuLeft+"px";
	$("div_imtems").style.left = ((1280-displayMenuCount*menuLeft)/2)+"px";
	for(var i=0;i<menus.length;i++){
		display = "none";
		if(i < displayMenuCount){
			jQuery("#div_imtems").append("<div class='menus menus_nosel' id='menu_"+(i+1)+"' style='left:"+(i*menuLeft)+"px;'>"+menus[i].name+"</div>");
		}
		if(i==0){
			display = "block";
			getMenuFocusStyle("menu_" + (i+1));
			jQuery("#div_iframes").append("<iframe id=child_iframe_"+(i+1)+" name='child_iframe_"+(i+1)+"' width='1280px' height='720px' frameBorder='0' scrolling='0' src='"+menus[i].src+"' style='display:"+display+"'></iframe>");
		}
		jQuery("#page_bg").append("<img id='bgimg_"+(i+1)+"' src='images/home/"+menus[i].bgimg+"' style='position:absolute;left:0px;top:0px;width:1280px;height:720px;display:"+display+";z-index:-1;'>");
	}
	this.focus();
}

function eventHandler(_eventObj){ 
	if(_eventObj.code == "KEY_DOWN"){
		moveUD(1);	
	}else if(_eventObj.code == "KEY_UP"){
		moveUD(-1);	
	}else if(_eventObj.code == "KEY_SELECT"){
		doSelect(); 
	}else if(_eventObj.code == "KEY_LEFT"){
		moveLR(-1);
	}else if(_eventObj.code == "KEY_RIGHT"){
		moveLR(1);
	}else if(_eventObj.code == "KEY_BACK"){
		var wigetLauncher = tvsee.pageWidgets.getByName("widgetLauncher");
		
		try{
			mediaPlayer.stop();
		}catch(e){
		}
		if(wigetLauncher != null){
			hideWin();
			wigetLauncher.showWin();
		}else{
			exitAppTip();	
		}
	}
}

function mediaPlayerListeren(_state, _param){
	if(_state == 3){//开始播放
		if(timelength > 0){
			mediaPlayer.seek(timelength);
		}
		$("img_1").style.visibility = "hidden";
		return ;
	}else if(_state == 1){//播放结束
		try{
			mediaPlayer.stop();
		}catch(e){}
		if(lunBoPlayUrl != ""){
			var imgObj = $("img_1");
			if(imgObj != null){
				imgObj.src="images/play/interlude.jpg";
				imgObj.style.visibility = "visible";
			}
			
			var lunBoData = false;//tvsee.eventFrame.globalParams.globalCache.get("luoBoChannelList_CACHE");
			if(lunBoData == false){
				getLunBoChannel({'catalogid' : lunBoCid}, function(params, data){
					playEndLunBoPlay(data);
					//globalParams.isLunBoUpdateing == false;
				});
			}else{
				var linearProgramList = getLunBoProgramList(lunBoData, cid);
				if(linearProgramList != null){
					playEndLunBoPlay(linearProgramList);
				}	
			}
			
		}else{
			if(parent.indexBackParams.videoPlayUrl != "" && parent.indexBackParams.videoWidth != 0 && parent.indexBackParams.videoHeight != 0){
				mediaPlayer.setPlayPostion(parent.indexBackParams.videoLeft, parent.indexBackParams.videoTop, parent.indexBackParams.videoWidth, parent.indexBackParams.videoHeight);
				mediaPlayer.registerPlayerEvent("");
				mediaPlayer.loadAndPlay(parent.indexBackParams.videoPlayUrl);
			}else{
		 		setElementAttribute(loopObj.index, data[this.loopPos]);
			}
		}
		return ;
	}
	
	var loopObj = getCurWinVideoObj();
	var data  = null;
	if(loopObj != null && parent.indexBackParams.videoPlayUrl == ""){
		data  = loopObj.loopData(loopObj.loopPos);
	}
	switch(_state){
		 case 1:  //播放结束
			mediaPlayer.stop();
			if(parent.indexBackParams.videoPlayUrl != "" && parent.indexBackParams.videoWidth != 0 && parent.indexBackParams.videoHeight != 0){
				mediaPlayer.setPlayPostion(parent.indexBackParams.videoLeft, parent.indexBackParams.videoTop, parent.indexBackParams.videoWidth, parent.indexBackParams.videoHeight);
				mediaPlayer.registerPlayerEvent("");
				mediaPlayer.loadAndPlay(parent.indexBackParams.videoPlayUrl);
			}else{
		 		setElementAttribute(loopObj.index, data[this.loopPos]);
			}
		 	
		 break;
		 case 100: //缓冲开始
		 	//$("img_"+loopObj.index).style.visibility = "visible";
		 break;
		 case 101://缓冲结束
		 break;
		 case 102:  //缓冲进度
		 break;
		 case 400://播放错误
		 case 408:
		 case 401:
		 break;
		 case 103://缓冲下载速度
		 break;	
		 case 3: //开始播放
		 	$("img_"+loopObj.index).style.visibility = "hidden";
			if(parent.indexBackParams.videoWidth != 0 && parent.indexBackParams.videoHeight != 0){
				mediaPlayer.setPlayPostion(parent.indexBackParams.videoLeft, parent.indexBackParams.videoTop, parent.indexBackParams.videoWidth, parent.indexBackParams.videoHeight);
			}
		 break;
	}	
}
function doSelect(){
	if(menuSelectPos == (menuFocusPos+menuIndex)){
		return;
	}
	indexBackParams.videoPlayUrl = "";
	for(var i=1;i<=displayMenuCount;i++){
		if(i != menuFocusPos){
			lostMenuFocusStyle("menu_"+i);
		}
	}
	$("bgimg_"+menuSelectPos).style.display = "none";
	var ifrObj=document.getElementById("child_iframe_"+menuSelectPos);
	if(ifrObj != null){
		ifrObj.style.display = "none";
	}
	getMenuFocusStyle("menu_" + menuFocusPos);
	menuSelectPos = menuFocusPos+menuIndex;
	$("bgimg_"+menuSelectPos).style.display = "block";
	ifrObj=document.getElementById("child_iframe_"+menuSelectPos);
	window.clearTimeout(menuGetTimeout);
	clearInterval(lunBoInterval);
	if(ifrObj == null){
		checkIframeLoadSuccess();
	}else{
		if(tvsee.eventFrame.globalCache.homeMenus[menuFocusPos - 1].isLoading == true){
			ifrObj.style.display = "block";
			startTimer(ifrObj);
			ifrFocusPos = 1;
		}else{
			checkIframeLoadSuccess();	
		}
	}
}

function checkIframeLoadSuccess(){
	var ifrObj = document.getElementById("child_iframe_" + menuSelectPos);
	tvsee.debug("ifrObj:" + ifrObj + "isLoading:" + tvsee.eventFrame.globalCache.homeMenus[menuFocusPos - 1].isLoading);
	if(ifrObj != null && tvsee.eventFrame.globalCache.homeMenus[menuFocusPos - 1].isLoading == true){
		ifrObj.style.display = "block";
		startTimer(ifrObj);
		ifrFocusPos = 1;	
	}else{
		menuGetTimeout = setTimeout("checkIframeLoadSuccess()", 100);
	}
}
function startTimer(ifrObj){
	try{
		mediaPlayer.stop();
	}catch(e){}
	ifrObj = ifrObj.contentWindow;
	ifrObj.clearLoopTask(1);
	var hrClass = tvsee.eventFrame.globalCache.homeRecomendClass;
	try{
		for(var i=0;i<hrClass.length;i++){
			if(hrClass[i].menuPos == menuSelectPos){
				var loopObjArr = hrClass[i].loopObjs;
				for(var j=0;j<loopObjArr.length;j++){
					loopObjArr[j].loopPos = 0;
					loopObjArr[j].startLoop();
				}
			}
		}
	}catch(e){}
	if(menus[menuSelectPos - 1].name == SPEC_CATALOG_NAME.HOME_MENU_NAME){
		getChannelHistoryData();
	}
}

function moveLR(_num){
	if(globalParams.isParentFocus == false){
		window.frames["child_iframe_"+menuSelectPos].focus();
		return;	
	}
	var curFocusPos = menuFocusPos;
	if((curFocusPos == 1 && _num == -1) || (curFocusPos == displayMenuCount && _num == 1)){
		if((curFocusPos+menuIndex) == 1){//向左滑动
			return;
		}else if((curFocusPos+menuIndex) == menus.length){//向右滑动
			return;
		}
		var k = 1;
		if(_num == -1)menuIndex--;
		if(_num == 1)menuIndex++;
		for(var i=menuIndex;i<menus.length;i++){
			if(k > displayMenuCount)break;
			lostMenuFocusStyle("menu_" + k);
			$("menu_" + k).innerHTML = menus[i].name;
			if((i+1) == menuSelectPos){
				selectMenuFocusStyle("menu_"+k);
			}
			k++;
		}
		getMenuFocusStyle("menu_" + menuFocusPos);
	}else{
		curFocusPos += _num;
		lostMenuFocusStyle("menu_" + menuFocusPos);
		if((menuFocusPos+menuIndex) == menuSelectPos){
			selectMenuFocusStyle("menu_"+menuFocusPos);
		}
		getMenuFocusStyle("menu_" + curFocusPos);
		menuFocusPos = curFocusPos;
	}
	resetBackParams();
	menuAction();
}
function menuAction(){
	clearTimeout(menuTimeOut);
	menuTimeOut = setTimeout(function(){
		doSelect();
	},menuTimes);
} 

function moveUD(_num){
	if(_num < 0){
		return;	
	}
	if(globalParams.isParentFocus == false){
		window.frames["child_iframe_"+menuSelectPos].focus();
		return;	
	}
	var ifrObj=document.getElementById("child_iframe_" + menuSelectPos);
	if(ifrObj != null && ifrObj.contentWindow.isFirstLoad==true){
		return;
	}
	if(menuFocusPos != menuSelectPos){
		clearTimeout(menuTimeOut);
	}
	
	var ifrObj= window.frames["child_iframe_"+menuSelectPos]//document.getElementById("child_iframe_"+menuSelectPos);
	if(ifrObj == null)return;
	ifrObj.focusPos = ifrFocusPos;
	var imgObj = ifrObj.document.getElementById("img_"+ifrObj.focusPos);
	if(imgObj == null)return;
	if((menuFocusPos+menuIndex) == menuSelectPos){
		selectMenuFocusStyle("menu_"+menuFocusPos);
	}else{
		lostMenuFocusStyle("menu_"+menuFocusPos);
	}
	globalParams.isParentFocus = false;
	globalParams.ifrChildName = "child_iframe_"+menuSelectPos;
	//ifrObj = ifrObj.contentWindow;
	
	
	ifrObj.getFocusStyle();
	var left = imgObj.x;
	var top = imgObj.y;
	var width = parseInt(imgObj.getAttribute("width"));
	var height = parseInt(imgObj.getAttribute("height"));
	ifrObj.$("FRAME_FOCUS").className = "halation";
	ifrObj.setFocusMoveParams({isMoveAnimate:false,left:left,top:top,width:width,height:height});
	ifrObj.showFrame();
	ifrObj.getFocus("img_"+ifrObj.focusPos);
	ifrObj.focus();
}

function lostMenuFocusStyle(id){
	$(id).className = "menus menus_nosel";
	//#898989
	jQuery("#"+id).css({"color":'white'});
}
function selectMenuFocusStyle(id){
	$(id).className = "menus menus_sel";
	jQuery("#"+id).css({"color":FOCUS_STYLE.COLOR});
}
function getMenuFocusStyle(id){
	$(id).className = "menus menus_over";
	jQuery("#"+id).css({"color":'#FFFFFF'});
}

var globalParams = {
	isParentFocus: true,
	ifrChildName: null
}
function showWin(){
	tvsee.pageWidgets.getByName("widgetMenu").show();
	tvsee.pageWidgets.getByName("widgetMenu").startLoopTask();
	if(globalParams.isParentFocus == false){
		var iframe_child = document.getElementById("child_iframe_" + menuSelectPos).contentWindow;
		iframe_child.focus();
	}
	hashtable.put("pageName", 1);
	tvsee.eventFrame.saveLogUserActioncontent();
	if(globalParams.isParentFocus == false){
		window.frames[globalParams.ifrChildName].focus();	
	}
}
function hideWin(){
	tvsee.pageWidgets.getByName("widgetMenu").minimize();	
	
}
//天气预报
function weather(){
	return;
	var url = parent.getAjaxUrl("getWeather");
	doAjax(url, null,function(data, status) {
		if (status == "success") {
			if(data.weather!=null){
				if(typeof(data.weather.weather) == "undefined"){
					return;
				}
				$("weather").innerHTML=data.weather.weather+"  "+data.weather.temperature;
				$("wimg").innerHTML='<img id="tqPicur" src="'+data.weather.picur+'" width="58px",height="55px" />';
			}else{
				$("tqPicur").src="";
				$("weather").innerHTML="";
			}
		}
	});
}
//日期时间
function showTime(){
	$("times").innerHTML = TvseeDate.getDate("hh:mm");
	$("dates").innerHTML = TvseeDate.getWeek()[0][2] + " " + TvseeDate.getWeek()[0][1];
}
setInterval(showTime, 60000);
