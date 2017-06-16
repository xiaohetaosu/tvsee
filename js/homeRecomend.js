/*设置轮循图片或视频*/
var lunBoCid = "";//轮播频道id
var lunBoTimeOut = -1;
function setLoopClass(_args){
	this.index = _args.index || '';//当前推荐位
	this.loopPos = 0;//当前轮循节目位置
	this.absTimeOut_1 = -1;//定时出现定时器
	this.absTimeOut_2 = -1;//定时出现定时器
	this.oppTimeOut = -1;//顺序轮循定时器
	this.win = _args.ifram || null;
	this.addLoopObj = function(obj){
		var count = 0;
		var hrClass = tvsee.eventFrame.globalCache.homeRecomendClass;
		for(var i=0;i<hrClass.length;i++){
			if(hrClass[i].menuPos == parent.fatherMeunIndex){
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
					tvsee.eventFrame.globalCache.homeRecomendClass[i].loopObjs = loopObjs;
				}
			}
		}
		if(count == 0){
			tvsee.eventFrame.globalCache.homeRecomendClass.push({
				menuPos : parent.fatherMeunIndex,//当前首页位置
				videoPos : -1,//当前页面播放视频位置
				isFullScreen : false,//是否全屏
				loopObjs: [obj]
			});
		}
	};
	//开始轮循
	this.startLoop = function(){
		var bol = false;
		initModelData(this.index);
		var data = getDataJson(this.index);
		if(data.length == 0){
			return;
		}else if(data.length==1){
			return;
		}
		for(var i=0;i<data.length;i++){
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
		var dateData = null;
		var data = getDataJson(this.index);
		for(var i=0;i<data.length;i++){
			//定时出现一次
			dateData = tvsee.eventFrame.globalParams.globalCache.get("lastWeekDate_CACHE");
			if(data[i].showType != "everyDay" && dateData != false){
				tt = 0;
				if(data[i].showType == "period"){//周期轮循
					startSecond = new Date(data[i].showdate +" "+ data[i].startTime).getTime()/1000;
					tt = (dateData.timestamp - startSecond);
				}else if(data[i].showType == "timing"){//定时播出
					startSecond = getSecond(data[i].startTime);
					if((86400-startSecond) > data[i].lastTime){
						tt = getSecond(dateData.time) - startSecond;
					}
				}
				if(tt >= 0 && tt <= data[i].lastTime){
					tt = parseInt(data[i].lastTime)-tt;
					this.loopPos = i;
					break;
				}
			}
		}
		if(tt > 0){
			this.win.clearTimeout(this.oppTimeOut);
			this.win.clearInterval(this.absTimeOut_1);
			initModelData(this.index);
			var self = this;
			this.absTimeOut_2 = self.win.setTimeout(function(){
				self.win.clearTimeout(self.absTimeOut_2);
				self.win.loopByOppTimes();
				self.win.absLoopTimeout();
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
			initModelData(this.index);
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
//获取Img中的dataJson数据
function getDataJson(index){
	var dataJson = [];
	var imgObj = $("img_"+index);
	if(imgObj == null)return;
	console.log(imgObj.getAttribute("datajson"));
	var datajson = imgObj.getAttribute("datajson");
	var data=eval("("+imgObj.getAttribute("datajson")+")");
	if(data != null && typeof(data.list)!="undefined"){
		if(data.list !=null){
			dataJson = data.list;
		}
	}
	return dataJson;
}
function initModelData(index){
	var loopObj = getLoopObj(index);
	if(loopObj == null)return;
	var data = getDataJson(index);
	if(data.length>0){
		data = data[loopObj.loopPos];
	}else{
		return;
	}
	var imgObj = $("img_"+index);
	var maxSize=15;//滚动最大字数控制
	if(data.isSubhead){
		$("title_"+index).style.display = "block";
	}else{
		$("title_"+index).style.display = "none";
	}
	$("span_"+index).setAttribute("remarks",data.subhead);
	$("span_"+index).innerHTML = subStr(data.subhead, maxSize, "...");
	if(data.fileType == "video"){
		try{
			mediaPlayer.stop();
		}catch(e){}
		var picUrl = PUBLIC_VIDEO_PATH+imgObj.getAttribute("imgad");
		imgObj.src = picUrl;
		imgObj.style.visibility = "visible";
		var playUrl = data.fileNames;
		var fileNames = picUrl.substring(0,(picUrl.indexOf("upload/")+7));
		if(playUrl == fileNames)playUrl="";
		if(playUrl != ""){
			if(playUrl.indexOf("upload") != -1){
				playUrl = PUBLIC_VIDEO_PATH+playUrl.substring((playUrl.indexOf("upload/")+7),playUrl.length);
			}
			winPlay(index,playUrl,true);
		}else if(data.operateType == "play"){
			if(data.serviceType == "demand"){
				initVodData(data.params,index);
			}else if(data.serviceType == "lookBack"){
				var params = eval("("+data.params+")");
				initWatchTvData(params.cid,params.mid,params.date,index);
			}else if(data.serviceType == "direct"){
				initDirectData(data.params,index);
			}else if(data.serviceType == "carousel"){
				loopPlayChannel(data.showType,data.params,index,function(channel,index){
					getDirectPlayURl(channel,index);
				});
			}
		}
	}else{
		try{
			mediaPlayer.stop();
		}catch(e){}
		var picUrl = data.fileNames;
		var fileNames = picUrl.substring(0,(picUrl.indexOf("upload/")+7));
		if(picUrl == fileNames)picUrl="";
		if(picUrl == ""){
			var picUrl = PUBLIC_VIDEO_PATH+imgObj.getAttribute("imgad");
		}else if(picUrl.indexOf("http")==-1){
			if(picUrl.indexOf("upload") != -1){
				picUrl = PUBLIC_VIDEO_PATH+picUrl.substring((picUrl.indexOf("upload/")+7),picUrl.length);
			}else{
				picUrl = PUBLIC_VIDEO_PATH+picUrl;
			}
		}
		imgObj.src = picUrl;
		imgObj.style.visibility = "visible";
		if(data.serviceType == "expand"){//扩展
			if(data.operateType == "newest"){//最近更新
				var value = tvsee.eventFrame.globalParams.globalCache.get("newOnlinePrograms");
				if(value == false){
					var url = parent.getAjaxUrl("getNewOnlinePrograms",20);
					tvsee.debug("最近更新信息"+url);
					doAjax(url, null,function(data, status) {
						if (status == "success") {
							if(data.programs!=null){
								tvsee.eventFrame.globalParams.globalCache.put("newOnlinePrograms",data.programs);
								imgObj.src = PICURL+data.programs[0].picurl;
							};
						}
					})
				}else{
					imgObj.src = PICURL+value[0].picurl;
				}
			}else if(data.operateType == "channelDetailed"){//历史频道
				var value = tvsee.eventFrame.globalParams.globalCache.get("lastWatchTvChannel_CACHE");
				if(value == false){
					var url=getAjaxUrl("getLastWatchTvChannel");
					console.log("历史频道数据url:"+url);
					doAjax(url, null,function(data, status) {
						if (status == "success") {
							tvsee.eventFrame.globalParams.globalCache.put("lastWatchTvChannel_CACHE", data.lastWatchTvChannel);
							watchTvHistoryChannel(data.lastWatchTvChannel);
						}
					});
				}else{
					watchTvHistoryChannel(value);
				}
			}
		}else if(data.serviceType == "carousel"){//轮播
			if(data.operateType == "detailed"){//详情节目单
				var width=$("img_"+index).getAttribute("width");
				var height=$("img_"+index).getAttribute("height");
				if($("movieList") == null){
					jQuery("#div_"+index).append("<div id='movieList' style='position:absolute;width:"+width+"px;height:"+height+"px;left:0px;top:0px;z-index:3;display:block;'></div>");
				}
				loopPlayChannel(data.showType,data.params,index,function(channel,index){
					getLiveListByCid(channel.catalogid,index);
				});
			}
		}
	}
	imgObj.setAttribute("action","#gotoPageAction("+index+")");
}
/*页面跳转Action*/
function gotoPageAction(index){
	var loopObj = getLoopObj(index);
	if(loopObj == null)return;
	var data = getDataJson(index);
	if(data.length>0){
		data = data[loopObj.loopPos]
	}else{
		return;
	}
	switch (data.serviceType) {
		case "demand"://点播
			if(data.operateType == "detailed"){//电影详情
				gotoDetailPage(data.params,'detailed');
			}else if(data.operateType == "variety"){//综艺详情
				gotoDetailPage(data.params,'variety');
			}else if(data.operateType == "column"){//列表
				gotoProgramListPage(data.params,data.subhead);
			}else if(data.operateType == "play"){//播放
				var params = eval("("+data.params+")");
				vodPlayPage(params.pid,params.isLoadPlay);
				setCurPagePlayWinPos(index,true);
			}
			break;
		case "lookBack"://回看
			if(data.operateType == "detailed"){//详情
				homeGotoUrl("watchTv.html?cid="+data.params);
			}else if(data.operateType == "column"){//列表
				homeGotoUrl("watchTv.html?cid=all");
			}else if(data.operateType == "play"){//播放
				var params = eval("("+data.params+")");
				directAndWatchTvPlayPage(data.fileType,0,params.cid,params.mid,params.playDate,data.isLoadPlay);
				setCurPagePlayWinPos(index,true);
			}
			break;
		case "direct"://直播
			if(data.operateType == "detailed"){//详情
				homeGotoUrl("watchTv.html?cid="+data.params);
			}else if(data.operateType == "column"){//列表
				homeGotoUrl("watchTv.html?cid=all");
			}else if(data.operateType == "play"){//播放
				var params = eval("("+data.params+")");
				directAndWatchTvPlayPage(data.fileType,1,params.cid,"","",params.isLoadPlay);
				setCurPagePlayWinPos(index,true);
			}
			break;
		case "carousel"://轮播
			if(data.operateType == "detailed"){//详情
				directAndWatchTvPlayPage(data.fileType,1,lunBoCid,"","",params.isLoadPlay);
			}else if(data.operateType == "column"){//列表
				homeGotoUrl("watchTv.html?cid=all");
			}else if(data.operateType == "play"){//播放
				var params = eval("("+data.params+")");
				directAndWatchTvPlayPage(data.fileType,1,params.cid,"","",params.isLoadPlay);
				setCurPagePlayWinPos(index,true);
			}else if(data.operateType == "home"){//首页窗口播放
				lunBoCid = data.params;
				loopPlayChannel(data.showType,lunBoCid,index,function(channel,index){
					getLiveListByCid(channel.catalogid,index);
					var videoPos = getCurWinVideoObj();
					getDirectPlayURl(channel,videoPos);
				});
			}
			break;
		case "function"://系统功能
			if(data.operateType == "dramaes"){//我的追剧
				homeGotoUrl("addTVList.html");
			}else if(data.operateType == "collect"){//我的收藏
				homeGotoUrl("favoriteList.html");
			}else if(data.operateType == "histroy"){//观看历史
				homeGotoUrl("recordList.html");
			}else if(data.operateType == "interact"){//系统设置
				top.triscreenFrame.init3ScreenPage(); 
				top.remotePlayStatus = 2;
				top.document.getElementById("rootDiv").style.display="none";
				top.document.getElementById("div_3screen").style.display="block";
			}else if(data.operateType == "install"){//三屏互动
				if(typeof(mediaPlayer.playerType)!="undefined"){
					if(mediaPlayer.playerType == "ANDROID"){
						android_userAgent.startApp("com.android.settings","com.android.settings.Settings");
					}
				}
			}
			break;
		case "expand"://扩展
			if(data.operateType == "newest"){//最近更新
				homeGotoUrl("recentlyUpdatedList.html?windowSize=fullScreen");
			}else if(data.operateType == "special"){//专题
				
			}else if(data.operateType == "search"){//搜索
				homeGotoUrl("search.html?words="+data.params);
			}else if(data.operateType == "channelDetailed"){//频道详情
				
			}else if(data.operateType == "URL"){//url跳转
				homeGotoUrl(url)
			}
			break;
	}
	clearLoopTask(0);
}
/*首页URL跳转*/
function homeGotoUrl(url){
	tvsee.pageWidgets.getByName("widgetMenu").hideWin();
	gotoPageUrl(url);
}

/*回看直播播全屏播放页面*/
function directAndWatchTvPlayPage(fileType,type,cid,mid,date,isLoadPlay){
	//isLoadPlay true全屏后需要重新加载播放地址， false全屏后继续播当前视频,只是窗口全屏
	var widgetVodPlay = tvsee.pageWidgets.getByName("widgetVodPlay");
	if(widgetVodPlay != null){
		try{
			if(!isLoadPlay){
				mediaPlayer.stop();
			}
			mediaPlayer.setFullScreen();
		}catch(e){}
		//widgetPlay(_cid, _type, _fromPage, _mid, _date, _playUrl, _timelength ,_episode, _pid, _lastTimelength, _movieName, _isHttp, _moviePic,isLoadPlay)
		widgetVodPlay.widgetPlay(cid, type, "HOMEPLAY", mid, date, "", 0, 0, 0, '', '','true', '',isLoadPlay);
		if(getLoopObj() != null){
			getLoopObj().isFullScreen = true;
		}
		tvsee.pageWidgets.getByName("widgetMenu").hideWin();
		widgetVodPlay.show();
	}
}
/*跳转点播全屏播放页面*/
function vodPlayPage(pid,isLoadPlay){
	if(pid == "")return;
	if(!isLoadPlay){
		try{
			mediaPlayer.stop();
		}catch(e){}
	}
	var value = tvsee.eventFrame.globalParams.globalCache.get("movieDetail_" + pid);	
	if(value==null || value == false){
		var url = parent.getAjaxUrl("mediaDetail",pid);
		doAjax(url, null,function(data, status) {
			if (status == "success") {
				tvsee.eventFrame.globalParams.globalCache.put("movieDetail_" + pid, data);
				openVodPlay(true,isLoadPlay);
			}
		})
	}else{
		openVodPlay(true,isLoadPlay);
	}
}
/*点播全屏播放*/
function openVodPlay(isAuth,isLoadPlay){
	var value = tvsee.eventFrame.globalParams.globalCache.get("movieDetail_" + pid);
	if(value == false){
		return;
	}
	var moviesData = value.movies;
	if(isAuth==true && ISAAA == true){//业务认证
		var widgetAuthOrDed = tvsee.pageWidgets.getByName("widgetAuthOrDed");
		widgetAuthOrDed.show();
		var winObj = tvsee.pageWidgets.getByName("widgetMenu");
		var callMethod = "openVodPlay(false)";
		widgetAuthOrDed.initData({guid: moviesData[0].guid, ppvid: moviesData[0].tag, movieName: moviesData[0].moviename}, callMethod, winObj, "home");
		return;
	}
	/*var url = "vodPlay.html?fromPage=HOME&isHttp=false&pid=" + moviesData[0].pid;
	url += "&playUrl=" + moviesData[0].guid + "&timelength=" + moviesData[0].timelength + "&lastTimelength=0";
	url += "&movieName=" + moviesData[0].moviename + "&moviePic=" + moviesData[0].moviepicurl + "&episode=0";
	tvsee.pageWidgets.getByName("widgetMenu").hideWin();
	try{
		mediaPlayer.stop();
		mediaPlayer.setFullScreen();
	}catch(e){}
	gotoPageUrl(url);*/
	var widgetVodPlay = tvsee.pageWidgets.getByName("widgetVodPlay");
	if(widgetVodPlay != null){
		var isHttp = true;
		try{
			if(isLoadPlay){
				isHttp = false;
				mediaPlayer.stop();
			}
			mediaPlayer.setFullScreen();
		}catch(e){}
		//widgetPlay(_cid, _type, _fromPage, _mid, _date, _playUrl, _timelength ,_episode, _pid, _lastTimelength, _movieName, _isHttp, _moviePic)
		widgetVodPlay.widgetPlay("", "", "HOMEPLAY", "", "", moviesData[0].guid, moviesData[0].timelength, 0, moviesData[0].pid, 0, moviesData[0].moviename,isHttp, moviesData[0].moviepicurl,isLoadPlay);
		if(getLoopObj() != null){
			getLoopObj().isFullScreen = true;
		}
		tvsee.pageWidgets.getByName("widgetMenu").hideWin();
		widgetVodPlay.show();
	}
}

/*窗口播放*/
function winPlay(index,playUrl,isHttp){
	tvsee.debug("窗口播放地址=="+playUrl);
	var loopObj = getLoopObj(index);
	if(loopObj == null)return;
	var data = getDataJson(index)[loopObj.loopPos];
	var imgObj = $("img_"+index);
	var left = parseInt(imgObj.x)+1;
	var top = parseInt(imgObj.y)+parseInt(parent.$("div_imtems").offsetHeight)+1;
	var width = parseInt(imgObj.getAttribute("width"));
	var height = parseInt(imgObj.getAttribute("height"));
	try{
		mediaPlayer.setPlayPostion(left,top,width,height);
	}catch(e){}
	var params = eval("("+data.params+")");
	if(loopObj.isFullScreen == true){
		if(params.isLoadPlay ==true){
			setCurPagePlayWinPos(index,false);
			return;
		}
	}
 	try{
 		mediaPlayer.stop();
 		imgObj.style.visibility = "hidden";
 		if(isHttp){
 			mediaPlayer.loadAndPlay(playUrl);
 		}else{
 			mediaPlayer.guidPlay(playUrl);
 		}
 	}catch(e){}
}
function setCurPagePlayWinPos(index,isFullScreen){
	var hrClass = tvsee.eventFrame.globalCache.homeRecomendClass;
	var menuPos = tvsee.pageWidgets.getByName("widgetMenu").menuSelectPos;
	for(var i=0;i<hrClass.length;i++){
		if(hrClass[i].menuPos == menuPos){
			tvsee.eventFrame.globalCache.homeRecomendClass[i].videoPos=index;
			tvsee.eventFrame.globalCache.homeRecomendClass[i].isFullScreen = isFullScreen;
			break;
		}
	}
}
/*回看历史频道*/
function watchTvHistoryChannel(channelList){
	var channelArray=document.getElementsByName("channel");//频道
	for(var i=0;i<channelList.length;i++){
		channelArray[i].setAttribute("src",LIVE_PICURL+channelList[i].picUrl);
		channelArray[i].setAttribute("channelname",channelList[i].channelName);
		channelArray[i].setAttribute("channelId",channelList[i].channelId);
		channelArray[i].setAttribute("tvId",channelList[i].tvId);
		$("span_"+(i+1)).setAttribute("remarks",channelList[i].channelName);
		$("span_"+(i+1)).innerHTML = subStr(channelList[i].channelName, $("title_"+(i+1)).getAttribute("fontLength"), "...");
	}
}
/*轮播数据初始化*/
function loopPlayChannel(showType,cid,index,callback){
	var value = tvsee.eventFrame.globalParams.globalCache.get("watchTvChannel_CACHE");
	if(value==false){
		var url = parent.getAjaxUrl("getAllTv");
		doAjax(url, null,function(data, status) {
			if (status == "success") {
				tvsee.eventFrame.globalParams.globalCache.put("watchTvChannel_CACHE", data.catalog);
				if(showType == "roundPlay"){
					var channel = getRoundChannel();
					lunBoCid = channel.catalogid;
					callback(channel,index);
				}else{
					lunBoCid = cid;
					callback(getCurChannel(data.catalog,cid),index);
				}
			}
		})
	}else{
		if(showType == "roundPlay"){
			var channel = getRoundChannel();
			lunBoCid = channel.catalogid;
			callback(channel,index);
		}else{
			lunBoCid = cid;
			callback(getCurChannel(value,cid),index);
		}
	}
}
//获取轮播随机频道
function getRoundChannel(){
	var data = tvsee.eventFrame.globalParams.globalCache.get("watchTvChannel_CACHE");
	var channelList = [];
	for(var i=0;i<data.length;i++){
		var childs = data[i].secondChannel;
		for(var j=0;j<childs.length;j++){
			channelList.push(childs[j]);
		}
	}
	var intRound = Math.round(Math.round(channelList.length));
	if(intRound>0)intRound=intRound-1;
	var channel = channelList[intRound];
	return channel;
}
//获取直播节目单
function getLiveListByCid(cid,index){
	var value = tvsee.eventFrame.globalParams.globalCache.get("liveMovie_"+cid+"_CACHE");
	if(value == false){
		var url = getAjaxUrl("getLiveMovieList", cid);
		doAjax(url, null,function(data, status) {
			if (status == "success") {
				var liveData = data.liveMovie;
				tvsee.eventFrame.addLiveCache(liveData.curMovie);
				tvsee.eventFrame.globalParams.globalCache.put("liveMovie_"+cid+"_CACHE", liveData);
				showLiveMovieListData(liveData.liveMovieList);
			}
		})
	}else{
		showLiveMovieListData(value.liveMovieList);
	}
}
//轮播显示直播节目单
function showLiveMovieListData(data,index){
	var curLiveMovie = null;
	var size = 9;
	var movieName = "";
	$("movieList").innerHTML = "";
	for(var i=0;i<data.length;i++){
		if(i>size)break;
		if(i == 0){
			curLiveMovie = data[i];
			jQuery("#movieList").append("<div id='play_live'  style='background:url(images/home/live_paly.png); width: 32px; height: 32px; top: 9px; left: 10px; z-index: 3; visibility: hidden;'></div>");
		}
		movieName = data[i].moviename;
		if(getCharByte(movieName) > 14){
			movieName = subStr(movieName, 14, "");	
		}
		movieName = data[i].createdate+movieName;
		jQuery("#movieList").append("<div id='movieName_"+ i +"' style='width: 100%; height: 90px; z-index: 3; left: 10px; position:absolute; color: #FFF; line-height: 47px; font-size:22px; top: " + ((i * 47)) + "px'>"+movieName+"</div>");
		jQuery("#movieList").append("<div id='line_"+ i +"' style='background:url(images/home/live_line.png);width: 280px; height: 3px; z-index: 3; left: 0px; position:absolute; top: " + (i * 47) + "px;visibility: hidden'></div>");
	}
	if(curLiveMovie != null){
		lunBoMovieRef(curLiveMovie,index);
	}
}
//轮播频道页面节目单刷新
function lunBoMovieRef(liveMovie,index){
	clearInterval(lunBoTimeOut);
	var value = tvsee.eventFrame.globalParams.globalCache.get("lastWeekDate_CACHE");
	if(value == false){
		var url = parent.getAjaxUrl("getLastWeekDate",7);
		doAjax(url, null,function(data, status) {
			if (status == "success") {
				var times = liveMovie.endTimeStamp-value.timestamp;
				lunBoTimeOut = setTimeout(function(){
					var data = tvsee.eventFrame.globalParams.globalCache.put("liveMovie_"+lunBoCid+"_CACHE");
					var channelList = tvsee.eventFrame.globalParams.globalCache.get("watchTvChannel_CACHE");
					var channel = getCurChannel(channelList,liveMovie.cateid);
					getDirectPlayURl(channel,getCurWinVideoObj());
					showLiveMovieListData(data.liveMovieList,index);
				},times*1000);
			}
		})
	}else{
		var times = liveMovie.endTimeStamp-value.timestamp;
		lunBoTimeOut = setTimeout(function(){
			var data = tvsee.eventFrame.globalParams.globalCache.put("liveMovie_"+lunBoCid+"_CACHE");
			var channelList = tvsee.eventFrame.globalParams.globalCache.get("watchTvChannel_CACHE");
			var channel = getCurChannel(channelList,liveMovie.cateid);
			getDirectPlayURl(channel,getCurWinVideoObj());
			showLiveMovieListData(data.liveMovieList,index);
		},times*1000);
	}
}
/*跳转栏目列表页面*/
function gotoProgramListPage(cid,cname){
	if(cid == "")return;
	tvsee.pageWidgets.getByName("widgetMenu").hideWin();
	var widgetVodList = tvsee.pageWidgets.getByName("widgetVodList");
	if(widgetVodList != null){
		widgetVodList.show();
		widgetVodList.initMenu(cid,cname);
	}
}
/*跳转电影或综艺详情页面*/
function gotoDetailPage(pid,type){
	if(pid == "")return;
	var goToUrl = "vodDetail.html?pid=" + pid;
	goToUrl += "&fromPage=HOME&windowSize=fullScreen";
	if(type == "variety"){//综艺详情页
		goToUrl = " vodVarietyDetail.html?pid=" + pid;
	}
	tvsee.pageWidgets.getByName("widgetMenu").hideWin();
	gotoPageUrl(goToUrl);
}
/*初始化点播数据*/
function initVodData(pid,index){
	if(pid == "")return;
	var value = tvsee.eventFrame.globalParams.globalCache.get("movieDetail_" + pid);	
	if(value==null || value == false){
		var url = parent.getAjaxUrl("mediaDetail",pid);
		doAjax(url, null,function(data, status) {
			if (status == "success") {
				tvsee.eventFrame.globalParams.globalCache.put("movieDetail_" + pid, data);
				if(data.movies.length>0){
					getVodPlayUrl(data.movies[0].guid,index);
				}
			}
		})
	}else{
		if(value.movies.length>0){
			getVodPlayUrl(value.movies[0].guid,index);
		}
	}
}
//获取点播地址
function getVodPlayUrl(guid,index){
	if(ISXNMS == true){
		var url = parent.getAjaxUrl("vodByGuid",guid);
		doAjax(url, null,function(data, status) {
			if (status == "success") {
				if(data.xnms.vodType == "p4p"){
					winPlay(index,guid,false);
				}else{
					winPlay(index,data.xnms.vodURL,true);
				}
			}
		})
	}else{
		winPlay(index,guid,false);
	}
}
//初始化直播数据 
function initDirectData(cid,index){
	if(cid == "")return;
	var value = tvsee.eventFrame.globalParams.globalCache.get("watchTvChannel_CACHE");
	if(value==false){
		var url = parent.getAjaxUrl("getAllTv");
		doAjax(url, null,function(data, status) {
			if (status == "success") {
				tvsee.eventFrame.globalParams.globalCache.put("watchTvChannel_CACHE", data.catalog);
				getDirectPlayURl(getCurChannel(data.catalog,cid),index);
			}
		})
	}else{
		getDirectPlayURl(getCurChannel(value,cid),index);
	}
}
//获取当前直播频道
function getCurChannel(channelList,cid){
	var channel = [];
	for(var i=0;i<channelList.length;i++){
		var childs = channelList[i].secondChannel;
		for(var j=0;j<childs.length;j++){
			if(childs[j].catalogid==cid){
				channel = childs[j];
				break;
			}
		}
	}
	return channel;
}
//获取直播地址
function getDirectPlayURl(channel,index){
	if(channel.length == 0)return;
	var playUrl = "";
	if(LIVE_FASHION == "mongoose"){
		var value = tvsee.eventFrame.globalParams.globalCache.get("lastWeekDate_CACHE");
		if(value == false){
			var url = parent.getAjaxUrl("getLastWeekDate",7);
			doAjax(url, null,function(data, status) {
				if (status == "success") {
					playUrl = channel.hiscatalogpicurl2 + "_" + (Math.round(data.timeInfo.timestamp)-120) + ".ts";
					winPlay(index,playUrl,true);
					tvsee.eventFrame.globalParams.globalCache.put("lastWeekDate_CACHE", data.timeInfo);
				}
			})
		}else{
			playUrl = channel.hiscatalogpicurl2 + "_" + (Math.round(value.timestamp)-120) + ".ts";
			winPlay(index,playUrl,true);
		}
		return;
	}else if(LIVE_FASHION == "m3u8"){
		playUrl=channel.hiscatalogpicurl1;
		winPlay(index,playUrl,true);
	}
}
//初始化回看数据
function initWatchTvData(cid,mid,date,index){
	if(cid == "" || mid=="" || date=="")return;
	var value = tvsee.eventFrame.globalParams.globalCache.get("watchTvChannel_CACHE");
	if(value==false){
		var url = parent.getAjaxUrl("getAllTv");
		doAjax(url, null,function(data, status) {
			if (status == "success") {
				tvsee.eventFrame.globalParams.globalCache.put("watchTvChannel_CACHE", data.catalog);
				initMovieListData(getCurChannel(data.catalog,cid),mid,date,index);
			}
		})
	}else{
		initMovieListData(getCurChannel(value,cid),mid,date,index);
	}
}
//获取回看节目单
function initMovieListData(channel,mid,date,index){
	if(channel.length == 0)return;
	var cacheMovieListKey = "wtMovie_"+channel.catalogid+"_"+date+"_CACHE";
	var value = tvsee.eventFrame.globalParams.globalCache.get(cacheMovieListKey);
	if(value==false){
		var url = parent.getAjaxUrl("getMovieListByDate",date,cid);
		doAjax(url, null,function(data, status) {
			if (status == "success") {
				tvsee.eventFrame.globalParams.globalCache.put(cacheMovieListKey, data.movie);
				getWatchTvPlayUrl(channel,getCurMovie(data.movie,mid),index);
			}
		})
	}else{
		getWatchTvPlayUrl(channel,getCurMovie(value,mid),index);
	}
}
//获取当前节目
function getCurMovie(movieList,mid){
	var movie = [];
	for(var i=0;i<movieList.length;i++){
		if(movieList[j].mid==mid){
			movie = movieList[j];
			break;
		}
	}
	return movie;
}
//获取回看播放地址
function getWatchTvPlayUrl(channel,movie,index){
	if(movie == null)return;
	var playUrlPrefix = channel.hiscatalogpicurl2;
	var playUrlStartTime = Math.floor(movie.dimension);
	var playUrlEndTime = Math.floor(movie.classification);
	var playUrl = movie.guid;
	var	movieName = movie.moviename;
	if(WATCHTV_FASHION == "mongoose"){
		playUrl = playUrlPrefix + "_" + playUrlStartTime + "_" + playUrlEndTime + ".ts";
		winPlay(index,playUrl,true);
	}else if(WATCHTV_FASHION == "m3u8"){
		playUrl="http://"+movie.provenance+movie.netaddress;
		winPlay(index,playUrl,true);
	}else if(WATCHTV_FASHION == "p4p"){
		winPlay(index,playUrl,false);
	}else if(WATCHTV_FASHION == "xnms"){
		var url = parent.getAjaxUrl("vodByGuid",playUrl);
		doAjax(url, null,function(data, status) {
			if (status == "success") {
				playUrl = data.xnms.vodURL;
				if(data.xnms.vodType == "http"){
					winPlay(index,playUrl,true);
				}else{
					winPlay(index,playUrl,false);
				}
			}
		})
		return;
	}
}

/*清空所有轮循定时器*/
function clearLoopTask(flag){
	clearInterval(lunBoTimeOut);
	var hrClass = tvsee.eventFrame.globalCache.homeRecomendClass;
	var menuPos = tvsee.pageWidgets.getByName("widgetMenu").menuSelectPos;
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
	var hrClass = tvsee.eventFrame.globalCache.homeRecomendClass;
	var menuPos = tvsee.pageWidgets.getByName("widgetMenu").menuSelectPos;
	for(var i=0;i<hrClass.length;i++){
		if(hrClass[i].menuPos == menuPos){
			var loopObjArr = hrClass[i].loopObjs;
			for(var j=0;j<loopObjArr.length;j++){
				loopObjArr[j].startLoop();
			}
		}
	}
}
function getLoopObj(index){
	var loopObj = null;
	var hrClass = tvsee.eventFrame.globalCache.homeRecomendClass;
	var menuPos = tvsee.pageWidgets.getByName("widgetMenu").menuSelectPos;
	for(var i=0;i<hrClass.length;i++){
		if(hrClass[i].menuPos == menuPos){
			var loopObjArr = hrClass[i].loopObjs;
			for(var j=0;j<loopObjArr.length;j++){
				if(loopObjArr[j].index == index){
					loopObj = loopObjArr[j];
					break;
				}
			}
		}
	}
	return loopObj;
}
//获取当前页面正在播放的视频窗口对象
function getCurWinVideoObj(){
	var loopObj = null;
	var hrClass = tvsee.eventFrame.globalCache.homeRecomendClass;
	var menuPos = tvsee.pageWidgets.getByName("widgetMenu").menuSelectPos;
	for(var i=0;i<hrClass.length;i++){
		if(hrClass[i].menuPos == menuPos){
			if(hrClass[i].videoPos != -1){
				loopObj = getLoopObj(hrClass[i].videoPos);
				break;
			}
		}
	}
	return loopObj;
}
function GuidToUrl_Callback(_url){
	if(_url == ""){
		mediaPlayerListeren(400);	
		return;
	}
}

function mediaPlayerListeren(_state, _param){
	var loopObj = getCurWinVideoObj();
	if(loopObj == null)return;
	var data  = loopObj.loopData(loopObj.loopPos);
	switch(_state){
		 case 1:  //播放结束
		 	initModelData(loopObj.index);
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
		 case 3: //开始播放
		 	$("img_"+loopObj.index).style.visibility = "hidden";
		 break;
	}	
}

