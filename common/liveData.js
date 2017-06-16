var globalLiveParams = {
	channelObj:null,
	watchObj:null,
	xnmsObj:null,
	changeLiveMovieObj:null,
	authObj:null
};

/**
 * 获取轮播频道
 * @params 
 * return 
 */
function getLunBoChannel(params, callback){
	var value = getCacheData("watchLunBoTvChannel_CACHE");
	if(value == false){ 
		var ajax = new ajaxClass();
		ajax.frame = window;
		ajax.url = getAjaxUrl("getLunBoChannel",params.catalogid);
		ajax.successCallback = function(_xmlHttp, _params) {
			eval("var data = (" + _xmlHttp.responseText + ")");
			setCacheData("watchLunBoTvChannel_CACHE", data);
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
/**
 * 获取所有直播频道
 * @params 
 * return 
 */
function getAllChannel(params, callback){
	var value = getCacheData("watchTvChannel_CACHE");
	if(value == false){
		if(globalLiveParams.channelObj != null){
			globalLiveParams.channelObj.requestAbort();
		}
		globalLiveParams.channelObj = new ajaxClass();
		globalLiveParams.channelObj.frame = window;
		globalLiveParams.channelObj.url = getAjaxUrl("getAllTv");
		globalLiveParams.channelObj.successCallback = function(_xmlHttp, _params) {
			eval("var data = (" + _xmlHttp.responseText + ").catalog");
			setCacheData("watchTvChannel_CACHE", data);
			if(typeof(callback) == "function"){
				callback(params, data);
			}
			authChannels(true, 0, data);
		};
		globalLiveParams.channelObj.failureCallback = function(_xmlHttp, _params) {
		};
		globalLiveParams.channelObj.requestData();
	}else{
		if(typeof(callback) == "function"){
			callback(params, value);
		}
	}
}

/**
 * 根据频道id获取频道
 * @params catalogid：频道id
 * @params data：频道列表
 * return channel对象
 */
function getChannelById(catalogid, data){
	var channel = null;
	for(var i = 0; i< data.length; i++){
		for(var j=0;j<data[i].secondChannel.length;j++){
			if(data[i].secondChannel[j].catalogid == catalogid){
				return data[i].secondChannel[j];
			}
		}
	}
	return channel;
}
/**
 * 根据日期获取指定频道对应节目单
 * 参数json格式对象
 * @params catalogid：频道id
 * @params date：指定日期
 * return json对象格式：movie：节目单，channel：频道对象
 */
function getMovieListByDate(params, callback){
	getAllChannel(params, function(params,data){
		//从缓存频道取得节目单
		var movies = [];
		var channel = getChannelById(params.catalogid, data);
		/*if(channel != null){
			for(var i = 0;i < channel.liveMovieList.length; i++){
				if(params.date == channel.liveMovieList[i].startDate){
					channel.liveMovieList[i].status = movieStatus(channel.liveMovieList[i]);
					movies.push(channel.liveMovieList[i]);
				}
			}
		}*/
		//调用接口查询节目单
		if(movies.length == 0){
			var cacheMovieListKey = "wtMovie_" + params.catalogid + "_" + params.date + "_CACHE";
			var value = tvsee.eventFrame.globalParams.dataCache.get(cacheMovieListKey);
			if(value == false){
				if(globalLiveParams.watchObj != null){
					globalLiveParams.watchObj.requestAbort();
				}
				globalLiveParams.watchObj = new ajaxClass();
				globalLiveParams.watchObj.frame = window;
				globalLiveParams.watchObj.callbackParams = [cacheMovieListKey,channel];
				globalLiveParams.watchObj.url = getAjaxUrl("getMovieListByDate", params.date, params.catalogid);
				globalLiveParams.watchObj.successCallback = function(_xmlHttp, _params) {
					eval("var data = (" + _xmlHttp.responseText + ").movie");
					if(data != null && data != "null"){
						tvsee.eventFrame.globalParams.dataCache.put(_params[0], data);
						for(var i = 0; i < data.length; i++){
							data[i].status = movieStatus(data[i]);
						}
					}else{
						data = [];	
					}
					if(typeof(callback) == "function"){
						callback(params, {'movie': data, 'channel': _params[1]});
					}
				};
				globalLiveParams.watchObj.failureCallback = function(_xmlHttp, _params) {
				};
				globalLiveParams.watchObj.requestData();
			}else{
				if(typeof(callback) == "function"){
					for(var i = 0; i < value.length; i++){
						value[i].status = movieStatus(value[i]);
					}
					callback(params, {'movie': value, 'channel': channel});
				}
			}
		}else{
			if(typeof(callback) == "function"){
				callback(params, {'movie': movies, 'channel': channel});
			}
		}
	});	
}


/**
 * 获取指定频道直播节目单
 * @params.catalogid 频道id
 * @params._num 频道切换 -1左键,1右键
 * return json对象：channel当前频道, movie直播节目列表
 */
function getLiveMovieList(params, callback){
	getAllChannel(params, function(params, data){
		var channels = [];
		for(var i=0;i<data.length;i++){
			var childs = data[i].secondChannel;
			for(var j=0;j<childs.length;j++){
				channels.push(childs[j]);
			}
		}
		var curChannel = null;
		var movies = null;
		for(var i=0;i<channels.length;i++){
			if(params.catalogid==channels[i].catalogid){
				curChannel = channels[i];
				if(params._num==-1){
					if(i==0){
						curChannel = channels[channels.length - 1];
					}else{
						curChannel = channels[i - 1];
					}
				}else if(params._num==1){
					if(i==(channels.length - 1 )){
						curChannel = channels[0];
					}else{
						curChannel = channels[i + 1];
					}
				}
				/*var movies = new Array();
				if(curChannel.liveMovieList != null && curChannel.liveMovieList.length > 0){
					for(var k = 0; k < curChannel.liveMovieList.length; k++){
						curChannel.liveMovieList[k].status = movieStatus(curChannel.liveMovieList[k]);
						if(curChannel.liveMovieList[k].status != 0){
							movies.push(curChannel.liveMovieList[k]);
						}
					}
				}
				if(typeof(callback) == "function"){
					callback(params, {'channel' : curChannel, 'movie' : movies});
				}
				break;*/
			}else if(params.channelid == channels[i].channelid){
				curChannel = channels[i];
			}
			
			if(curChannel != null){
				movies = new Array();
				if(curChannel.liveMovieList != null && curChannel.liveMovieList.length > 0){
					for(var k = 0; k < curChannel.liveMovieList.length; k++){
						curChannel.liveMovieList[k].status = movieStatus(curChannel.liveMovieList[k]);
						if(curChannel.liveMovieList[k].status != 0){
							movies.push(curChannel.liveMovieList[k]);
						}
					}
				}
				
				break;	
			}
		}
		if(typeof(callback) == "function"){
			callback(params, {'channel' : curChannel, 'movie' : movies});
		}
		
	});
}

/*判断节目状态*/
function movieStatus(movie){
	var nowTimes = TvseeDate.getTime();
	var startTimes = movie.startMillisecond;
	var endTimes = movie.endMillisecond;
	if(nowTimes >= startTimes && nowTimes < endTimes){
		return 1;//直播
	}else if(startTimes > nowTimes){
		return 2;//未上线
	}else{
		return 0;//回看
	}
}
/*xnms*/
function getXnms(guid){
	var xnmsUrl = guid;
	if(globalLiveParams.xnmsObj != null){
		globalLiveParams.xnmsObj.requestAbort();
	}
	globalLiveParams.xnmsObj = new ajaxClass();
	globalLiveParams.xnmsObj.frame = window;
	globalLiveParams.xnmsObj.async = false;
	globalLiveParams.xnmsObj.url = getAjaxUrl("vodByGuid" , guid);
	globalLiveParams.xnmsObj.successCallback = function(_xmlHttp, _params){
		eval("var data = (" + _xmlHttp.responseText + ").xnms");
		if(data.vodType == "http"){
			xnmsUrl = data.vodURL;
		}else{
			xnmsUrl = guid;
		}
	}
	globalLiveParams.xnmsObj.failureCallback = function(_xmlHttp, _params) {
	};
	globalLiveParams.xnmsObj.requestData();
	return xnmsUrl;
}
/**
 * 直播播放地址
 * @params channel：直播频道对象
 * return url：直播地址
 */
function getLivePlayUrl(channel){
	var playUrlPrefix = "http://";
	var livePlayUrl = "";
	var catalogname = "null";
	if(channel != null){
		playUrlPrefix = channel.hiscatalogpicurl2;
	}
	if(LIVE_FASHION == "mongoose"){
		livePlayUrl = playUrlPrefix + "_" + (TvseeDate.getTime()-120*1000) + ".ts";
		tvsee.debug("直播频道:"+channel.catalogname+" playUrl=="+livePlayUrl);
		return livePlayUrl;
	}else if(LIVE_FASHION == "m3u8"){
		if(channel != null){
			//alert(channel.hiscatalogpicurl1);
			//livePlayUrl = liveM3U8Url(channel.hiscatalogpicurl1);
			livePlayUrl = LIVE_URL + channel.hiscatalogpicurl1;
			catalogname = channel.catalogname;
		}
		tvsee.debug("直播频道:"+catalogname+" playUrl=="+livePlayUrl);
		return livePlayUrl;
	}
}
/**
 * M3U8直播地址
 * @params liveChannleUrl：直播频道地址
 * return playurl
 */
function liveM3U8Url(liveChannleUrl){
	var post = "";
	var urlFix = "";
	if(liveChannleUrl != null && liveChannleUrl != ""){
		var index = liveChannleUrl.lastIndexOf(":");
		if(index != -1){
			liveChannleUrl = liveChannleUrl.substring(index,liveChannleUrl.length);
			var index_1 = liveChannleUrl.indexOf("/");
			if(index_1 != -1){
				post = liveChannleUrl.substring(0,index_1);
				urlFix = liveChannleUrl.substring(index_1,liveChannleUrl.length);
			}else{
				post = liveChannleUrl;
				urlFix = "";
			}
		}
	}
	return LIVE_URL + post+urlFix;
}
/**
 * 回看播放地址
 * @params channel： 频道对象
 * @params movie：当前节目对象
 * return url：回看地址
 */
function getWatchPlayUrl(channel, movie){
	var playUrlPrefix = "http://";
	var playUrlStartTime = 0;
	var playUrlEndTime = 0;
	var watchPlayUrl = "";
	var catalogname = "null";
	if(channel != null){
		playUrlPrefix = channel.hiscatalogpicurl2;
	}
	if(movie != null){
		playUrlStartTime = Math.floor(movie.startMillisecond);
		playUrlEndTime = Math.floor(movie.endMillisecond);
	}
	if(WATCHTV_FASHION == "mongoose"){
		watchPlayUrl = playUrlPrefix + "_" + playUrlStartTime + "_" + playUrlEndTime + ".ts";
	}else if(WATCHTV_FASHION == "m3u8"){
		if(channel != null){
			  watchPlayUrl =LIVE_URL + "/"  + movie.netaddress;// watchM3U8Url(channel.hiscatalogpicurl1,movie.netaddress);
			catalogname = channel.catalogname;
		}
	}else if(WATCHTV_FASHION == "p4p"){
		watchPlayUrl = movie.guid;
	}else if(WATCHTV_FASHION == "xnms"){
		watchPlayUrl = getXnms(movie.guid);
	}
	tvsee.debug("回看频道:"+catalogname+" playUrl=="+watchPlayUrl);
	return watchPlayUrl;
}
/**
 * M3U8回看地址
 * @params liveChannleUrl：直播频道地址
 * return playurl
 */
function watchM3U8Url(liveChannleUrl, netAddress){
	var post = "";
	var urlFix = "";
	if(liveChannleUrl != null && liveChannleUrl != ""){
		var index = liveChannleUrl.lastIndexOf(":");
		if(index != -1){
			liveChannleUrl = liveChannleUrl.substring(index,liveChannleUrl.length);
			var index_1 = liveChannleUrl.indexOf("/");
			if(index_1 != -1){
				post = liveChannleUrl.substring(0,index_1);
				urlFix = liveChannleUrl.substring(index_1,liveChannleUrl.length);
			}else{
				post = liveChannleUrl;
				urlFix = "";
			}
		}
	}
	return LIVE_URL + post + netAddress;
}
/**
 * 频道预认证
 * @params isAuth true：认证,false: 不认证
 * @params priceType 0:回看价签,1：直播频道价签
 * @params data 所有频道对象
 * return playurl
 */
function authChannels(isAuth, priceType, data){
	if(ISAAA == false || data == null || data.length == 0)return;
	var dataArr = data;
	var channelIds = "";
	var ppvidIds = "";
	var channelList = new Array();
	for(var i=0;i<dataArr.length;i++){
		for(var j=0;j<dataArr[i].secondChannel.length;j++){
			channelList.push(dataArr[i].secondChannel[j]);
		}
	}
	for(var i=0;i<channelList.length;i++){
		if(typeof(channelList[i].watchTvAuth)=="undefined"){
			channelList[i].watchTvAuth = null;
		}
		if(typeof(channelList[i].liveAuth)=="undefined"){
			channelList[i].liveAuth = null;
		}
		if(priceType == "0"){
			if(channelList[i].spid != null && channelList[i].spid != "" && channelList[i].spid != "0"){
				if(channelIds != "")channelIds += ";";
				if(ppvidIds != "")ppvidIds += ";";
				channelIds += channelList[i].catalogid ;
				ppvidIds += channelList[i].spid;
			}
			
		}else if(priceType == "1"){
			var spname = channelList[i].spname;
			if(channelList[i].spname != null && channelList[i].spname != "" && channelList[i].spname != "-" && channelList[i].spname != "0"){
				if(channelIds != "")channelIds += ";";
				if(ppvidIds != "")ppvidIds += ";";
				channelIds += channelList[i].catalogid;
				ppvidIds += channelList[i].spname;
			}
		}
	}
	if(priceType == "0" && channelIds == ""){
		authChannels(false,1,dataArr);//直播频道认证
		return;
	}else if(priceType == "1" && channelIds == ""){
		return;
	}
	if(globalLiveParams.authObj != null){
		globalLiveParams.authObj.requestAbort();
	}
	globalLiveParams.authObj = new ajaxClass();
	globalLiveParams.authObj.frame = window;
	globalLiveParams.authObj.url = getAjaxUrl("userAAAVerify",ppvidIds,channelIds,priceType);
	globalLiveParams.authObj.successCallback = function(_xmlHttp, _params) {
		eval("var authData = (" + _xmlHttp.responseText + ".result)");
		for(var i=0;i<dataArr.length;i++){
			var childs = dataArr[i].secondChannel;
			for(var j=0;j<dataArr[i].secondChannel.length;j++){
				for(var k=0;k<authData.length;k++){
					if(dataArr[i].secondChannel[j].catalogid == authData[k].guid){
						if(priceType == "0"){
							dataArr[i].secondChannel[j].watchTvAuth = authData[k];
							tvsee.debug("回看频道认证：catalogid="+dataArr[i].secondChannel[j].catalogid+",catalogname="+dataArr[i].secondChannel[j].catalogname+", flag="+authData[k].flag);
						}else if(priceType == "1"){
							dataArr[i].secondChannel[j].liveAuth = authData[k];
							tvsee.debug("直播频道认证：catalogid="+dataArr[i].secondChannel[j].catalogid+",catalogname="+dataArr[i].secondChannel[j].catalogname+", flag="+authData[k].flag);
						}
					}
				}
			}
		}
		setCacheData("watchTvChannel_CACHE", dataArr);
		if(isAuth){
			authChannels(false,1,dataArr);//直播频道认证
		}
	};
	globalLiveParams.authObj.failureCallback = function(_xmlHttp, _params) {
	};
	globalLiveParams.authObj.requestData();
}

//自动更新直播节目单
function autoRefreshLiveMovieList(){
	var times = 300;//5分钟执行一次 秒
	var firstTimeStamp = getCacheData("firstTimeStamp");
	if((TvseeDate.getTime() - firstTimeStamp) % times == 0){
		if(globalLiveParams.changeLiveMovieObj != null){
			globalLiveParams.changeLiveMovieObj.requestAbort();
		}
		globalLiveParams.changeLiveMovieObj = new ajaxClass();
		globalLiveParams.changeLiveMovieObj.frame = window;
		globalLiveParams.changeLiveMovieObj.url = getAjaxUrl("getAllTv");
		globalLiveParams.changeLiveMovieObj.successCallback = function(_xmlHttp, _params) {
			eval("var data = (" + _xmlHttp.responseText + ").catalog");
			//判断频道信息是否有更新操作
			var dateInfo = TvseeDate.getWeek();
			var cacheData = getCacheData("watchTvChannel_CACHE");
			var cacheChannels = [];
			for(var i = 0; i < cacheData.length; i++){
				for(var j=0;j<cacheData[i].secondChannel.length;j++){
					cacheChannels.push(cacheData[i].secondChannel[j]);
				}
			}
			for(var i = 0; i < data.length; i++){
				for(var j=0;j<data[i].secondChannel.length;j++){
					for(var k = 0; k < cacheChannels.length; k++){
						if(data[i].secondChannel[j].catalogid == cacheChannels[k].catalogid){
							//节目单有更新，清除节目单缓存
							if(data[i].secondChannel[j].versionid != null && cacheChannels[k].versionid != null){
								if(data[i].secondChannel[j].versionid != cacheChannels[k].versionid){
									for(var h = 0; h < dateInfo.length; h++){
										var cacheMovieListKey = "wtMovie_" + cacheChannels[i].catalogid + "_" + dateInfo[h][0] + "_CACHE";
										tvsee.eventFrame.globalParams.dataCache.remove(cacheMovieListKey);
									}
								}
							}
							if(ISAAA){
								//回看价签有更新，清除认证缓存
								if(data[i].secondChannel[j].spid != cacheChannels[k].spid){
									data[i].secondChannel[j].watchTvAuth = null;
								}else{
									data[i].secondChannel[j].watchTvAuth = cacheChannels[k].watchTvAuth;
								}
								//直播价签有更新，清除认证缓存
								if(data[i].secondChannel[j].spname != cacheChannels[k].spname){
									data[i].secondChannel[j].liveAuth = null;
								}else{
									data[i].secondChannel[j].liveAuth = cacheChannels[k].liveAuth;
								}
							} 
						}
					}
				}
			}
			tvsee.eventFrame.globalParams.globalCache.put("watchTvChannel_CACHE", data);
		};
		globalLiveParams.changeLiveMovieObj.failureCallback = function(_xmlHttp, _params) {
		};
		globalLiveParams.changeLiveMovieObj.requestData();
	}
}
//获取频道logo地址
function getChannelLogoPicUrl(channelPicUrl){
	if(channelPicUrl != null && channelPicUrl != ""){
		var a_0 = channelPicUrl.lastIndexOf("/");
		channelPicUrl = channelPicUrl.substring(a_0+1,channelPicUrl.length);
	}
	return LIVE_PICURL + channelPicUrl;
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
/**
 * 根据频道id和当前时间获取playUrl
 * @params time：当前时间
 * @params catalogid：频道id
 * @params data：频道数据
 * return lunBoProgram 轮播节目
 */
function getLunBoProgramByTime(time,data){
	var lunBoProgram = null;
	if(typeof(data) == "undefined"|| data == null){
		return ;
	}
	var date = new Date(time);
	for(var i = 0; i< data.length; i++){
		
		tvsee.debug("time:" + time + ",time:" + (date.getFullYear() + ":" + (date.getMonth() + 1) + ":" + date.getDate()  + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()) + ",data[i].beginTime:" + new Date(data[i].beginTime).getTime() + ",beginTime:" + data[i].beginTime + ",data[i].endTime:" + new Date(data[i].endTime).getTime() + ",endTime:" + data[i].endTime);
		if(time>=new Date(Date.parse(data[i].beginTime.replace(/-/g, "/"))).getTime() && time < new Date(Date.parse(data[i].endTime.replace(/-/g, "/"))).getTime() ){
			return data[i];
		}
	}
	return lunBoProgram;
}

function getLunBoProgramList(_data, _cid){
	var size = _data.length;
	var programList = null;
	for(var i = 0; i < size; i++){
		if(_data[i].cid == _cid){
			programList = _data[i].linearProgramList;
			break;
		}	
	}
	return programList;
}