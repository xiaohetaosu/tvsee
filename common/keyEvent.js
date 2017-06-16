var userAgent = navigator.userAgent.toLowerCase();
var isIpanel = userAgent.indexOf("ipanel") != -1;
var isIpanelVane = userAgent.indexOf("ipanelvane") != -1 || (isIpanel == true && userAgent.indexOf("vane") != -1);
var isAndroid = userAgent.indexOf("android") != -1 || typeof(androidExtApi_app) != "undefined";

var EVENT_DESC = {
	STOP: false, //0
	DOWN: true, //1
	ADVECTED: true, //2
	KEYEVENT: 1,
	SYSTEMEVENT: 2
};
/**
 * 按键键值和系统消息值的映射
 */
var Event = {
	mapping: function(_event) {
		var keycode = _event.which || _event.keyCode;
		var code = "";
		var args = {
			modifiers: _event.modifiers || 0,
			value: keycode,
			type: EVENT_DESC.STOP
		};
		/*----------KEYS----------*/
		if (keycode >= 48 && keycode <= 57) { //Standard, Typewriter keys
			code = "KEY_NUMERIC";
			args.value = keycode - 48;
		} else if (keycode >= 96 && keycode <= 105) { //Standard, Numeric keypad
			code = "KEY_NUMERIC";
			args.value = keycode - 96;
		} /*else if (keycode >= 65 && keycode <= 90) { //Standard, Typewriter keys
			code = "KEY_LETTER";
			args.value = keycode - 65;
		}*/ else if (keycode >= 112 && keycode <= 123) { //Standard, Function keys
			code = "KEY_F" + (keycode - 112 + 1);
			args.value = keycode;
		} else {
			switch (keycode) {
			/*----------KEY/IRKEY----------*/
			case 38: //Standard, Cursor control key
			case 1:
			case 269:
			case 65361:
				code = "KEY_UP"; //上
				break;
			case 40: //Standard, Cursor control key
			case 2:
			case 270:
			case 65364:
				code = "KEY_DOWN"; //下
				break;
			case 37: //Standard, Cursor control key
			case 3:
			case 271:
			case 65361:
				code = "KEY_LEFT"; //左
				break;
			case 39: //Standard, Cursor control key
			case 4:
			case 272:
			case 65363:
				code = "KEY_RIGHT"; //右
				break;
			case 13: //Standard, Enter key
			case 273:
			case 65293:
				code = "KEY_SELECT"; //确认
				break;
			case 339:
				code = "KEY_EXIT"; //退出
				args.type = EVENT_DESC.DOWN; 
				break;
			case 8: //Standard, Typewriter keys
			case 340:
			case 27:
			case 0:
			case 640:
			case 65367:
				code = "KEY_BACK"; //返回
				break;
			case 73:
			case 17:
				code = "KEY_MENU"; //菜单
				break;
				
			case 67:
			case 63563:
			case 597:
			case 167: 
			case 179:
				code = "KEY_MUTE"; //静音
				break;
			case 61:
			case 187:
			case 63561:
			case 595:
			case 174:
				code = "KEY_VOLUME_UP"; //音量上
				args.type = EVENT_DESC.DOWN;
				break;
			case 45:
			case 63562:
			case 189:
			case 596:
			case 175:
				code = "KEY_VOLUME_DOWN"; //音量减
				args.type = EVENT_DESC.DOWN;
				break;
			case 33:
				code = "KEY_PAGE_UP";
				break;
			case 34:
				code = "KEY_PAGE_DOWN";
				break;
			case 173: //Standard, and with the function key
			case 597: //[.]
			case 63563: //河南，天柏
				code = "KEY_VOLUME_MUTE";
				args.type = EVENT_DESC.DOWN;
				break;
			case 1026:
				code = "KEY_PAUSE"; //暂停
				break;
			case 1024:
				code = "KEY_PLAY"; //播放
				break;
			case 1029:
			case 118:
				code = "KEY_SEEK_LEFT"; //seek左
				break;
			case 1028:
			case 119:
				code = "KEY_SEEK_RIGHT"; //seek右
				break;
			case 115: //停止
				code = "KEY_STOP";
				break;
			case 114: //播放or暂停
				code = "KEY_PLAY_OR_PAUSE";
				break;
			case 85: //频道up
				code = "KEY_CHANNEL_UP";
				break;
			case 86: //频道down
				code = "KEY_CHANNEL_DOWN";
				break;
			}
		}
		if (code == "") {
			args.type = EVENT_DESC.DOWN;
		}
		var obj = {
			code: code,
			args: args
		};
		if(keyEventParams.isAutoExecution == true){
			if(keyEventParams.isAutoExecutionMethod(obj) == true){
				autoExecutionFunction(obj);
			}
		}
		return obj;
	}
};



var keyEventParams = {
	frame: window,
	isAutoExecution: false,//是否自动执行keys里面定义的方法
	keys: [
			{code: "KEY_NUMERIC", method: "deal_number"}, //code  表示Event.mapping里面的code值，method表示对应code执行的方法
			{code: "KEY_UP", method: "deal_up"},
			{code: "KEY_DOWN", method: "deal_down"},
			{code: "KEY_LEFT", method: "deal_left"},
			{code: "KEY_RIGHT", method: "deal_right"},
			{code: "KEY_SELECT", method: "deal_return"},
			{code: "KEY_EXIT", method: "deal_exit"}, 
			{code: "KEY_BACK", method: "deal_back"},
			{code: "KEY_MENU", method: "deal_menu"},
			{code: "KEY_VOLUME_UP", method: "deal_volume_up"},
			{code: "KEY_VOLUME_DOWN",method: "deal_volume_down"},
			{code:"KEY_PAUSE", method: "deal_pause"},
			{code: "KEY_PLAY", method: "deal_play"},
			{code: "KEY_SEEK_LEFT", method: "deal_seek_left"}, 
			{code: "KEY_SEEK_RIGHT", method: "deal_seek_right"},
			{code: "KEY_STOP", method: "deal_stop"},
			{code: "KEY_PLAY_OR_PAUSE", method: "deal_play_or_pause"},
			{code: "KEY_CHANNEL_UP", method: "deal_channel_up"},
			{code: "KEY_CHANNEL_DOWN", method: "deal_channel_down"}
		   ],
	isAutoExecutionMethod: null //当提示的时候，不能然后任何按键触发，可以传递此参数
}


function autoExecutionFunction(_obj){
	var keysLength = keyEventParams.keys.length;
	for(var i = 0;i < keysLength; i++){
		if(keyEventParams.keys[i].code == _obj.code){
			if(typeof(keyEventParams.frame[keyEventParams.keys[i].method]) == "function"){
				keyEventParams.frame[keyEventParams.keys[i].method](_obj);
			}
			break;
		}
	}
}
/*function doKeyDown_keyboard(event){
	if(typeof(keyEventParams.frame.eventHandler) == "function"){
		keyEventParams.frame.eventHandler(Event.mapping(event), event);
	}
	/*alert("test");
	Event.mapping(event);
}*/
/*
	_frame: 表示页面对象
	_isAutoExecution: 是否自动执行keys里面文件
	_keys: 表示执行的code方法与数组
	_isAutoExecutionMethod: 当提示的时候，不能然后任何按键触发，可以传递此参数,让其返回false,就不会执行keys对象里面的method
*/

function initPage(_frame, _isAutoExecution, _isAutoExecutionMethod, _keys) {
	keyEventParams.frame = _frame;
	if(typeof(_keys) != "undefined"){
		if(_keys != "" && _keys != null){
			keyEventParams.keys = _keys;	 
		}
	}
	if(typeof(_isAutoExecution) != "undefined"){
		keyEventParams.isAutoExecution = _isAutoExecution;	
		keyEventParams.isAutoExecutionMethod = _isAutoExecutionMethod || function(){return true};
	}
	_frame.$ = function(_id) {
		return _frame.document.getElementById(_id);
	};
	if (typeof(_frame.eventHandler) != "function") {
		_frame.eventHandler = function(_eventObj) {
			return Event.mapping(_eventObj);	
		};
	}
	_frame.document.onkeydown = function(_event) {
			_frame.eventHandler(Event.mapping(_event));
			try{
				tvsee.eventFrame.globalParams.globalCache.put("chrometest", 11);
				tvsee.eventFrame.globalParams.globalCache.put("timeCount", 0);
				tvsee.eventFrame.globalParams.globalCache.put("isSaverStatus", 1);
				document.getElementById("saverDiv").style.display = "none";
			}catch(e){
//				alert(e)
				//TODO handle the exception
			}
//			tvsee.eventFrame.globalParams.globalCache.put("timeCount", 0);
//					var saverStatus = "block";
////					clearInterval(timetwo);
//var pagePid = 0;
//					//					timeOne = setInterval("timeClock()", 10000);
//					if(saverStatus == "block") {
//						var i = pagePid;
//						var saverType = "vod"
//						var saverPid = 1000034272;
//						if(saverType == "catalog") {
//							if(saverPid == 1) {
//								var saverClname = "电影";
//							}
//							if(saverPid == 2) {
//								var saverClname = "电视剧";
//							}
//							if(saverPid == 6) {
//								var saverClname = "综艺";
//							}
//							if(saverPid == 4) {
//								var saverClname = "动漫";
//							}
//							if(saverPid == 3) {
//								var saverClname = "纪录片";
//							}
//							if(saverPid == 15) {
//								var saverClname = "少儿";
//							}
//							if(saverPid == 100001) {
//								var saverClname = "银河VIP";
//							}
//							if(saverPid == 100004) {
//								var saverClname = "精彩记录";
//							}
////							gotoProgramListPage(saverPid, saverClname);
////							document.getElementById("saverDiv").style.display = "none";
////							document.getElementById("img" + saverCount % maxLength).style.display = "none";
//							return;
//						} else {
//							if(saverPid == "" || saverPid == null) {
////								document.getElementById("saverDiv").style.display = "none";
////								document.getElementById("img" + saverCount % maxLength).style.display = "none";
//								return;
//							} else {
////								getMovieType();
//								function getMovieType() {
//									var severUrl = VODEPG_SERVER + "GetMoviesByProgramId.action";
////									var lengNum = saver.length;
//									var i = 1;
//									var asc = "asc";
//									//				alert(i);
//									var saverPid = 1000034272;
//									jQuery.ajax({
//										type: "get",
//										url: severUrl,
//										data: {
//											pid: saverPid,
//											count: 0,
//											taxis: asc,
//										},success: function(data) {
//											alert(dataArr);
//											var dataArr = data.movies;
//											pidType = dataArr[0].movietype;
//											alert(pidType);
//											if(pidType == "电影") {
//												gotoDetailPage(saverPid, "detailed");
//											}
//											if(pidType == "电视剧") {
//												gotoDetailPage(saverPid, "detailed");
//											}
//											if(pidType == "综艺") {
//												gotoDetailPage(saverPid, "variety");
//											}
//											if(pidType == "其他") {
//												gotoDetailPage(saverPid, "otherDetail");
//											}
//											document.getElementById("saverDiv").style.display = "none";
//								            document.getElementById("img" + saverCount % maxLength).style.display = "none";
//										},
//									})
//								}
//							}
//						}
//					} else {
//						return
//					}
//			getMovieType();
//          console.log(saverCount%maxLength);
             return;
	};
	_frame.document.onirkeypress = function() {
//		alert(Event.mapping(_event).code);
        
		return (_frame.eventHandler(Event.mapping(_frame.event)));
	};
	_frame.document.onsystemevent = function() {
		return (_frame.eventHandler(Event.mapping(_frame.event)));
	};
	_frame.exitAppTip = function(){
		if(_frame.IS_BACK_EXIT == false){
			return;	
		}
		var widgetDialog = tvsee.pageWidgets.getByName("widgetDialog");
		if(widgetDialog != null){
			widgetDialog.initData(["是否退出当前应用?", 0], [["确认", "取消"], 0], function(_btnArea, _callParams){
				if(_btnArea == 0){
					exitApp();
				}	
				if(_frame.globalParams.isParentFocus == false){
					_frame.frames[_frame.globalParams.ifrChildName].focus();	
				}
			});	
			widgetDialog.show();
		}		
	}
}

function gotoDetailPage(pid,type){
	if(pid == ""){
		return;
	}
	var goToUrl = "vodDetail.html?pid=" + pid;
	goToUrl += "&fromPage=HOME&windowSize=fullScreen";
	if(type == "variety"){//综艺详情页
		goToUrl = " vodVarietyDetailNew.html?pid=" + pid;
		goToUrl += "&fromPage=HOME&windowSize=fullScreen";
	}else if(type == "otherDetail"){
		goToUrl = " vodVarietyDetail.html?pid=" + pid;
		goToUrl += "&fromPage=HOME&windowSize=fullScreen";
	}
	hashtable.put("ratingsSource", 3);
	//goToUrl = "userManager_kunming.html";
	tvsee.pageWidgets.getByName("widgetMenu").hideWin();
	gotoPageUrl(goToUrl);
}

function keyEventDeal(_vDir, _gCurObjId, _getFocus) {
    if (typeof(_gCurObjId) == "undefined") {
        return;
    }
    var curObj = document.getElementById(_gCurObjId);
    var nextObjId = curObj.getAttribute(_vDir);
    if (nextObjId == null || nextObjId == "" || nextObjId == "#") {
        return;
    }
    /* 处理多个操作定义 */
    var arrObjId = nextObjId.split(";");
    for (var i = 0; i < arrObjId.length; i = i + 1) {
        if (arrObjId[i].length > 2 && arrObjId[i].substr(0, 1) == "#") {
            var vFunc = arrObjId[i].substr(1, arrObjId[i].length - 1);
            eval(vFunc);
        } else {
            _getFocus(_gCurObjId, _vDir, arrObjId[i]);//此方法治允许执行一次，因为一个页面不允许出现多个焦点
        }
    }
}

	 
