/*** TVSeetvsGlobalVar : 客户端数据存储对象 */
var TVSeeGlobalVar = function() {
    this.obj = "undefined";
    this.objType = 0; // 1:由TVSee浏览器中间件实现，2:由HTML5中的 sessionStorage 实现，0-无实现
    if (typeof(globalvar) != "undefined") {
        this.obj = globalvar;
        this.objType = 1;
    } else if (typeof(sessionStorage) != "undefined") {
        this.obj = sessionStorage;
        this.objType = 2;
        sessionStorage.ca_stbid = "111111111111";
    }

    this.set = function(_key, _value) {
        if (this.objType == 1) {
            globalvar.set(_key, _value);
        } else if (this.objType == 2) {
            eval("sessionStorage." + _key + "='" + _value + "'");
        }
    }
    this.get = function(_key) {
        if (this.objType == 1) {
            return globalvar.get(_key);
        } else if (this.objType == 2) {
            return eval("sessionStorage." + _key);
        }
    }
}
var tvsGlobalVar = new TVSeeGlobalVar();

/*** TVSeeLogger : 日志记录对象 */
var TVSeeLogger = function(_epgVer, _deployVer) {
    this.enableLog = true; //是否启用日志
    this.enableSend = true; //是否向服务器发送日志
    this.CNTV_KEY = tvsGlobalVar.get("ca_stbid");

    this.SYSTEM_SOURCE = 2; //系统来源 : 1-易视腾，2-云立方
    this.SERVICE_TYPE = 1; //点播业务类型 : 1-P4P点播, 2-HTTP点播
    this.EPG_VERSION = "03"; //EPG版本：02-云立方1.0灵动版，03-云立方1.5酷动版
    if (_epgVer == "1.5") {
        this.EPG_VERSION = "03";
    } else if (_epgVer == "1.0") {
        this.EPG_VERSION = "02";
    }
    this.FSOURCE = 2; //数据来源 : 1-易视腾公网, 2-云立方公网, 3-济南驻地网, 4-河南驻地网, 5-邯郸（河北）驻地网
    if (_deployVer == "LANGCHAO") {
        this.FSOURCE = 3;
    } else if (_deployVer == "HENAN_sheng") {
        this.FSOURCE = 4;
    } else if (_deployVer == "HEBEI_sheng" || _deployVer == "HEBEI_enrich") {
        this.FSOURCE = 5;
    } else {
        this.FSOURCE = 2;
    }

    // 播放器事件记录
    this.playerEvent = function(_timeline, _event, _mode) {
        var timeSec = 0;
        timeSec = _timeline / 1000;
        var eventCode = "00";
        switch (_event) {
        case "playerStart":
            eventCode = "01";
            break; //01-播放开始
        case "playerFF":
            eventCode = "02";
            break; //02-播放快进（保留）
        case "playerFR":
            eventCode = "03";
            break; //03-播放后退（保留）
        case "playerPause":
            eventCode = "04";
            break; //04-播放暂停
        case "playerBufStart":
            eventCode = "05";
            break; //05-缓冲开始
        case "playerEnd":
            eventCode = "06";
            break; //06-播放结束
        case "playerBufEnd":
            eventCode = "07";
            break; //07-缓冲结束
        case "playerSeek":
            eventCode = "08";
            break; //08-拖动
        case "playerResume":
            eventCode = "01";
            break; //01-播放开始，特指暂停恢复后开始
            //			case "playerStart":	eventCode="10";	break;	//10-播放恢复
        default:
            break;
        }

        if (_mode == "vod") { //只向服务器发送vod点播产生的日志信息
            this.savePlayerOpLog(eventCode, _timeline);
        }
    }

    this.doLog = function(_str) {
        if (this.enableSend && typeof(logger) != "undefined") {
            if (typeof(logger.log) == "function") {
                logger.log(_str);
            }
        }
    }

    /* 播放器行为日志
		格式：CNTV_ID|时间轴|操作类型标识|EPG版本号|栏目ID|节目集ID|节目ID 
	*/
    this.savePlayerOpLog = function(_type, _timeline) {
        if (this.enableLog) {
            var str = "VOL=";
            var cateIdLevel3 = ""; //三级栏目id
            var pid = tvsGlobalVar.get("VOD_LOG_pid"); //节目集id
            if (pid == "undefined" || pid == "" || pid == null || typeof(pid) == "undefined") {
                pid = "";
            }
            var guid = tvsGlobalVar.get("VOD_LOG_guid"); //guid
            if (guid == "undefined" || guid == "" || guid == null || typeof(guid) == "undefined") {
                guid = "";
            }

            str += this.CNTV_KEY + "|" + _timeline + "|" + _type + "|" + this.EPG_VERSION + "|" + cateIdLevel3 + "|" + pid + "|" + guid;
            this.doLog(str);
        }
    }

    /* 内容收视日志
		格式：CNTV_ID|操作时间|业务类型|节目集号|系统来源|视频类型|数据来源|中断原因|计费类型|三级栏目id|二级栏目id|一级栏目id|pid|guid|EPG版本号|收视来源
		收视来源（vodPathType）: 1-栏目点播, 2-专题点播, 3-推荐位点播, 4-搜索, 5-导视, 6-相关影片, 7-第三方
		中断原因（endReason）：0-正常挂断（VOD节目结束）, 1-用户中断, 2-Server内部错误, 3-和Client网络中断
	*/
    this.saveContentViewLog = function(_type) {
        if (this.enableLog) {
            var str = "";
            if (_type == 1) {
                hashtable.put("playStartTime", new Date().getTime());
                str += "VDB=";
            } else if (_type == 2) {
                str += "VDE=";
            }

            var programNo = tvsGlobalVar.get("VOD_LOG_programNo"); //节目集号
            if (programNo == "undefined" || programNo == null || typeof(programNo) == "undefined") {
                programNo = "";
            }

            var vodType = tvsGlobalVar.get("VOD_LOG_vodType"); //点播类型  普通与网络等
            if (vodType == null || vodType == "" || vodType == "undefined" || typeof(vodType) == "undefined") {
                vodType = 1;
            }

            var endReason = tvsGlobalVar.get("VOD_LOG_endReason"); //中断原因
            if (endReason == null || endReason == "" || endReason == "undefined" || typeof(endReason) == "undefined") {
                endReason = "";
            }

            var chargeType = tvsGlobalVar.get("VOD_LOG_chargeType"); //收费类型
            if (chargeType == null || chargeType == "" || chargeType == "undefined" || typeof(chargeType) == "undefined") {
                chargeType = 0;
            }

            var vodPathType = tvsGlobalVar.get("VOD_LOG_vodSource"); //点播来源  例:专题、栏目等
            if (vodPathType == "undefined" || vodPathType == null || vodPathType == "" || typeof(vodPathType) == "undefined") {
                vodPathType = "";
            }

            var cateIdLevel3 = ""; //三级栏目id
            var cateIdLevel2 = ""; //二级栏目id
            var cateIdLevel1 = ""; //一级栏目id
            if (vodPathType == 1) {
                cateIdLevel3 = tvsGlobalVar.get("VOD_LOG_cateIdLevel3");
                cateIdLevel2 = tvsGlobalVar.get("VOD_LOG_cateIdLevel2");
                cateIdLevel1 = tvsGlobalVar.get("VOD_LOG_cateIdLevel1");
                if (cateIdLevel3 == "undefined" || cateIdLevel3 == "" || cateIdLevel3 == null || typeof(cateIdLevel3) == "undefined") {
                    cateIdLevel3 = "";
                }
                if (cateIdLevel2 == "undefined" || cateIdLevel2 == "" || cateIdLevel2 == null || typeof(cateIdLevel2) == "undefined") {
                    cateIdLevel2 = "";
                }
                if (cateIdLevel1 == "undefined" || cateIdLevel1 == "" || cateIdLevel1 == null || typeof(cateIdLevel1) == "undefined") {
                    cateIdLevel1 = "";
                }
                /* Comment by hb on 2012.11.29 为什么要这样处理？*/
                //cateIdLevel3 = cateIdLevel1;
                //cateIdLevel1 = "";
            } else {
                hashtable.put("proGatherName", "");
                hashtable.put("cateIdLevelName2", "")
            }

            var pid = tvsGlobalVar.get("VOD_LOG_pid"); //节目集id
            if (pid == "undefined" || pid == "" || pid == null || typeof(pid) == "undefined") {
                pid = "";
            }

            var guid = tvsGlobalVar.get("VOD_LOG_guid"); //guid
            if (guid == "undefined" || guid == "" || guid == null || typeof(guid) == "undefined") {
                guid = "";
            }

            // Modify by hb on 20121129 : 在机顶盒上无法通过getDateTimeStr()获取真正的时间
            //str += get_CNTV_KEY() + "|" + getDateTimeStr() + "|" + SERVICE_TYPE + "|"  + programNo + "|"  + SYSTEM_SOURCE + "|" + vodType + "|" + FSOURCE + "|" + endReason + "|" +chargeType + "|" + cateIdLevel3 + "|" + cateIdLevel2 + "|" +cateIdLevel1 + "|" + pid + "|" + guid + "|" + EPG_VERSION + "|" + vodPathType ;
            var info = this.CNTV_KEY + "|" + "" + "|" + this.SERVICE_TYPE + "|" + programNo + "|" + this.SYSTEM_SOURCE + "|" + vodType + "|" + this.FSOURCE + "|" + endReason + "|" + chargeType + "|" + cateIdLevel3 + "|" + cateIdLevel2 + "|" + cateIdLevel1 + "|" + pid + "|" + guid + "|" + this.EPG_VERSION + "|" + vodPathType;
            str += info;
            this.doLog(str);
           if(IS_ADD_RECE_WATCH == true && _type == 2){// 保存最近观看记录
           		info = info + "|" + hashtable.get("cpid") + "|" + (new Date().getTime() - parseInt(hashtable.get("playStartTime"), 10)) + "|" + hashtable.get("proGatherName") + "|" + hashtable.get("cateIdLevelName2") + "|" + hashtable.get("movieName");
                saveRecentlyWatched(info);
            }
        }
    }
	function saveRecentlyWatched(_str){
		var movieInfoNames = ["ntvkey", "", "", "", "", "", "", "endReason", "", "categoryIdlevel3", "categoryIdlevel2", "categoryIdlevel1", "pid", "guid", "" , "", "cpId", "timeLength", "proGatherName", "categoryLevel2", "proName"];
		var infoArr = _str.split("|");
		var dataStr = "";
		for(var i = 0; i < infoArr.length; i++){
			if(movieInfoNames[i] == ""){
				continue;	
			}
			dataStr += movieInfoNames[i] + "=" + infoArr[i] + "&";
		}
		if(dataStr != ""){
			dataStr = dataStr.substring(0, dataStr.length - 1);
		}
		var ajaxObj = new ajaxClass();
		ajaxObj.frame = window;
		ajaxObj.url = getAjaxUrl("mossUserSaveRecord", dataStr);
		ajaxObj.successCallback = function(_xmlHttp, _params) {
		
		};
		ajaxObj.failureCallback = function(_xmlHttp, _params) {
		//$("type_0").innerText = "加载数据失败！";
		};
		ajaxObj.requestData();
	}
    /* EPG页面行为日志
		格式：CNTV_ID|EPG页面名称|操作时间|操作对象类型|搜索带关键字|操作对象|数据来源|EPG版本号|数据来源
		_type: 
			11-栏目(跳转进入)	//VOG
			22-搜索			//VOS
			25-导视			//VOV
			26-推荐位		//VOE
			27-相关影片	//VOR
			28-专题			//VOA
			29-播放			//VOD	
			30-检索			//VOQ
			31-收藏			//VOF
			32-追剧			//VOT
			33-最近观看		//VOW
	*/
    this.saveOperLog = function(_type) {
        if (this.enableLog) {
            var str = "";
            var searchKeywords = "";

            if (_type == 11) {
                str += "VOG=";
            } else if (_type == 22) {
                str += "VOS=";
              	searchKeywords = tvsGlobalVar.get("VOD_LOG_searchKeywords");
            } else if (_type == 25) {
                str += "VOV=";
               // operObjectType = "25";
				//operObject = tvsGlobalVar.get("VOD_LOG_pid");
            } else if (_type == 26) {
                str += "VOE=";
              //  operObjectType = "26";
				//operObject = tvsGlobalVar.get("VOD_LOG_pid");
            } else if (_type == 27) {
                str += "VOR=";
                //operObject = tvsGlobalVar.get("VOD_LOG_pid");
            } else if (_type == 28) {
                str += "VOA=";
              // operObjectType = "28";
				operObject = tvsGlobalVar.get("VOD_LOG_url");
            } else if (_type == 29) {
                str += "VOD=";
               // operObject = "3";
			  //  operObjectType = "3"; 
                //operObject = tvsGlobalVar.get("VOD_LOG_guid");
            }else if (_type == 30){
				str += "VOQ=";	
				//operObject = tvsGlobalVar.get("VOD_LOG_pid");
			}else if (_type == 31){
				str += "VOF=";	
				//operObject = tvsGlobalVar.get("VOD_LOG_pid");
			}else if (_type == 32){
				str += "VOT=";	
				//operObject = tvsGlobalVar.get("VOD_LOG_pid");
			}else if (_type == 33){
				str += "VOW=";	
				//operObject = tvsGlobalVar.get("VOD_LOG_pid");
			}
            var operObjectType = "1";
            var operObject = "0";
            var epgName = tvsGlobalVar.get("VOD_LOG_epgName");
            if (epgName == 1) {
                operObjectType = "1";
                operObject = tvsGlobalVar.get("VOD_LOG_cateIdLevel1");
            }
            if (epgName == 2) {
                operObjectType = "4";
                operObject = tvsGlobalVar.get("VOD_LOG_cateIdLevel2");
            } else if (epgName == 3) {
                operObjectType = "2";
				operObject = tvsGlobalVar.get("VOD_LOG_pid");;
            }

            if (epgName == 1) {
                epgName = "1;首页";
            } else if (epgName == 2) {
                epgName = "2;列表页";
            } else if (epgName == 3) {
                epgName = "3;详情页";
            } else if (epgName == 4) {
                epgName = "4;搜索页";
            } else if (epgName == 5) {
                epgName = "5;播放页";
            } else if (epgName == 6) {
                epgName = "6;微视频列表页";
            } else if (epgName == 7) {
                epgName = "7;微视频详情页";
            } else if(epgName == 20){
				epgName = "20;检索页";
			} else if(epgName == 21){
				epgName = "21;观看历史页";
			} else if(epgName == 22){
				epgName = "22;收藏页";	
			} else if(epgName == 23){
				epgName = "23;追剧页";	
			}
            str += this.CNTV_KEY + "|" + epgName + "|" + "" + "|" + operObjectType + "|" + searchKeywords + "|" + operObject + "|" + this.SYSTEM_SOURCE + "|" + this.EPG_VERSION + "|" + this.FSOURCE;
            this.doLog(str);
        }
    }

}
var tvsLogger = new TVSeeLogger();

function HashtableClass() {
    this.put = function(_key, _value) {
        var vKey = "VOD_LOG_" + _key;
        tvsGlobalVar.set(vKey, _value);
    },
    this.get = function(_key) {
        var vKey = "VOD_LOG_" + _key;
        return tvsGlobalVar.get(vKey);
    }
}
var hashtable = new HashtableClass();