var globalLogParams = {
		logMediaPlayerFormat:{
			"type": "1", 	
			"content":[]
		},
		logUserActionFormat:{
			"type": "2", 	
			"content":[]	
		},
		mediaPlayerContent:{
			"mac": "", //终端有线mac地址
			"operateTime": "",  //毫秒数
			"actionType": "",  //操作类型
			"systemSource":	"",	//系统来源
			"professionType": "",	//业务类型
			"disConnReason": "",	//中断原因
			"catalogId": "",	//栏目id
			"pid":	"",	//节目集id
			"guid":	"",	//播放地址
			"episodeNo":  "", //集号
			"ratingsSource": "" //收视来源
		},
		userActionContent:{
			"mac": "",	//终端有线mac地址
			"pageName":	"",	//页面名称
			"operateTime": "",	//可是毫秒数
			"professionType": "",//业务类型
			"operateObjType": "",	//操作类型对象 
			"operateObjName": "", //操作类型名称
			"systemSource":	"" //系统来源
		}
}

function uploadLogs(_obj){
	/*if(globalLogParams.logMediaPlayerFormat.content.length == 0 && globalLogParams.userActionContent.content.length == 0){
		return;
	}*/
	var ajax = new ajaxClass();
	ajax.frame = window;
	ajax.url = getAjaxUrl("uploadLogs");
	ajax.urlParameters = jsonToString(_obj);
	// '{"type":"2","content":[{"mac":"123131231","operateTime":"2015/1/19 14:00:47","pageName":"first","systemSource":"aipu","operateObjType":"objtype","operateObjName":"objname"}]}'
	
	ajax.successCallback = function(){
		
	}
	ajax.failureCallback = function(){
		
	}
	ajax.requestData("post");
}

function clearLogs(){
	globalLogParams.logMediaPlayerFormat.content = [];	
	globalLogParams.userActionContent.content = [];
}

//在播放过程中定时向服务器发送日志
function timingMediaPlayerContent(){
	var actionType = 3;
	var ratingsSource = hashtable.get("ratingsSource");
	globalLogParams.mediaPlayerContent.ratingsSource = ratingsSource;
	//1-栏目  2-专题 3-推荐位 4-搜索 5-检索 6-导视 7-相关影片 8-最近更新 9-观看历史 10-收藏 11-追剧 50-直播 51-回看
	if(ratingsSource != 1 && ratingsSource != 50 && ratingsSource != 51){
		hashtable.put("catalogId", "");
	}
	if(ratingsSource == 6){
		hashtable.put("pid", "");
	}
	hashtable.put("disConnReason", "");
	globalLogParams.mediaPlayerContent.mac = getStbMac();
	globalLogParams.mediaPlayerContent.operateTime = parseInt(TvseeDate.getTime() / 1000, 10);
	globalLogParams.mediaPlayerContent.actionType = actionType;
	globalLogParams.mediaPlayerContent.systemSource = SYSTEM_SOURCE;
	globalLogParams.mediaPlayerContent.professionType = hashtable.get("professionType");
	globalLogParams.mediaPlayerContent.disConnReason = hashtable.get("disConnReason");
	globalLogParams.mediaPlayerContent.catalogId = hashtable.get("catalogId");
	globalLogParams.mediaPlayerContent.pid = hashtable.get("pid");
	globalLogParams.mediaPlayerContent.guid = hashtable.get("guid");
	globalLogParams.mediaPlayerContent.episodeNo = hashtable.get("episodeNo");
	globalLogParams.logMediaPlayerFormat.content.push(globalLogParams.mediaPlayerContent);
	uploadLogs(globalLogParams.logMediaPlayerFormat);
	globalLogParams.logMediaPlayerFormat.content = [];
}

function saveLogMediaPlayerContent(){
	var ratingsSource = hashtable.get("ratingsSource");
	var actionType = hashtable.get("actionType");
	globalLogParams.mediaPlayerContent.ratingsSource = hashtable.get("ratingsSource");
	//1-栏目  2-专题 3-推荐位 4-搜索 5-检索 6-导视 7-相关影片 8-最近更新 9-观看历史 10-收藏 11-追剧 50-直播 51-回看
	if(ratingsSource != 1 && ratingsSource != 50 && ratingsSource != 51){
		hashtable.put("catalogId", "");
	}
	//ratingsSource == 3 || 
	if(ratingsSource == 6){
		hashtable.put("pid", "");
	}
	if(actionType == 1){
		hashtable.put("disConnReason", "");
	}
	globalLogParams.mediaPlayerContent.mac = getStbMac();
	globalLogParams.mediaPlayerContent.operateTime = parseInt(TvseeDate.getTime() / 1000, 10);
	globalLogParams.mediaPlayerContent.actionType = actionType;
	globalLogParams.mediaPlayerContent.systemSource = SYSTEM_SOURCE;
	globalLogParams.mediaPlayerContent.professionType = hashtable.get("professionType");
	globalLogParams.mediaPlayerContent.disConnReason = hashtable.get("disConnReason");
	globalLogParams.mediaPlayerContent.catalogId = hashtable.get("catalogId");
	globalLogParams.mediaPlayerContent.pid = hashtable.get("pid");
	globalLogParams.mediaPlayerContent.guid = hashtable.get("guid");
	globalLogParams.mediaPlayerContent.episodeNo = hashtable.get("episodeNo");
	
	globalLogParams.logMediaPlayerFormat.content.push(globalLogParams.mediaPlayerContent);	
	//globalLogParams.logMediaPlayerFormat.content = globalLogParams.mediaPlayerContent;
	uploadLogs(globalLogParams.logMediaPlayerFormat);
	globalLogParams.logMediaPlayerFormat.content = [];
}

function getStbMac(){
	var mac = "";
	if(typeof(globalvar) == "object"){
		mac = globalvar.get("ca_mac");
	}
	return mac;
}
function saveLogUserActioncontent(){
	var pageName = hashtable.get("pageName");
	//pageName:	1-首页 2-列表 3-详情 4-专题 5-搜索 6-检索 7-最近更新 8-观看历史 9-收藏 10-追剧 11-播放页  50-直播 51-回看
	//pageName == 1 || 
	if(pageName == 7 || pageName == 8 || pageName == 9 || pageName == 11){
		 hashtable.put("operateObjType", "");
		 hashtable.put("operateObjName", "");
	}
	globalLogParams.userActionContent.mac = getStbMac();
	globalLogParams.userActionContent.pageName = pageName;
	globalLogParams.userActionContent.operateTime =  parseInt(TvseeDate.getTime() / 1000, 10);
	globalLogParams.userActionContent.professionType = hashtable.get("professionType");
	globalLogParams.userActionContent.operateObjType = hashtable.get("operateObjType");
	globalLogParams.userActionContent.operateObjName = hashtable.get("operateObjName");
	globalLogParams.userActionContent.systemSource = SYSTEM_SOURCE;
	
	/*
	"mac": "",	//终端有线mac地址
			"pageName":	"",	//页面名称
			"operateTime": "",	//可是毫秒数
			"professionType": "",//业务类型
			"operateObjType": "",	//操作类型对象 
			"operateObjName": "", //操作类型名称
			"systemSource":	"" //系统来源
	*/
	globalLogParams.logUserActionFormat.content.push(globalLogParams.userActionContent);
	//globalLogParams.logUserActionFormat.content = globalLogParams.userActionContent;
	uploadLogs(globalLogParams.logUserActionFormat);
	hashtable.put("operateObjType", "");
	hashtable.put("operateObjName", "");
	globalLogParams.logUserActionFormat.content = [];
}