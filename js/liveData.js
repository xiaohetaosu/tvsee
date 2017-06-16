var globalTimes = 2;//定时器执行间隔：30秒
var firstTimeStamp = 0;//缓存第一次进入时间戳
//获取所有频道
function getAllChannel(params, callback){
	var value = getCacheData("watchTvChannel_CACHE");
	if(value == false){ 
		var ajax = new ajaxClass();
		ajax.frame = window;
		ajax.url = getAjaxUrl("getAllTv");
		ajax.successCallback = function(_xmlHttp, _params) {
			eval("var data = (" + _xmlHttp.responseText + ").catalog");
			setCacheData("watchTvChannel_CACHE", data);
			if(typeof(callback) == "function"){
				callback(params, data);
			}
		};
		ajax.failureCallback = function(_xmlHttp, _params) {
		};
		ajax.requestData();
	}else{
		if(typeof(callback) == "function"){
			callback(params, value);
		}
	}
}

/*获取当前频道*/
function getCurChannel(params, callback){
	getAllChannel(params, function(params, data){
		for(var i = 0; i< data.length; i++){
			for(var j=0;j<data[i].secondChannel.length;j++){
				if(data[i].secondChannel[j].catalogid == params.catalogid){
					if(typeof(callback) == "function"){
						callback(params, data[i].secondChannel[j]);
					}
					break;
				}
			}
		}
	})
}
/*获取当前日期节目单*/
function getMovieListByDate(params, callback){
	var cacheMovieListKey = "wtMovie_" + params.catalogid + "_" + params.curDate + "_CACHE";
	var value = tvsee.eventFrame.globalParams.dataCache.get(cacheMovieListKey);
	if(value == false){
		var ajax = new ajaxClass();
		ajax.frame = window;
		ajax.callbackParams = [cacheMovieListKey];
		ajax.url = getAjaxUrl("getMovieListByDate", params.curDate, params.catalogid);
		ajax.successCallback = function(_xmlHttp, _params) {
			eval("var data = (" + _xmlHttp.responseText + ").movie");
			for(var i = 0; i < data.length; i++){
				data[i].status = movieStatus(data[i]);
			}
			tvsee.eventFrame.globalParams.dataCache.put(_params[0], data);
			if(typeof(callback) == "function"){
				callback(params, data);
			}
		};
		ajax.failureCallback = function(_xmlHttp, _params) {
		};
		ajax.requestData();
	}else{
		if(typeof(callback) == "function"){
			callback(params, value);
		}
	}
}
//获取服务器时间
function getDateInfo(params, callback){
	var value = getCacheData("lastWeekDate_CACHE");
	if(value == false){ 
		var ajax = new ajaxClass();
		ajax.frame = window;
		ajax.url = getAjaxUrl("getLastWeekDate",7);
		ajax.successCallback = function(_xmlHttp, _params) {
			eval("var data = (" + _xmlHttp.responseText + ").timeInfo");
			if(firstTimeStamp == 0){
				firstTimeStamp = data.timeStamp;
			}
			setCacheData("lastWeekDate_CACHE", data);
			if(typeof(callback) == "function"){
				callback(params, data);
			}
		};
		ajax.failureCallback = function(_xmlHttp, _params) {
		};
		ajax.requestData();
	}else{
		if(typeof(callback) == "function"){
			callback(params, value);
		}
	}
}
/*获取当前直播频道]节目单*/
function getLiveMovieList(params, callback){
	getAllChannel(params, function(params, data){
		for(var i = 0; i< data.length; i++){
			for(var j=0;j<data[i].secondChannel.length;j++){
				if(data[i].secondChannel[j].catalogid == params.catalogid){
					var movies = data[i].secondChannel[j].liveMovieList;
					for(var k = 0; k < movies.length; k++){
						movies[k].status = movieStatus(movies[k]);
					}
					if(typeof(callback) == "function"){
						callback(params, movies);
					}
					break;
				}
			}
		}
	})
}
/*切换频道*/
function changeLiveChannel(params, callback){
	getAllChannel(params, function(params, data){
		var channels = [];
		var liveChannel = null;
		for(var i = 0;i < data.length; i++){
			var childs = data[i].secondChannel;
			for(var j=0;j<childs.length;j++){
				channels.push(childs[j]);
			}
		}
		for(var i=0;i<channels.length;i++){
			if(params.catalogid == channels[i].catalogid){
				if(params._num == -1){//左键切换
					if(i==0){
						liveChannel = channels[channels.length - 1];
					}else{
						liveChannel = channels[i - 1];
					}
				}else if(params._num == 1){//右键切换
					if(i==(channels.length - 1 )){
						liveChannel = channels[0];
					}else{
						liveChannel = channels[i + 1];
					}
				}
				if(typeof(callback) == "function"){
					callback(params, liveChannel);
				}
				break;
			}
		}
	})
}
/*判断节目状态*/
function movieStatus(movie){
	var nowTimes = getCacheData("lastWeekDate_CACHE").timestamp;
	var startTimes = movie.dimension;
	var endTimes = movie.classification;
	if(nowTimes >= startTimes && nowTimes < endTimes){
		return 1;//直播
	}else if(startTimes > nowTimes){
		return 2;//未上线
	}else{
		return 0;//回看
	}
}
/*直播回看播放
*@seekTimeLength:seek时长
*/
function liveAndWatchTvPlay(seekTimeLength){
	if(typeof(type) != "undefined"){
		var movie = globalParams.curMovie;
		var playUrlPrefix = "http://";
		var playUrlStartTime = 0;
		var playUrlEndTime = 0;
		playUrlPrefix = globalParams.curChannel.hiscatalogpicurl2;
		if(movie != null && movie != ""){
			if(movie.status == 1){
				tvsee.eventFrame.addLiveCache(movie);
			}
			playUrlStartTime = Math.floor(movie.dimension);
			playUrlEndTime = Math.floor(movie.classification);
			movieName = movie.moviename;
			playUrl = movie.guid;
			timelength = movie.timelength;
		}
		globalParams.duration = timelength;
		isHttp = true;
		if(type==0){//回看
			if(WATCHTV_FASHION == "mongoose"){
				timelength = (playUrlEndTime-playUrlStartTime)*1000;
				globalParams.duration = timelength;
				if(globalParams.seekChanged){//seek
					globalParams.isDisLoading = false;
					playUrlStartTime = playUrlStartTime+Math.floor(seekTimeLength/1000);
					if((playUrlStartTime+1) >= playUrlEndTime){			
						//playUrlStartTime = playUrlEndTime-5;
						try{
							mediaPlayer.stop();
						}catch(e){}	
						if(fromPage=="WATCHTVLIST"){
							gotoPageUrl("watchTv.html");
						}else{
							tvsee.mainFrame.location.href = "about:blank";
							showHomeWidget();
						}
						return;
					}
				}
				playUrl = playUrlPrefix + "_" + playUrlStartTime + "_" + playUrlEndTime + ".ts";
			}else if(WATCHTV_FASHION == "m3u8"){
				//playUrl="http://"+movie.provenance+movie.netaddress;
				playUrl = getM3U8PlayUrl(0,globalParams.curChannel,movie);
			}else if(WATCHTV_FASHION == "p4p"){
				playUrl = playUrl;
				isHttp = false;
			}else if(WATCHTV_FASHION == "xnms"){
				globalParams.getUrlAjaxObj = new ajaxClass();
				globalParams.getUrlAjaxObj.frame = window;
				globalParams.getUrlAjaxObj.url = getAjaxUrl("vodByGuid" , playUrl);
				globalParams.getUrlAjaxObj.successCallback = function(_xmlHttp, _params){
					eval("var data = (" + _xmlHttp.responseText + ").xnms");
					if(data.vodType == "http"){
						playUrl = data.vodURL;
						globalParams.playMode = "http";
					}else{
						isHttp = false;
					}
					mediaPlay(playUrl, timelength, 0, true); 
				};
				globalParams.getUrlAjaxObj.failureCallback = function(_xmlHttp, _params) {
					mediaPlay(playUrl, timelength, 0, true); 	
				};
				globalParams.getUrlAjaxObj.requestData();
				return;
			}
		}else if(type == 1){//直播
			if(LIVE_FASHION == "mongoose"){
				//timelength = (playUrlEndTime - playUrlStartTime) * 1000;
				//globalParams.duration = timelength;
				playUrl = playUrlPrefix + "_" + getCurrTimes() + ".ts";
			}else if(LIVE_FASHION == "m3u8"){
				//playUrl = globalParams.curChannel.hiscatalogpicurl1;
				playUrl = getM3U8PlayUrl(1,globalParams.curChannel);
			}
			
		}
		if(isHttp == "true"){
			globalParams.playMode = "http";	
		}
		//打印日志
		if(type==1){
			tvsee.debug("直播频道:"+globalParams.curChannel.catalogname+" playUrl=="+playUrl);
		}else if(type==0){
			tvsee.debug("回看playUrl=="+playUrl);
		}
		mediaPlay(playUrl, timelength, 0, true);
	}
}
/***获取m3u8播放地址,ip地址config文件配置***/
function getM3U8PlayUrl(type,channel,movie){
	var post = "";
	var urlFix = "";
	var _playUrl = LIVE_URL;//config文件配置
	if(channel != null){
		var url = channel.hiscatalogpicurl1;
		if(url != null && url != ""){
			var index = url.lastIndexOf(":");
			if(index != -1){
				url = url.substring(index,url.length);
				var index_1 = url.indexOf("/");
				if(index_1 != -1){
					post = url.substring(0,index_1);
					urlFix = url.substring(index_1,url.length);
				}else{
					post = url;
					urlFix = "";
				}
			}
		}
		if(type == 0){//回看
			if(movie != null){
				_playUrl += post+movie.netaddress;
			}
		}else{//直播
			_playUrl += post+urlFix;
		}
	}
	return _playUrl;
}
//获取当前时间戳（1970）
function getCurrTimes(){
	var curSeconds = 0;
	var value = getCacheData("lastWeekDate_CACHE");
	if(value !=false){
		curSeconds = Math.round(value.timestamp)-120;
	}
	return curSeconds;
}
//频道批量业务认证
function authChannels(isAuth,priceType){
	var dataArr = globalParams.globalCache.get("watchTvChannel_CACHE");
	var channelIds = "";
	var ppvidIds = "";
	var channelList = new Array();
	for(var i=0;i<dataArr.length;i++){
		var childs = dataArr[i].secondChannel;
		for(var j=0;j<childs.length;j++){
			channelList.push(childs[j]);
			if(typeof(childs[j].watchTvAuth)=="undefined"){
				childs[j].watchTvAuth = null;
			}
			if(typeof(childs[j].liveAuth)=="undefined"){
				childs[j].liveAuth = null;
			}
			if(priceType == "0"){
				if(childs[j].spid != null && childs[j].spid != "" && childs[j].spid != "0"){
					if(channelIds != "")channelIds += ";";
					if(ppvidIds != "")ppvidIds += ";";
					channelIds += childs[j].catalogid ;
					ppvidIds += childs[j].spid;
				}
				
			}else if(priceType == "1"){
				var spname = childs[j].spname;
				if(childs[j].spname != null && childs[j].spname != "" && childs[j].spname != "-"){
					if(channelIds != "")channelIds += ";";
					if(ppvidIds != "")ppvidIds += ";";
					channelIds += childs[j].catalogid;
					ppvidIds += childs[j].spname;
				}
			}
		}
	}
	if(priceType == "0" && channelIds == ""){
		authChannels(false,1);//直播频道认证
		return;
	}else if(priceType == "1" && channelIds == ""){
		return;
	}
	var ajax = new ajaxClass();
	ajax.frame = window;
	ajax.url = getAjaxUrl("userAAAVerify",ppvidIds,channelIds,priceType);
	ajax.successCallback = function(_xmlHttp, _params) {
		//eval("var result = (" + _xmlHttp.responseText + ".result)");
		//var authData = eval("(" + result + ".result_info)");
		eval("var authData = (" + _xmlHttp.responseText + ".result)");
		for(var i=0;i<channelList.length;i++){
			for(var ii=0;ii<authData.length;ii++){
				if(typeof(authData[ii].guid)!="undefined" && channelList[i].catalogid == authData[ii].guid){
					if(priceType == "0"){
						channelList[i].watchTvAuth = authData[ii];
						tvsee.debug("回看频道认证：catalogid="+channelList[i].catalogid+",catalogname="+channelList[i].catalogname+", flag="+authData[ii].flag);
					}else if(priceType == "1"){
						channelList[i].liveAuth = authData[ii];
						tvsee.debug("直播频道认证：catalogid="+channelList[i].catalogid+",catalogname="+channelList[i].catalogname+", flag="+authData[ii].flag);
					}
				}
			}
		}
		for(var i=0;i<dataArr.length;i++){
			dataArr[i].secondChannel = [];
		}
		for(var i=0;i<dataArr.length;i++){
			for(var j=0;j<channelList.length;j++){
				if(dataArr[i].catalogid == channelList[j].parentid){
					dataArr[i].secondChannel.push(channelList[j]);
				}
			}
		}
		globalParams.globalCache.put("watchTvChannel_CACHE", dataArr);
		if(isAuth){
			authChannels(false,1);//直播频道认证
		}
	};
	ajax.failureCallback = function(_xmlHttp, _params) {
	};
	ajax.requestData();
}
//全局定时器每30秒刷新一次
function autoRefreshTime(){
	getDateInfo(null, function(params,data){
		data.time = timesFormat(getSecond(data.time) + globalTimes);
		data.curtime = data.weekDate[0][1 ] + " " + timesFormat(getSecond(data.time) + globalTimes);
		data.timestamp = Math.round(data.timestamp) + globalTimes;
		setCacheData("lastWeekDate_CACHE", data);
		//0点刷新页面时间
		if(data.time == "00:00:00"){ 
			removeCacheData("lastWeekDate_CACHE");
			getDataInfo();
		}
	});
};
//自动更新直播节目单
function autoRefreshLiveMovieList(){
	var times = 30000;//5分钟执行一次
	getDateInfo(times, function(params, data){
		if((data.timestamp - firstTimeStamp) % times == 0){
			getAllChannel();
		}
	});
}
function setCacheData(key,data){
	tvsee.eventFrame.globalParams.globalCache.put(key, data);
}
function getCacheData(key){
	return tvsee.eventFrame.globalParams.globalCache.get(key);
}
function removeCacheData(key){
	tvsee.eventFrame.globalParams.globalCache.remove(key);
}

