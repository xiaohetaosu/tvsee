var globalParams = {
	appList: ['','','','','','','',''],
	imgCount: 0,
	isFirstLoad: true,
	mediaDetailAjax: null,
	isParentFocus: false,
	payInfoAjaxObj: null
}
try {
   mediaPlayer.stop();
} catch(e) {}

function getCookie(c_name){
	if(document.cookie.length > 0){
  		c_start = document.cookie.indexOf(c_name + "=");
  		if (c_start != -1) { 
    		c_start = c_start + c_name.length + 1; 
    		c_end = document.cookie.indexOf(";", c_start);
   			if(c_end==-1){
				c_end=document.cookie.length;
			}
   		    return unescape(document.cookie.substring(c_start,c_end))
    	} 
  	}
	return "";
}
var imgPostionSize = 28;//图片移动放大尺寸
var focusPos = 1;
var videoPos = 0;//当前视频窗口位置
function getAppList(){
	if(typeof(mediaPlayer.playerType) != "undefined" && mediaPlayer.playerType == "ANDROID"){
		if(typeof(android_userAgent.getAppList) == "function"){
			globalParams.appList = eval("(" + android_userAgent.getAppList() + ").appList");
		}
	}
}
//判断包名是否存在  即已安装应用
function getAppIsInstall(_packName){
	getAppList(); //判断是否安装需要重新取得安装应用
	for(var i = 0; i < globalParams.appList.length; i++){
		if(globalParams.appList[i].packageName == _packName){
			return true;
			break;
		}	
	}
	return false;
}

function imgLoadFun(){
	if(globalParams.imgCount == parseInt(document.getElementsByTagName("reflect").length)){
		globalParams.isFirstLoad = false;
	}
	globalParams.imgCount++;
}
function intoPageInfo(){
	$("FRAME_FOCUS").className = "halation";
	setFocusMoveParams({isMoveAnimate:false});
	getAppList();
	initPageElement();
}

function initPageElement(){
	var display = "block";
	var iframeObj = null;
	var menuPos = 0;
	for(var i = 0; i < launcherMenus.length; i++){
		if(window.name == launcherMenus[i].iframeName){
			menuPos = i;
			break;
		}
	}
	var imgs = document.getElementById("content").getElementsByTagName("img");
	//var imgs = jQuery("#content").find("img");
	for(var i = 0;i < imgs.length; i++){
		if((imgs[i].getAttribute("id")).indexOf("img_") != -1){
			var picUrl = PUBLIC_VIDEO_PATH + imgs[i].getAttribute("imgad");
			if(picUrl.indexOf("http") == -1){
				if(picUrl.indexOf("upload") != -1){
					picUrl = PUBLIC_VIDEO_PATH + picUrl.substring((picUrl.indexOf("upload/") + 7),picUrl.length);
				}else{
					picUrl = PUBLIC_VIDEO_PATH + picUrl;
				}
			}
			imgs[i].src = picUrl;
			var index = parseInt(imgs[i].getAttribute("id").split("_")[1]);
			var title_0 = imgs[i].getAttribute("recommendtitle");
			var width = parseInt(imgs[i].width, 10);
			maxSize = Math.floor(width / 25) * 2;
			var title_1 = subStr(title_0, maxSize, "...");
			var titleBol=imgs[i].getAttribute("titleBol");
			var display = "block";
			if(titleBol=="false"){
				display = "none";
			}
			var parentDivObj = $("div_" + index);
			var divObj = document.createElement("div");
			divObj.id = "title_" + index;
			divObj.className = "tiltelCl titles_show";
			divObj.style.width = imgs[i].width + "px";
			divObj.style.display = display;
			divObj.setAttribute("h", "30");
			var spanObj =document.createElement("span");
			spanObj.style,color = "white";
			spanObj.id = "span_" + index;
			spanObj.setAttribute("remarks", title_0);
			spanObj.innerText = title_1;
			divObj.appendChild(spanObj);
			parentDivObj.appendChild(divObj);
			var obj = new setLoopClass({
				menuPos : menuPos + 1,
				index : index,
				ifram: window
			});
			obj.addLoopObj(obj, menuPos + 1);
			if(window.name == launcherMenus[0].iframeName){
				obj.startLoop();
			}
		}
	}
	tvsee.debug(window.name);
	if(window.name == "launcher_iframe_1"){
		parent.moveUD(1);	
	}
}

//设置元素属性值
function setElementAttribute(index,data){
	var imgObj = $("img_"+index);
	if(typeof(data.subhead) != "undefined"){
		$("span_"+index).setAttribute("remarks",data.subhead);
	}
	var parentNodeObj = $("span_"+index).parentNode;
	if(parentNodeObj != null){
		var width = parseInt(parentNodeObj.style.width, 10);
		maxSize = Math.floor(width / 25) * 2;
	}
	$("span_"+index).innerHTML = data.subhead;
	if(data.isSubhead == true || data.isSubhead == "true" || index == focusPos){
		if(globalParams.isParentFocus == false || parent.globalParams.isParentFocus == false){
			if(index == focusPos){
				clearMarqueeText("span_" + focusPos,data.subhead, 15);
				if(data.isSubhead == true || data.isSubhead == "true"){
					$("title_"+index).style.display = "block";
				}else{
					if(data.subhead != ""){
						$("title_"+index).style.display = "block";
					}else{
						$("title_"+index).style.display = "none";
					}
				}
				showMarqueeText("span_" + focusPos,data.subhead, 15);
			}
		}
		if(data.isSubhead == true || data.isSubhead == "true"){
			$("title_"+index).style.display = "block";
		}else{
			if(index == focusPos && data.subhead != "" && (globalParams.isParentFocus == false || parent.globalParams.isParentFocus == false)){
				$("title_"+index).style.display = "block";
			}else{
				$("title_"+index).style.display = "none";
			}
		}
	}else{
		$("title_"+index).style.display = "none";
	}
	if(data.fileType == "video"){//推荐视频
		var picUrl = PUBLIC_VIDEO_PATH + imgObj.getAttribute("imgad");
		imgObj.src = picUrl;
		imgObj.style.visibility = "visible";
		var playUrl = data.fileNames;
		var fileNames = playUrl.substring(0,(playUrl.indexOf("upload/") + 7));
		if(playUrl == fileNames){
			playUrl = "";
		}
		if(playUrl != ""){//后台推荐视频
			if(playUrl.indexOf("upload") != -1){
				playUrl = PUBLIC_VIDEO_PATH + playUrl.substring((playUrl.indexOf("upload/") + 7), playUrl.length);
			}
			var params = {};
			if(data.params != ""){
				params = eval("(" + data.params + ")");
			}
			setWinPlayerPostion(index);
			tvsee.pageWidgets.getByName("widgetLauncher").indexBackParams.videoPlayUrl = playUrl;
			winPlay(playUrl,true,params.isLoadPlay);
		}
	}else{//推荐图片
		var loopObj = getCurWinVideoObj();
		var picUrl = data.fileNames;
		if(typeof(picUrl == "undefined")){
			return;	
		}
		var fileNames = picUrl.substring(0,(picUrl.indexOf("upload/") + 7));
		if(picUrl == fileNames){
			picUrl="";
		}
		if(picUrl == ""){
			var picUrl = PUBLIC_VIDEO_PATH + imgObj.getAttribute("imgad");
		}else if(picUrl.indexOf("http")==-1){
			if(picUrl.indexOf("upload") != -1){
				picUrl = PUBLIC_VIDEO_PATH + picUrl.substring((picUrl.indexOf("upload/")+7),picUrl.length);
			}else{
				picUrl = PUBLIC_VIDEO_PATH + picUrl;
			}
		}
		imgObj.src = picUrl;
		imgObj.style.visibility = "visible";
	    if(data.serviceType == "app"){
			if(globalParams.appList.length > 0){
				var packageArr = data.packageName.split(",");
				var isShow = "hidden";
				if(getAppIsInstall(packageArr[0]) == true){// 已安装启动应用
					isShow = "visible";
				}
				if($("appInstall" + index) == null){
					var obj = $("img_" + index).parentNode;
					var imgObj = document.createElement("img");
					imgObj.setAttribute("width", "106");
					imgObj.setAttribute("height", "108");
					imgObj.setAttribute("id", "appInstall" + index);
					imgObj.setAttribute("src", "images/appInstall.png");
					imgObj.style.position = "absolute";
					imgObj.style.zIndex = 1;
					imgObj.style.border = "solid 0";
					imgObj.style.top = "1px";
					imgObj.style.left = "176px";
					imgObj.style.visibility = isShow;
					obj.appendChild(imgObj);
				}else{
					$("appInstall" + index).style.visibility = isShow;	
				}
			}
		}
	}
}
//设置文本移动控制
function showMarqueeText(id, title, size){
	if($(id) != null || $(id) != undefined){
		var parentNodeObj =  $(id).parentNode;
		if(parentNodeObj != null){
			var width = parseInt(parentNodeObj.style.width, 10);
			size = Math.floor((width - imgPostionSize)/ 25) * 2;
		}
		if(getCharByte(title) > size){
			this.marqueeMenuObj = new marqueeClass(id, title);
			this.marqueeMenuObj.scroll();
		}else{
			title = subStr(title, size, "...");	
			$(id).innerText = title;	
		}
	}
}
//清除文本移动效果
function clearMarqueeText(id,title,size){
	if(this.marqueeMenuObj != null){
		this.marqueeMenuObj.removeScroll();	
		this.marqueeMenuObj = null;
	}
	if($(id)!=null||$(id)!=undefined){
		var parentNodeObj =  $(id).parentNode;
		if(parentNodeObj != null){
			var width = parseInt(parentNodeObj.style.width, 10);
			size = Math.floor((width - imgPostionSize) / 25) * 2;
		}
		if(getCharByte(title) > size){
			title = subStr(title, size, "");	
			$(id).innerText = title;
		}
	}
}

//设置窗口大小
function setWinPlayerPostion(index){
	var imgObj = $("img_"+index);
	if(typeof(mediaPlayer)!="undefined"){
		imgObj.style.visibility = "hidden";
	}
	var left = parseInt(imgObj.x);
	var top = parseInt(imgObj.y);
	var width = parseInt(imgObj.getAttribute("width"));
	var height = parseInt(imgObj.getAttribute("height"));
	setCurPagePlayWinPos(index);
	try{
		parent.indexBackParams.videoTop = top;
		parent.indexBackParams.videoLeft = left;
		parent.indexBackParams.videoWidth = width;
		parent.indexBackParams.videoHeight = height;
		mediaPlayer.setPlayPostion(left,top,width,height);
	}catch(e){}
}

/*窗口播放*/
function winPlay(playUrl,isHttp,isLoadPlay,_timelength){
	tvsee.debug("窗口播放地址=="+playUrl);
	if(typeof(_timelength) != "undefined" && _timelength != 0){
		timelength = _timelength;
	}
	videoPos = focusPos;
	if(isFullScreen == true && isLoadPlay ==false){
	    isFullScreen = false;
		return;
	}
 	try{
 		if(playUrl != null && playUrl != ""){
	 		mediaPlayer.stop();
			mediaPlayer.setVideoScale(false);
			mediaPlayer.registerPlayerEvent("");
	 		if(isHttp){
	 			mediaPlayer.loadAndPlay(playUrl);
	 		}else{
	 			mediaPlayer.guidPlay(playUrl);
	 		}
 		}
 	}catch(e){}
}

//获取当前页面正在播放的视频窗口对象
function getCurWinVideoObj(){
	var loopObj = null;
	var hrClass = tvsee.eventFrame.globalCache.launcherRecomendClass;
	var menuPos = tvsee.pageWidgets.getByName("widgetLauncher").menuSelectPos;
	for(var i=0;i<hrClass.length;i++){
		if(hrClass[i].menuPos == menuPos){
			if(videoPos != 0){
				loopObj = getLoopObj(hrClass[i].videoPos);
				break;
			}
		}
	}
	return loopObj;
}

//轮循对象
function setLoopClass(_args){
	this.index = _args.index || '';//当前推荐位
	this.loopPos = 0;//当前轮循节目位置
	this.absTimeOut_1 = -1;//定时出现定时器
	this.absTimeOut_2 = -1;//定时出现定时器
	this.oppTimeOut = -1;//顺序轮循定时器
	this.win = _args.ifram || null;
	this.addLoopObj = function(obj, _menuPos){
		var count = 0;
		var hrClass = tvsee.eventFrame.globalCache.launcherRecomendClass;
		var menuPos = _menuPos;
		for(var i = 0;i < hrClass.length; i++){
			if(hrClass[i].menuPos == menuPos){
				count ++;
				var bol = true;
				var loopObjs = hrClass[i].loopObjs;
				for(var j=0;j<loopObjs.length;j++){
					if(loopObjs[j].index == this.index){
						bol = false;
						break;
					}
				}
				if(bol){
					loopObjs.push(obj);
					tvsee.eventFrame.globalCache.launcherRecomendClass[i].loopObjs = loopObjs;
				}
			}
		}
		if(count == 0){
			tvsee.eventFrame.globalCache.launcherRecomendClass.push({
				menuPos : menuPos,//当前首页位置
				videoPos : -1,//当前页面播放视频位置
				loopObjs: [obj]
			});
		}
	};
	//开始轮循
	this.startLoop = function(){
		var bol = false;
		var data = getDataJson(this.index);
		if(data.length == 1){//不轮循	
			setElementAttribute(this.index,data[0]);
			return;
		}
		for(var i=0;i<data.length;i++){
			//|| data[i].showType == "everyDay"
			if(data[i].showType == "period" || data[i].showType == "timing"){
				bol = true;
				break;
			}
		}
		if(bol){//启动定时轮循
			this.absLoopTimeout();
		}
		this.loopByOppTimes();//顺序轮循
	};
	//按定时出现
	this.loopByAbsTimes = function(){
		var tt = 0;
		var startSecond = 0;
		var data = getDataJson(this.index);
		for(var i = 0;i < data.length; i++){
			//定时出现一次
			if(data[i].showType != "everyDay"){
				tt = 0;
				if(data[i].showType == "period"){//周期轮循
					startSecond = new Date(data[i].showdate +" "+ data[i].startTime).getTime()/1000;
					tt = (TvseeDate.getTime() - startSecond);
				}else if(data[i].showType == "timing"){//定时播出
					startSecond = getSecond(data[i].startTime);
					if((86400 - startSecond) > data[i].lastTime){
						tt = getSecond(TvseeDate.getDate("hh:mm:ss")) - startSecond;
					}
				}
				if(tt >= 0 && tt <= data[i].lastTime){
					tt = parseInt(data[i].lastTime) - tt;
					this.loopPos = i;
					break;
				}
			}
		}
		if(tt > 0){
			//this.win.clearTimeout(this.oppTimeOut);
			this.win.clearInterval(this.absTimeOut_1);
			setElementAttribute(this.index,data[this.loopPos]);
			var self = this;
			this.absTimeOut_2 = self.win.setTimeout(function(){
				self.win.clearTimeout(self.absTimeOut_2);
				//self.win.loopByOppTimes();
				//self.win.absLoopTimeout();
			},tt*1000);
		}
	};
	//定时出现定时器
	this.absLoopTimeout = function(){
		var self = this;
		self.absTimeOut_1 = self.win.setInterval(function(){
			self.loopByAbsTimes();	
		},1000);
	}
	//顺序轮循
	this.loopByOppTimes = function(){
		var tt=0;
		var data = getDataJson(this.index);
		var pos = this.getLoopDataPos("cur");
		if(pos != -1){
			this.loopPos = pos;
			tt = data[this.loopPos].lastTime;
		}
		if(tt > 0){
			setElementAttribute(this.index,data[this.loopPos]);
			var self = this;
			this.oppTimeOut = self.win.setTimeout(function(){
				var _pos = self.getLoopDataPos("nxt");
				if(_pos != -1)self.loopPos = _pos;
				self.win.clearTimeout(self.oppTimeOut);
				self.loopByOppTimes();
			},tt*1000);
		}
	};
	this.getLoopDataPos = function(flag){
		var pos = -1;
		var data = getDataJson(this.index);
		var oppLoopData = new Array();
		for(var i=0;i<data.length;i++){
			if(data[i].showType == "everyDay"){
				if(pos<0)pos=i;
				oppLoopData.push(data[i]);
			}
		}
		if(flag == "cur"){//当前位置
			if(pos != -1){
				if(data[this.loopPos].showType == "everyDay"){
					if(data[pos].id != data[this.loopPos].id){
						pos = this.loopPos;
					}
				}else{
					this.getLoopDataPos("nxt");
				}
			}
		}else if(flag == "nxt"){//下一个位置
			var ii=-1;
			for(var i=0;i<oppLoopData.length;i++){
				if(oppLoopData[i].id==data[this.loopPos].id){
					ii = i;
					break;
				}
			}
			if(ii != -1){
				if((ii+1)<oppLoopData.length){
					ii += 1;
				}else {
					ii = 0;
				}
				for(var i=0;i<data.length;i++){
					if(data[i].id==oppLoopData[ii].id){
						pos = i;
						break;
					}
				}
			}
		}
		return pos;
	};
}

/*清空所有轮循定时器*/
function clearLoopTask(flag){
	var hrClass = tvsee.eventFrame.globalCache.launcherRecomendClass;
	var menuPos = tvsee.pageWidgets.getByName("widgetLauncher").menuSelectPos;
	for(var i=0;i<hrClass.length;i++){
		if(flag == 0){//清空当前页面定时器
			if(hrClass[i].menuPos == menuPos){
				var loopObjArr = hrClass[i].loopObjs;
				for(var j=0;j<loopObjArr.length;j++){
					loopObjArr[j].win.clearInterval(loopObjArr[j].absTimeOut_1);
					loopObjArr[j].win.clearTimeout(loopObjArr[j].absTimeOut_2);
					loopObjArr[j].win.clearTimeout(loopObjArr[j].oppTimeOut);
				}
			}
		}else{//清空其他首页定时器
			var loopObjArr = hrClass[i].loopObjs;
			for(var j=0;j<loopObjArr.length;j++){
				loopObjArr[j].win.clearInterval(loopObjArr[j].absTimeOut_1);
				loopObjArr[j].win.clearTimeout(loopObjArr[j].absTimeOut_2);
				loopObjArr[j].win.clearTimeout(loopObjArr[j].oppTimeOut);
			}
		}
	}
}
/*返回时启动轮循任务*/
function startLoopTask(){
	var widgetLauncher = tvsee.pageWidgets.getByName("widgetLauncher");
	var hrClass = tvsee.eventFrame.globalCache.launcherRecomendClass;
	var menuPos = widgetLauncher.menuSelectPos;
	for(var i = 0;i < hrClass.length;i++){
		if(hrClass[i].menuPos == menuPos){
			var loopObjArr = hrClass[i].loopObjs;
			for(var j = 0;j < loopObjArr.length;j++){
				loopObjArr[j].startLoop();
			}
		}
	}
//	if(widgetLauncher.globalParams.isParentFocus == false){
		widgetLauncher.frames[launcherMenus[menuPos - 1].iframeName].showImgTitle();
	//}
}

//获取Img中的dataJson数据
function getDataJson(index){
	var dataJson = [];
	var imgObj = $("img_" + index);
	if(imgObj == null)return;
	var datajson = imgObj.getAttribute("datajson");
	datajson = jsonFormat(datajson);
	if(datajson == null){
		return [];
	}
	var data=eval("("+datajson+")");
	if(data != null && typeof(data.list)!="undefined"){
		if(data.list !=null){
			dataJson = data.list;
		}
	}
	return dataJson;
}

//获取当前轮循对象
function getLoopObj(index){
	var loopObj = null;
	var hrClass = tvsee.eventFrame.globalCache.launcherRecomendClass;
	var menuPos = tvsee.pageWidgets.getByName("widgetLauncher").menuSelectPos;
	for(var i = 0 ;i < hrClass.length; i++){
		if(hrClass[i].menuPos == menuPos){
			var loopObjArr = hrClass[i].loopObjs;
			for(var j = 0;j < loopObjArr.length; j++){
				if(loopObjArr[j].index == index){
					loopObj = loopObjArr[j];
					break;
				}
			}
		}
	}
	return loopObj;
}

/*跳转电影或综艺详情页面*/
function gotoDetailPage(pid,type){
	if(pid == ""){
		return;
	}
	var goToUrl = "vodDetail.html?pid=" + pid;
	goToUrl += "&fromPage=LAUNCHER&windowSize=fullScreen";
	if(type == "variety"){//综艺详情页
		goToUrl = " vodVarietyDetailNew.html?pid=" + pid;
		goToUrl += "&fromPage=LAUNCHER&windowSize=fullScreen";
	}else if(type == "otherDetail"){
		goToUrl = " vodVarietyDetail.html?pid=" + pid;
		goToUrl += "&fromPage=LAUNCHER&windowSize=fullScreen";
	}
	hashtable.put("ratingsSource", 3);
	//goToUrl = "userManager_kunming.html";
	tvsee.pageWidgets.getByName("widgetLauncher").hideWin();
	gotoPageUrl(goToUrl);
}
//获取文件path
function getFilePath(data){
	var playUrl = data.fileNames;
	if(typeof(playUrl) == "undefined"){
		return "";	
	}
	var fileNames = playUrl.substring(0,(playUrl.indexOf("upload/")+7));
	if(playUrl == fileNames)playUrl="";
	return playUrl;
}

/*跳转栏目列表页面*/
//function gotoProgramListPage(cid,cname){
//	if(cid == ""){
//		return;
//	}
//	var widgetVodList = tvsee.pageWidgets.getByName("widgetVodList");
//	if(widgetVodList != null){
//		tvsee.pageWidgets.getByName("widgetLauncher").hideWin();
//		widgetVodList.show();
//		widgetVodList.initMenu(cid,cname, "LAUNCHER");
//	}
//}
function gotoProgramListPage(cid,cname){
	var saverstatus = tvsee.eventFrame.globalParams.globalCache.get("isSaverStatus");
	
	if (saverstatus == "true"){
		return 
	}else{
		
	}
	try{
		mediaPlayer.stop();
	}catch(e){}
	if(cid == ""){
		return
	}
	
	if(cid == 100033 || cid == 100035){
		var widgetVodList =tvsee.pageWidgets.getByName("widgetnewVodList");
		if(widgetVodList != null){
			tvsee.pageWidgets.getByName("widgetLauncher").hideWin();
			widgetVodList.show();
			widgetVodList.initMenu(cid, cname, "HOME");
		}
		return
	}
							if(cid == 1 ) {
								var saverClname = "电影";
								gotoProgramList(cid,saverClname)
								return
							}
							if(cid ==100035) {
								var saverClname = "天天童伴";
								gotoProgramList(cid,saverClname)
								return
							}
							if(cid == 2) {
								var saverClname = "电视剧";
								gotoProgramList(cid,saverClname)
								return
							}
							if(cid == 6) {
								var saverClname = "综艺";
								gotoProgramList(cid,saverClname)
								return
							}
							if(cid == 4) {
								var saverClname = "动漫";
								gotoProgramList(cid,saverClname)
								return
							}
							if(cid == 3) {
								var saverClname = "纪录片";
								gotoProgramList(cid,saverClname)
								return
							}
							if(cid == 15) {
								var saverClname = "少儿";
								gotoProgramList(cid,saverClname)
								return
							}
							if(cid == 100001) {
								var saverClname = "银河VIP";
								gotoProgramList(cid,saverClname)
								return
							}
							if(cid == 100004) {
								var saverClname = "精彩记录";
								gotoProgramList(cid,saverClname)
								return
							}
	if(cname == "专题"){
		var widgetSpecialList = tvsee.pageWidgets.getByName("widgetSpecialList");
		if(widgetSpecialList != null){
			tvsee.pageWidgets.getByName("widgetLauncher").hideWin();
			widgetSpecialList.show();
			widgetSpecialList.initData(cid,cname);
		}
	}else{
//		tvsee.pageWidgets.getByName("widgetVodList").minimize();
tvsee.pageWidgets.getByName("widgetLauncher").hideWin();
				var widgetRecVodList = tvsee.pageWidgets.getByName("widgetRecVodList");
				widgetRecVodList.initMenu(cid, cname, "LAUNCHER");
				widgetRecVodList.show();
	}
}
function gotoProgramList(cid,cname){
	          if(cid == ""){
		        return;
	            }
	          tvsee.pageWidgets.getByName("widgetLauncher").hideWin();
	     var widgetVodList = tvsee.pageWidgets.getByName("widgetVodList");
	        if(widgetVodList != null){
	        	if(typeof(CITY) != "undefined" && CITY == "kunming") {
	        		tvsee.pageWidgets.getByName("widgetLauncher").hideWin();
				}else{
					tvsee.pageWidgets.getByName("widgetMenu").hideWin();
				}
		           widgetVodList.show();
		        if(typeof(CITY) != "undefined" && CITY == "kunming") {
	        		widgetVodList.initMenu(cid,cname, "LAUNCHER");
				}else{
					widgetVodList.initMenu(cid,cname);
				}
	}
	        return
} 
/*页面跳转Action*/
function gotoPageAction(){
	var blo = tvsee.eventFrame.globalParams.globalCache.get("isSaverStatus");
	if (blo === 0 ){
			return
		}
	var data = getDataJson(focusPos);
	if(data.length == 1){//不轮循
		data = data[0];
	}else if(data.length > 1){
		var loopObj = getLoopObj(focusPos); 
		if(loopObj == null){
			return;
		}
		data = data[loopObj.loopPos];
	}else{
		return;
	}
	var isAuth = true;
	var filePath = getFilePath(data);
	switch (data.serviceType) {
		case "demand"://点播
			if(data.operateType == "detailed"){//电影详情
				gotoDetailPage(data.params.pid,'detailed');
			}else if(data.operateType == "variety"){//综艺详情
				gotoDetailPage(data.params.pid,'variety');
			}else if(data.operateType == "otherDetail"){
				gotoDetailPage(data.params.pid,'otherDetail');
			}else if(data.operateType == "column"){//列表
				if(typeof(data.params) == "object"){
					data = data.params;
				}else{
					var arr = data.params.split(",");	
					if(arr.length > 1){
						data.cid = arr[0];
						data.colName = arr[1];
					}
				}
				gotoProgramListPage(data.cid, data.colName);
			}else if(data.operateType == "play"){//播放
				var params = {};
				if(data.params != ""){
					params = eval("("+data.params+")");
				}
				if(filePath != "" && (params.isLoadPlay == false || params.isLoadPlay == "false")){
					isAuth = false;
				}
				vodPlayPage(isAuth, true, params.pid, params.guid);
			}else if(data.operateType == "vod"){
				var widgetMenu = tvsee.pageWidgets.getByName("widgetMenu"); 
				if(widgetMenu != null){
					tvsee.pageWidgets.getByName("widgetLauncher").hideWin();
					widgetMenu.showWin();
				}
			}
			break;
		case "expand"://扩展
			if(data.operateType == "search"){//搜索
				homeGotoUrl("search.html?words=" + data.params + "&fromPage=LAUNCHER");
			}else if(data.operateType == "URL"){
				if(data.params == "livePaychengdu_bs.html"){
					var widgetPayList = tvsee.pageWidgets.getByName("widgetPayList");
					if(widgetPayList != null){
						widgetPayList.show();
						widgetPayList.initData("LAUNCHER");
					}
					return;	
				}
				tvsee.pageWidgets.getByName("widgetLauncher").hideWin();
				var url = data.params;
				if(url.indexOf("?") != -1){
					url += "&fromPage=LAUNCHER";
				}else{
					url += "?fromPage=LAUNCHER";	
				}
				gotoPageUrl(data.params);
			}
			break;
		case "app": //推荐应用
			var packageArr = data.packageName.split(",");
			var otherParams = data.otherParams;
			if(otherParams == "" || otherParams == "null"){
				otherParams = null;
			}
			if(otherParams != null && otherParams == "applist"){
					try{
						mediaPlayer.stop();
					}catch(e){}
					if(typeof(mediaPlayer.playerType)!="undefined"){
						if(mediaPlayer.playerType == "ANDROID"){
							if(typeof(android_userAgent.getAppList) == "function"){
								var appListJsonObj = eval("(" + android_userAgent.getAppList() + ")");
								var index = null;
								for(var i = 0; i < APP_LIST_PACKAGE_ARR.length; i++){
									for(var j = 0; j < appListJsonObj.appList.length; j++){
										if(APP_LIST_PACKAGE_ARR[i].packageName == appListJsonObj.appList[j].packageName){
											index = i;
											break;	
										}
									}	
									if(index != null){
										break;	
									}
								}
								if(index != null){
									var obj = APP_LIST_PACKAGE_ARR[index];
									hashtable.put("operateObjType", 7);
									hashtable.put("operateObjName", obj.packageName);
									tvsee.eventFrame.saveLogUserActioncontent();
									android_userAgent.startApp(obj.packageName, obj.activityName, obj.params);	
									
								}
							}else{
								android_userAgent.startApp("com.konka.app", "com.konka.app.Allapp", "showType,0");
							}
						}
					}
					return;
			}
			if(data.operateType == "authentication"){
				/*var widgetDialog = tvsee.pageWidgets.getByName("widgetDialog");
				widgetDialog.initData(["是否下载当前应用?", 0], [["确认", "取消"], 0], function(_btnArea, _callParams){
						if(_btnArea == 0){
							gotoPageUrl();
						}
					}, appSiteArr);	
				widgetDialog.show();*/
				var payInfoData = tvsee.eventFrame.globalParams.globalCache.get("payInfo_CACHE");
				if(payInfoData == false){
					if(globalParams.payInfoAjaxObj !=  null){
						globalParams.payInfoAjaxObj.requestAbort();
					}
					globalParams.payInfoAjaxObj = new ajaxClass();
					globalParams.payInfoAjaxObj.frame = window;
					globalParams.payInfoAjaxObj.callbackParams = [data, packageArr, otherParams]
					globalParams.payInfoAjaxObj.url = getAjaxUrl("memberPayInfo");
					globalParams.payInfoAjaxObj.successCallback = function(_xmlHttp, _params) {
						eval("var data = (" + _xmlHttp.responseText + ")");
						tvsee.eventFrame.globalParams.globalCache.put("payInfo_CACHE", data);
						appAuth(_params[0], _params[1], _params[2], true);
					};
					globalParams.payInfoAjaxObj.failureCallback = function(_xmlHttp, _params) {
						
					};
					globalParams.payInfoAjaxObj.requestData();
					return;	
				} 
				appAuth(data, packageArr, otherParams, true);
				return;
			}
			appAuth(data, packageArr, otherParams, false);
		break;
	}
	if(globalParams.mediaDetailAjax != null){
		globalParams.mediaDetailAjax.requestAbort();	
	}
	clearLoopTask(0);
}

function appAuth(data, packageArr, otherParams, isAAA){
	if(isAAA == true){
		var json = getMemberPayStatus(data.params.serviceId.toString());
		var blo = tvsee.eventFrame.globalParams.globalCache.get("isSaverStatus");
		if (blo === 0 ){
			return
		}
   		if (SETCITY !="kunming"){
   			var test = data.params.serviceId.toString();
   			if(test == "type,huikan"){
   				otherParams = test;
   			}
   			hashtable.put("operateObjType", 7);
			hashtable.put("operateObjName", packageArr[0]);
			tvsee.eventFrame.saveLogUserActioncontent();
			android_userAgent.startApp(packageArr[0], packageArr[1], otherParams);
			otherParams = undefined;
   		}else{
   			var json = getMemberPayStatus(data.params.serviceId.toString());
   			if(json.status == false){
				var widgetLauncher = tvsee.pageWidgets.getByName("widgetLauncher");
				widgetLauncher.hideWin();
				gotoPageUrl("livePay.html");
				return
   			}
		}
	}
	if(getAppIsInstall(packageArr[0]) == true){// 已安装启动应用
		hashtable.put("operateObjType", 7);
		hashtable.put("operateObjName", packageArr[0]);
		tvsee.eventFrame.saveLogUserActioncontent();
		android_userAgent.startApp(packageArr[0], packageArr[1], otherParams);
	}else{
		var widgetDialog = tvsee.pageWidgets.getByName("widgetDialog");
//		if(widgetDialog != null){
			var appSiteArr = data.appSite.split(",");
//			widgetDialog.initData(function(_btnArea, _callParams){
//				if(_btnArea == 0){
					hashtable.put("operateObjType", 6);
//					hashtable.put("operateObjName", _callParams[1]);
					tvsee.eventFrame.saveLogUserActioncontent();
					android_userAgent.downloadApp(appSiteArr[0],data.packageName);
//				}
//			}, appSiteArr);	
//			widgetDialog.show();
//	 	}
	}
					
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
		exitAppTip();
	}
	return _eventObj.args.type;
}
function doSelect(){
	var blo = tvsee.eventFrame.globalParams.globalCache.get("isSaverStatus");
	if (blo === 0 ){
			return
		}
	var widgetLauncher = tvsee.pageWidgets.getByName("widgetLauncher");
	if(widgetLauncher.globalParams.isParentFocus == true){
		widgetLauncher.focus();
		return;
	}
	gotoPageAction();
}

function moveLR(_num){
	var widgetLauncher = tvsee.pageWidgets.getByName("widgetLauncher");
	if(widgetLauncher.globalParams.isParentFocus == true){
		widgetLauncher.focus();
		return;
	}
	var _focusPos = -1;
	if(_num == 1){
		_focusPos = getFocusObjId("right");
		if(_focusPos == -1){
			widgetLauncher.switchingPage(1);
			return;
		}
	}else{
		_focusPos = getFocusObjId("left");
		if(_focusPos == -1){
			widgetLauncher.switchingPage(-1);
			return;
		}
	}
	lostFocusStyle();
	focusPos = _focusPos;
	getFocusStyle();
	getFocus("img_" + focusPos);
}
function moveUD(_num){
	var widgetLauncher = tvsee.pageWidgets.getByName("widgetLauncher");
	if(widgetLauncher.globalParams.isParentFocus == true){
		widgetLauncher.focus();
		return;
	}
	var _focusPos = -1;
	if(_num == 1){
		_focusPos = getFocusObjId("down");
		if(_focusPos==-1){
			return;
		}
	}else{
		_focusPos = getFocusObjId("up");
		if(_focusPos == -1){
			return;
		}
		if(_focusPos == 0){
			parent.ifrFocusPos = focusPos;
			lostFocusStyle();
			hideFrame();
			widgetLauncher.getLauncherMenuFocus();
			widgetLauncher.focus();
			return;
		}
	}
	lostFocusStyle();
	focusPos = _focusPos;
	getFocusStyle();
	getFocus("img_"+focusPos);
}
function getFocusStyle(){
	var imgObj = $("img_" + focusPos);
	if(imgObj == null){
		return;
	}
	var loopObj = getLoopObj(focusPos);
	if(loopObj != null){
		var data = getDataJson(focusPos);
		if(data.length>0){
			data = data[loopObj.loopPos];
			if(data.serviceType == "function"){
				if(data.operateType == "dramaes" || data.operateType == "collect" ){
					var width = parseInt($("div_" + data.operateType).style.width);
					var height = parseInt($("div_" + data.operateType).style.height);
					var new_width = (width + imgPostionSize) + "px"
					var new_height = (height + imgPostionSize) + "px";
					$("div_"+ data.operateType).style.width = new_width + "px";
					$("div_"+ data.operateType).style.height = new_height + "px";
					//jQuery("#div_"+ data.operateType).css({"width": new_width,"height": new_height});		
				}	
			}else if(data.serviceType == "app"){
				if($("appInstall" + focusPos) != null){
					var width = parseInt($("appInstall" + focusPos).width);
			    	var height = parseInt($("appInstall" +focusPos).height);
					var new_width = (width + imgPostionSize) + "px"
			  		var new_height = (height + imgPostionSize) + "px";
				}
			  
			    //jQuery("#appInstall"+ focusPos).css({"width": new_width,"height": new_height});	
				if($("appInstall"+ data.operateType) != null){
					$("appInstall"+ data.operateType).style.width = new_width + "px";
					$("appInstall"+ data.operateType).style.height = new_height + "px";
				}
			}else if(data.isSubhead == false || data.isSubhead == "false"){
				var titles = $("span_" + focusPos).getAttribute("remarks");
				//jQuery("#span_"+focusPos).attr("remarks");
				if(titles != ""){
					$("title_" + focusPos).style.display = "block";	
				}else{
					$("title_" + focusPos).style.display = "none";		
				}
			}else if(data.isSubhead == true || data.isSubhead == "true"){
				var titles = $("span_" + focusPos).getAttribute("remarks");
				//jQuery("#span_"+focusPos).attr("remarks");
				if(titles != ""){
					$("title_" + focusPos).style.display = "block";	
				}
			}
		}
	}
	var imgWidth = parseInt(imgObj.getAttribute("wh").split("*")[0])+imgPostionSize;
	var imgHeight = parseInt(imgObj.getAttribute("wh").split("*")[1])+imgPostionSize;
	imgObj.setAttribute("width",imgWidth+"px");
	imgObj.setAttribute("height",imgHeight+"px");
	var divObj = $("div_"+focusPos);
	if(divObj == null){
		return;
	}
	var divLeft = divObj.style.left == "auto" ? 0 : divObj.style.left;//jQuery("#div_"+focusPos).css("left")=="auto"?0:jQuery("#div_"+focusPos).css("left");
	var divTop = divObj.style.top == "auto" ? 0 : divObj.style.top;//jQuery("#div_"+focusPos).css("top")=="auto"?0:jQuery("#div_"+focusPos).css("top");
	//jQuery("#div_"+focusPos).css({"width":imgWidth+"px","height":imgHeight+"px","display":"block","bottom":"-14px"});
	divObj.style.width = imgWidth + "px";
	divObj.style.height = imgHeight + "px";
	divObj.style.display = "block";
	divObj.style.bottom = "14px";
	//jQuery("#div_"+focusPos).find("canvas").css("width",imgWidth+"px");
	divObj.style.top = (parseInt(divTop)-imgPostionSize/2)+"px";
	divObj.style.left = (parseInt(divLeft)-imgPostionSize/2)+"px";
	divObj.style.zIndex = 10;//jQuery("#div_"+focusPos).css({"top":""+(parseInt(divTop)-imgPostionSize/2)+"px","left":""+(parseInt(divLeft)-imgPostionSize/2)+"px","z-index":10});
	$("title_" + focusPos).style.width = imgWidth + "px";
	//jQuery("#title_"+focusPos).css({"width":imgWidth});
	var titles = $("span_"+focusPos).getAttribute("remarks");//jQuery("#span_"+focusPos).attr("remarks");
	showMarqueeText("span_"+focusPos,titles, 15);
}

function showImgTitle(){
	var imgObj = $("img_" + focusPos);
	if(imgObj == null)return;
	var loopObj = getLoopObj(focusPos);
	if(loopObj != null){
		var data = getDataJson(focusPos);
		var data = getDataJson(focusPos);
		if(data.length > 0){
			var titles =  $("span_" + focusPos).getAttribute("remarks");//jQuery("#span_"+focusPos).attr("remarks");
			if(titles != ""){// && (data.isSubhead == true || data.isSubhead == "true")
				$("title_" + focusPos).style.display = "block";	
			}else{
				$("title_" + focusPos).style.display = "none";		
			}
		}
	}
	var imgWidth = parseInt(imgObj.getAttribute("wh").split("*")[0])+imgPostionSize;
	$("title_" + focusPos).style.width = imgWidth + "px";
	//jQuery("#title_"+focusPos).css({"width":imgWidth});
	var titles = $("span_" + focusPos).getAttribute("remarks");//jQuery("#span_"+focusPos).attr("remarks");
	clearMarqueeText("span_"+focusPos,titles, 15);
	showMarqueeText("span_"+focusPos,titles, 15);
}

function lostFocusStyle(){
	var titles = $("span_" + focusPos).getAttribute("remarks");//jQuery("#span_"+focusPos).attr("remarks");
	clearMarqueeText("span_" + focusPos,titles,15);
	var imgObj = $("img_"+focusPos);
	if(imgObj == null){
		return;
	}
	var loopObj = getLoopObj(focusPos);
	if(loopObj != null){
		var data = getDataJson(focusPos);
		if(data.length > 0){
			data = data[loopObj.loopPos];
			if(data.fileType == "video"){
				return;
				var left = parseInt(imgObj.x)+1;
				var top = parseInt(imgObj.y);
				try{
					mediaPlayer.setPlayPostion(left,top,imgWidth,imgHeight);
				}catch(e){}
			}else if(data.serviceType == "function"){
				if(data.operateType == "dramaes" ||data.operateType == "collect" ){
					var width = parseInt($("div_" + data.operateType).style.width);
					var height = parseInt($("div_" + data.operateType).style.height);
					var new_width = (width - imgPostionSize) + "px"
					var new_height = (height - imgPostionSize) + "px";
					$("div_"+ data.operateType).style.width = new_width + "px";
					$("div_"+ data.operateType).style.height = new_height + "px";
					//jQuery("#div_"+ data.operateType).css({"width": new_width,"height": new_height});
				}	
			}else if(data.serviceType == "app"){
				if($("appInstall" + focusPos) != null){
					var width = parseInt($("appInstall" + focusPos).width);
					var height = parseInt($("appInstall" +focusPos).height);
					var new_width = (width - imgPostionSize) + "px"
					var new_height = (height - imgPostionSize) + "px";
					$("appInstall"+ focusPos).style.width = new_width + "px";
					$("appInstall"+ focusPos).style.height = new_height + "px";
				}
			    //jQuery("#appInstall"+ focusPos).css({"width": new_width,"height": new_height});	
			}else if(data.isSubhead == false || data.isSubhead == "false"){
				$("title_" + focusPos).style.display = "none";	
			}
		}
	}
	var imgWidth = parseInt(imgObj.getAttribute("wh").split("*")[0]);
	var imgHeight = parseInt(imgObj.getAttribute("wh").split("*")[1]);
	imgObj.setAttribute("width",imgWidth+"px");
	imgObj.setAttribute("height",imgHeight+"px");
	var divObj = $("div_"+focusPos);
	if(divObj == null)return;
	var divLeft = divObj.style.left == "auto" ? 0 : divObj.style.left;     //jQuery("#div_"+focusPos).css("left")=="auto"?0:jQuery("#div_"+focusPos).css("left");
	var divTop = divObj.style.top == "auto" ? 0 : divObj.style.top;//jQuery("#div_"+focusPos).css("top")=="auto"?0:jQuery("#div_"+focusPos).css("top");
	divObj.style.width = imgWidth + "px";
	divObj.style.height = imgHeight + "px";
	divObj.style.display = "block";
	divObj.style.bottom = "0px";
	//jQuery("#div_"+focusPos).css({"width":imgWidth+"px","height":imgHeight+"px","display":"block","bottom":"0px"});
	//jQuery("#div_"+focusPos).find("canvas").css("width",imgWidth+"px");
	divObj.style.top = (parseInt(divTop)+imgPostionSize/2) + "px";
	divObj.style.left = (parseInt(divLeft)+imgPostionSize/2) + "px";
	divObj.style.zIndex = 9;
		  //jQuery("#div_"+focusPos).css({"top":""+(parseInt(divTop)+imgPostionSize/2)+"px","left":""+(parseInt(divLeft)+imgPostionSize/2)+"px","z-index":9});
	$("title_" + focusPos).style.width = imgWidth + "px";//({"width":imgWidth});
	//jQuery("#title_"+focusPos).css({"width":imgWidth});
	
}
function getFocusObjId(movie){
	var _focusPos = 0;
	var imgObj = $("img_"+focusPos);
	var _focusPos = imgObj.getAttribute(movie);
	if(_focusPos == null || _focusPos == "")return -1;
	if(_focusPos == 0 && movie != "up")return -1;
	if(movie != "up" && $("img_"+_focusPos) == null)return -1;
	return _focusPos;
}
function getFocus(objId){
	if($(objId) != null){
		drawFrame(objId);
	}
}

function jsonFormat(datajson){
	if(datajson==null || datajson == ""){
		return null;
	}
	if(datajson.indexOf("'serviceType':'app'") != -1){
		datajson = datajson.replace("'serviceType':'app'", "'serviceType':'app','params':''");
	}/*else if(datajson.indexOf("'params':'{}'") != -1){
		datajson = datajson.replace("'params':'{}'", "'params':''");	
	}*/
	return datajson;
	datajson = datajson.replace("{'list':[","");
	datajson = datajson.replace("]}","");
	var jsonArray=datajson.split("},");
	var newList="",test_1="",test_2="",v_2="";
	for(var i=0;i<jsonArray.length;i++){
		if(jsonArray[i].indexOf("'params':'{")==-1){
			 test_1=jsonArray[i].split("'params':");
			 v_2=test_1[1];
		}else{
			 test_1=jsonArray[i].split("'params':'{");
			 test_2=test_1[1].split("}'");
			 var v_1=test_2[0].replaceAll("'","\""); 
			 v_2="'{"+v_1+"}'"+test_2[1];
		}
		
		if(i==jsonArray.length-1){
			newList+=test_1[0]+"'params':"+v_2;	
		}else{
			newList+=test_1[0]+"'params':"+v_2+"},";		
		}
	}
	return "{'list':["+newList+"]}";
}
