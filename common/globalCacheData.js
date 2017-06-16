var globalCache = {
	isVIP:null,
	adMation:null,
	chrometest:null,
	CITY:null,
	timeCount:null,
	isSaverStatus:1,
	userAjaxObj: null,
	favoriteAjaxObj: null,
	recordAjaxObj: null,
	recordQueryAjaxObj: null,
	addTvAjaxObj: null,
	playMarkAjaxObj: null,
	ruAjaxObj: null,
	movieTypeAjaxObj: null,
	favoriteObj: [],
	recordObj: [],
	addTvObj: [],
	playMarkObj: [],
	liveObj:[],
	liveCache:[],
	homeRecomendClass : [],
	versionArr: [],
	homeMenus: null,
	payInfoAjaxObj: null,
	payInfo: null,
	queryCustomerAjaxObj: null,
	lunBoChannelAjaxObj: null,
	launcherRecomendClass: []
}
function initCacheData(){
	//return;
	getPayInfoResult();
	getLunBoChannelList();
	//getQueryCustomer();
	//getAllChannel();
	//用户登录
	/*globalCache.userAjaxObj = new ajaxClass();
	globalCache.userAjaxObj.frame = window;
	globalCache.userAjaxObj.url = getAjaxUrl("userLoginByUserName",globalParams.stbCache.mac,"111111",globalParams.stbCache.stbId,globalParams.stbCache.mac);
	globalCache.userAjaxObj.successCallback = function(_xmlHttp, _params) {
		eval("globalParams.userCache = (" + _xmlHttp.responseText + ").result");
		//在这里暂时写上用户信息返回成功
		eval("globalParams.userCache ={result_code:'0',result_info:'成功',username:'"+globalParams.stbCache.mac+"'}");
	};
	globalCache.userAjaxObj.failureCallback = function(_xmlHttp, _params) {
		
	};
	globalCache.userAjaxObj.requestData();*/
	//return;
	//收藏
	globalCache.favoriteAjaxObj = new ajaxClass();
	globalCache.favoriteAjaxObj.frame = window;
	//globalCache.favoriteAjaxObj.async = false;
	globalCache.favoriteAjaxObj.url = getAjaxUrl("newUserQueryFavorite");
	globalCache.favoriteAjaxObj.successCallback = function(_xmlHttp, _params) {
		eval("var data = (" + _xmlHttp.responseText + ").PFList");
		globalParams.globalCache.put("favorite_CACHE", data);
	};
	globalCache.favoriteAjaxObj.failureCallback = function(_xmlHttp, _params) {
		
	};
	globalCache.favoriteAjaxObj.requestData();
	
	//最近观看
	globalCache.recordAjaxObj = new ajaxClass();
	globalCache.recordAjaxObj.frame = window;
	globalCache.recordAjaxObj.url = getAjaxUrl("newUserQueryRecord");
	globalCache.recordAjaxObj.successCallback = function(_xmlHttp, _params) {
		eval("var data = (" + _xmlHttp.responseText + ").PLWList");
		globalParams.globalCache.put("record_CACHE", data);
	};
	globalCache.recordAjaxObj.failureCallback = function(_xmlHttp, _params) {
		
	};
	globalCache.recordAjaxObj.requestData();
	
	//最近观看分组
	globalCache.recordQueryAjaxObj = new ajaxClass();
	globalCache.recordQueryAjaxObj.frame = window;
	globalCache.recordQueryAjaxObj.url = getAjaxUrl("newUserQueryGroupRecord");
	globalCache.recordQueryAjaxObj.successCallback = function(_xmlHttp, _params) {
		eval("var data = (" + _xmlHttp.responseText + ").historyDateHashtable");
		globalParams.globalCache.put("recordGroup_CACHE", data);
	};
	globalCache.recordQueryAjaxObj.failureCallback = function(_xmlHttp, _params) {
		
	};
	globalCache.recordQueryAjaxObj.requestData();
	
	//我的追剧
	globalCache.addTvAjaxObj = new ajaxClass();
	globalCache.addTvAjaxObj.frame = window;
	globalCache.addTvAjaxObj.url = getAjaxUrl("userQueryMyTV");
	globalCache.addTvAjaxObj.successCallback = function(_xmlHttp, _params) {
		eval("var data = (" + _xmlHttp.responseText + ").listPAT");
		globalParams.globalCache.put("addTv_CACHE", data);
	};
	globalCache.addTvAjaxObj.failureCallback = function(_xmlHttp, _params) {
		
	};
	globalCache.addTvAjaxObj.requestData();
	
	//最近更新
	/*globalCache.ruAjaxObj = new ajaxClass();
	globalCache.ruAjaxObj.frame = window;
	globalCache.ruAjaxObj.url = getAjaxUrl("getNewOnlinePrograms",18);
	globalCache.ruAjaxObj.successCallback = function(_xmlHttp, _params) {
		eval("var data = (" + _xmlHttp.responseText + ").programs");
		globalParams.globalCache.put("recentlyUpdated_CACHE", data);
	};
	globalCache.ruAjaxObj.failureCallback = function(_xmlHttp, _params) {
		
	};
	globalCache.ruAjaxObj.requestData();
	*/
	//节目分类信息
	/*globalCache.movieTypeAjaxObj = new ajaxClass();
	globalCache.movieTypeAjaxObj.frame = window;
	globalCache.movieTypeAjaxObj.url = getAjaxUrl("getAllGroupType");
	globalCache.movieTypeAjaxObj.successCallback = function(_xmlHttp, _params) {
		eval("var data = (" + _xmlHttp.responseText + ").PSGTList");
		globalParams.globalCache.put("typeList", data);
	};
	globalCache.movieTypeAjaxObj.failureCallback = function(_xmlHttp, _params) {
		
	};
	globalCache.movieTypeAjaxObj.requestData();
	*/
	
	//播放标记
	globalCache.playMarkAjaxObj = new ajaxClass();
	globalCache.playMarkAjaxObj.frame = window;
	globalCache.playMarkAjaxObj.url = getAjaxUrl("userQueryPlayMark");
	globalCache.playMarkAjaxObj.successCallback = function(_xmlHttp, _params) {
		eval("var data = (" + _xmlHttp.responseText + ").PPMList");
		globalParams.globalCache.put("playMark_CACHE", data);
	};
	globalCache.playMarkAjaxObj.failureCallback = function(_xmlHttp, _params) {
		
	};
	globalCache.playMarkAjaxObj.requestData();	
	//0: 收藏成功	 1: 已收藏  2: 超出收藏个数
	globalCache.favoriteObj.add = function(_obj){
		if(globalCache.favoriteObj.get(_obj.pid) == true){
			return 1;	
		}
		var value = globalParams.globalCache.get("favorite_CACHE");
		value.unshift(_obj);
		globalParams.globalCache.put("favorite_CACHE", value);
		var ajaxObj = new ajaxClass();
		ajaxObj.frame = window;
		ajaxObj.url = getAjaxUrl("newUserSaveFavorite", _obj.pid, _obj.programName, _obj.picUrl, _obj.movieType, _obj.definition, _obj.spid, _obj.cateId, _obj.programId);
		ajaxObj.requestData();
		return 0;
	}
	globalCache.favoriteObj.get = function(_pid){
		var value = globalParams.globalCache.get("favorite_CACHE");
		for(var i = 0; i < value.length; i++){
			if(value[i].pid == _pid){
				return true;
				break;
			}	
		}
		return false;
	}
	globalCache.favoriteObj.del = function(_pid){
		var value = globalParams.globalCache.get("favorite_CACHE");
		for(var i = 0; i < value.length; i++){
			if(value[i].pid == _pid){
				value.splice(i, 1);	
				break;
			}	
		}
		globalParams.globalCache.put("favorite_CACHE", value);	
		var ajaxObj = new ajaxClass();
		ajaxObj.frame = window;
		ajaxObj.url = getAjaxUrl("newUserDelFavorite", _pid);
		ajaxObj.requestData();
	}
	globalCache.recordObj.getEpisode = function(_pid){
		var value = globalParams.globalCache.get("record_CACHE");
		for(var i = 0; i < value.length; i++){
			if(value[i].pid == _pid){
				return value[i].watchEpisode;
			}
		}
		return -1;
	}
	globalCache.recordObj.add = function(_obj){
		if(_obj.totalEpisode == null || _obj.totalEpisode == "null"){
			_obj.totalEpisode = 0;	
		}
		var value = globalParams.globalCache.get("record_CACHE");	
		var groupValue = globalParams.globalCache.get("recordGroup_CACHE");
		if(typeof(groupValue) != "object" || typeof(value) != "object"){
			return;	
		}
		if(globalCache.recordObj.getEpisode(_obj.pid) != -1){
			for(var i = 0; i < value.length; i++){
				if(value[i].pid == _obj.pid){
					value[i].watchEpisode = _obj.watchEpisode;
				}
			}
			for(var i = 0; i < groupValue.other.length; i++){
				if(groupValue.other[i].pid == _obj.pid){
					groupValue.other.splice(i, 1);	
				}	
			}
			for(var i = 0; i < groupValue.january.length; i++){
				if(groupValue.january[i].pid == _obj.pid){
					groupValue.january.splice(i, 1);	
				}	
			}
			for(var i = 0; i < groupValue.week.length; i++){
				if(groupValue.week[i].pid == _obj.pid){
					groupValue.week.splice(i, 1);	
				}	
			}
		}else{
			value.push(_obj);
		}
		globalParams.globalCache.put("record_CACHE", value)
		groupValue.week.unshift(_obj);	
		globalParams.globalCache.put("recordGroup_CACHE", groupValue);
		var ajaxObj = new ajaxClass();
		ajaxObj.frame = window;
		ajaxObj.url = getAjaxUrl("newUserSaveRecord", _obj.pid, _obj.programName, _obj.picUrl, _obj.movieType, _obj.definition, _obj.spid, _obj.cateId, _obj.programId, _obj.totalEpisode, _obj.watchEpisode);
		ajaxObj.requestData();
	}
	globalCache.recordObj.del = function(_pid){
		var value = globalParams.globalCache.get("record_CACHE");	
		var groupValue = globalParams.globalCache.get("recordGroup_CACHE");
		for(var i = 0; i < value.length; i++){
			if(value[i].pid == _obj.pid){
				value.splice(i, 1);
			}
		}
		globalParams.globalCache.put("record_CACHE", value);	
		for(var i = 0; i < groupValue.other.length; i++){
			if(groupValue.other[i].pid == _obj.pid){
				groupValue.other[i].splice(i, 1);	
			}	
		}
		for(var i = 0; i < groupValue.january.length; i++){
			if(groupValue.january[i].pid == _obj.pid){
				groupValue.january[i].splice(i, 1);	
			}	
		}
		for(var i = 0; i < groupValue.week.length; i++){
			if(groupValue.week[i].pid == _obj.pid){
				groupValue.week[i].splice(i, 1);	
			}	
		}
		globalParams.globalCache.put("recordGroup_CACHE", groupValue);
		var ajaxObj = new ajaxClass();
		ajaxObj.frame = window;
		ajaxObj.url = getAjaxUrl("newUserDelRecord", _pid);
		ajaxObj.requestData();
	}
	
	globalCache.addTvObj.get = function(_pid){
		var value = globalParams.globalCache.get("addTv_CACHE");	
		for(var i = 0; i < value.length; i++){
			if(value[i].pid == _pid){
				return true;
				break;
			}
		}
		return false;
	}
	//0: 追剧成功
	globalCache.addTvObj.add = function(_obj){
		var value = globalParams.globalCache.get("addTv_CACHE");
		var isAt = false;
		for(var i = 0; i < value.length; i++){
			if(value[i].pid == _obj.pid){
				value[i].watchEpisode = _obj.watchEpisode;
				isAt = true;
				break;
			}	
		}
		var ajaxObj = new ajaxClass();
		ajaxObj.frame = window;
		if(isAt == false){
			//value.push(_obj);
			value.unshift(_obj);
			ajaxObj.url = getAjaxUrl("userSaveMyTV", _obj.pid, _obj.programName, _obj.picUrl, _obj.movieType, _obj.definition, _obj.spid, _obj.cateId, _obj.programId, _obj.totalEpisode, _obj.watchEpisode);
		}else{
			ajaxObj.url = getAjaxUrl("userUpdateMyTVEpisode", _obj.pid, _obj.watchEpisode);	
		}
		ajaxObj.requestData();
		globalParams.globalCache.put("addTv_CACHE", value);
		return 0;
	}
	
	globalCache.addTvObj.del = function(_pid){
		var value = globalParams.globalCache.get("addTv_CACHE");
		for(var i = 0; i < value.length; i++){
			if(value[i].pid == _pid){
				value.splice(i, 1);
				break;
			}	
		}
	    globalParams.globalCache.put("addTv_CACHE", value);
		var ajaxObj = new ajaxClass();
		ajaxObj.frame = window;
		ajaxObj.url = getAjaxUrl("userDelMyTV", _pid);
		ajaxObj.requestData();
	}
	globalCache.playMarkObj.getTimelength = function(_guid){
		var value = globalParams.globalCache.get("playMark_CACHE");
		for(var i = 0; i < value.length; i++){
			if(value[i].guid == _guid){
				return value[i].timelength;
				break;	
			}	
		}
		return -1;
	}
	globalCache.playMarkObj.add = function(_obj){
		var isAt = false;
		var value = globalParams.globalCache.get("playMark_CACHE");
		/*for(var i = 0; i < value.length; i++){
			if(value[i].guid == _obj.guid){
				value[i].timelength = _obj.timelength;
				isAt = true;
				break;	
			}	
		}*/
		var tmpValue = [];
		for(var i = 0; i < value.length; i++){
			if(value[i].pid != _obj.pid){
				tmpValue.push(value[i]);
			}
		}
		tmpValue.unshift(_obj);
		//if(isAt == false){
		//	value.push(_obj);		
		//}
		globalParams.globalCache.put("playMark_CACHE", tmpValue);
		var ajaxObj = new ajaxClass();
		ajaxObj.frame = window;
		ajaxObj.url = getAjaxUrl("userAddPlayMark", _obj.pid, _obj.guid, _obj.timelength);
		ajaxObj.requestData();
	}
	globalCache.playMarkObj.del = function(_guid){
		var value = globalParams.globalCache.get("playMark_CACHE");
		for(var i = 0; i < value.length; i++){
			if(value[i].guid == _guid){
				//value[i].timelength = _obj.timelength;
				value.splice(i, 1);
				break;	
			}	
		}
		globalParams.globalCache.put("playMark_CACHE", value);
		var ajaxObj = new ajaxClass();
		ajaxObj.frame = window;
		ajaxObj.url = getAjaxUrl("userDelPlayMark", _guid);
		ajaxObj.requestData();
	}
	//保存前缓存观看的直播频道
	globalCache.liveObj.add = function(_obj){
		globalCache.liveObj.get(_obj);
		var ajaxObj = new ajaxClass();
		ajaxObj.frame = window;
		ajaxObj.url = getAjaxUrl("saveLastWatchTvChannel",_obj.tvId,_obj.tvName,_obj.channelId,_obj.channelName,_obj.picUrl);
		ajaxObj.requestData();
	}
	globalCache.liveObj.get = function(_obj){
		var bol = false;
		var value = globalParams.globalCache.get("lastWatchTvChannel_CACHE");
		if(value != false){
			for(var i = 0; i < value.length; i++){
				if(value[i].channelId == _obj.channelId){
					value[i].tvId = _obj.tvId;
					value[i].tvName = _obj.tvName;
					value[i].channelId = _obj.channelId;
					value[i].channelName = _obj.channelName;
					value[i].picUrl = _obj.picUrl;
					value[i].updateDate = _obj.updateDate;
					value[i].watchCount = parseInt(value[i].watchCount)+parseInt(_obj.watchCount);
					bol=true;
					break;
				}	
			}
			if(!bol){
				value.unshift(_obj);
			}
			//排序处理
			var tmpdata;
			for(var i=0;i<value.length;i++){
				for(var j=0;j<value.length;j++){
					if(value[i].updateDate > value[j].updateDate){
						tmpdata = value[j];
						value[j] = value[i];
						value[i] = tmpdata;
					}
				}
			}
			if(value.length>11){
				value.pop();
			}
			globalParams.globalCache.put("lastWatchTvChannel_CACHE",value);
		}
	}
}
//获取支付记录
function getPayInfoResult(){
	if(globalCache.payInfoAjaxObj !=  null){
		globalCache.payInfoAjaxObj.requestAbort();
	}
	globalCache.payInfoAjaxObj = new ajaxClass();
	globalCache.payInfoAjaxObj.frame = window;
	globalCache.payInfoAjaxObj.url = getAjaxUrl("memberPayInfo");
	globalCache.payInfoAjaxObj.successCallback = function(_xmlHttp, _params) {
		eval("var data = (" + _xmlHttp.responseText + ")");
		globalParams.globalCache.put("payInfo_CACHE", data);
	};
	globalCache.payInfoAjaxObj.failureCallback = function(_xmlHttp, _params) {
		
	};
	globalCache.payInfoAjaxObj.requestData();
}

//获取用户是否注册及信息
function getQueryCustomer(){
	if(globalCache.queryCustomerAjaxObj != null){
		globalCache.queryCustomerAjaxObj.requestAbort();
	}
	globalCache.queryCustomerAjaxObj = new ajaxClass();
	globalCache.queryCustomerAjaxObj.frame = window;
	globalCache.queryCustomerAjaxObj.url = getAjaxUrl("queryCustomer");
	globalCache.queryCustomerAjaxObj.successCallback = function(_xmlHttp, _params) {
		eval("var data = (" + _xmlHttp.responseText + ")");
		globalParams.globalCache.put("queryCustomer_CACHE", data);
	};
	globalCache.queryCustomerAjaxObj.failureCallback = function(_xmlHttp, _params) {
		//getQueryCustomer();
	};
	globalCache.queryCustomerAjaxObj.requestData();
}

//获取轮播数据
function getLunBoChannelList(){
	if(globalCache.lunBoChannelAjaxObj != null){
		globalCache.lunBoChannelAjaxObj.requestAbort();
	}
	globalCache.lunBoChannelAjaxObj = new ajaxClass();
	globalCache.lunBoChannelAjaxObj.frame = window;
	globalCache.lunBoChannelAjaxObj.url = getAjaxUrl("luoBoChannelList");
	globalCache.lunBoChannelAjaxObj.successCallback = function(_xmlHttp, _params) {
		eval("var data = (" + _xmlHttp.responseText + ")");
		globalParams.globalCache.put("luoBoChannelList_CACHE", data);
	};
	globalCache.lunBoChannelAjaxObj.failureCallback = function(_xmlHttp, _params) {
		//getLunBoChannelList();
	};
	globalCache.lunBoChannelAjaxObj.requestData();
}

//注册
var updatePayInfoCount = 0;
var lunBoCount = 0;
//全局定时器
setInterval(function(){
	var focusName = frameManager.history[frameManager.history.length - 1];
	if(frameManager.history[frameManager.history.length - 1] == "widgetMenu"){
		if(menus[window.frames["widgetMenu"].menuSelectPos - 1].name == PLAYER_TYPE.LUNBO_PLAYER_NAME){
			tvsee.debug("widgetMenu lunBoCount:" + lunBoCount);
			lunBoCount++;	
		}else{
			lunBoCount = 0;	
			tvsee.debug("widgetMenu other menuPos lunBoCount :" + lunBoCount);
		}
	}else if(frameManager.history[frameManager.history.length - 1] == "widgetVodPlay"){
		tvsee.debug("widgetVodPlay lunBoCount:" + lunBoCount);
		lunBoCount++;	
	}else{
		tvsee.debug("other lunBoCount:" + lunBoCount);
		lunBoCount = 0;
	}
	if(lunBoCount == 20){
		lunBoCount = 0;
		getLunBoChannelList();
	}
},30000);














