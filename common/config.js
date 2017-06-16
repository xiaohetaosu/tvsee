/*** 河北无线传媒 ***/
/*********************重新部署需手动修改的配置-START*************************/
//var LIVE_URL = "http://110.249.165.133";//直播回看视频源地址
var HOST = "http://";
if(typeof(location.host) != "undefined"){
	if(location.host.split(":").length > 1){
		HOST += location.host.split(":")[0];
	}	
}
//切换成都、昆明、免费、武汉EPG方法
//切换到昆明EPG---window.SETCITY = "kunming";
//切换到成都EPG---window.SETCITY = "chengdu ";
//切换到免费EPG---window.SETCITY = " ";
//切换到武汉EPG---window.SETCITY = "wuhan";
//window.SETCITY = "kunming";
//* 1,其他,other
//   * 2,成都,chengdu
//   * 3,重庆,chongqing
//   * 4,武汉,wuhan
//   * 5,昆明,kunming
//   * 6,广州,guangzhou
//   * 7,贵阳,guiyang
//   * 8,东莞,dongguan
//   * 9,长沙,changsha
//   * 10,上海,shanghai
//   * 11,北京,beijing
//   * 12,南宁,nanning3

HOST = "";//"http://118.122.88.229:7070/";//http://14.204.32.236:7070/ http://27.221.10.82:7070/
var LIVE_URL = "http://127.0.0.1:5460/";
var SETCITY = "";
var cache0 ={
	areaPos:null,
	serialNum:null,
	stbMac:null,
	serviceId:null
}
getStb();
function getStb(){
	var Request = new Object();
	Request = getRequest();
	cache0.serialNum = Request.serialNum;
	cache0.stbMac = Request.Mac;
}
function getRequest(){
	var url =location.search;
	var theRequest = new Object(); 
	if (url.indexOf("?") != -1) { 
	var str = url.substr(1); 
	strs = str.split("&"); 
	for(var i = 0; i < strs.length; i ++) { 
	theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]); 
	} 
} 
}
//var REDIRECT_LIVE_URL = "http://stb-video.tv-cloud.cn:7070/tvseeHandle/authentication/video?type=3&url=";
var PLAY_URL = "http://stb-video.tv-cloud.cn:7070/tvseeHandle/authentication/video?"
var REDIRECT_LIVE_URL = PLAY_URL + "type=3&url=";
var REDIRECT_VIDEO_URL = PLAY_URL + "type=6&url=";
var REDIRECT_LUNBO_URL = PLAY_URL + "type=4&url=";
var ISXNMS = false;//false:关闭xnms, true:开启xnms
var  XNMSEPG_SERVER = HOST + "/vodEPG_xnms/jsonp/"; //xnms服务
//var MOSS_SERVER = "http://110.249.165.145:7070/moss/"; //moss服务，记录点播日志
var MOSS_SERVER = "http://x.x.x.x:7070/moss/"; //moss服务，记录点播日志
var PICURL = HOST + "/poster/gitv/"; //点播海报图片 http://118.122.88.227:7071
var SPECIAL_PICzURL = HOST + "/poster/"; //专题海报图片
var LIVE_PICURL = HOST + "/poster/live/channel_logo3.0_gitv/"; //直播频道logo图
//var PICURL = "/poster/gitv/"; //点播海报图片
var SPECIAL_PICURL = HOST + "/poster/"; //专题海报图片
var LIVE_PICURL = HOST + "/poster/live/channel_logo3.0_gitv/"; //直播频道logo图
var APK_URL = "http://x.x.x.x/1.apk";//apkurl配置
/*********************重新部署需手动修改的配置-END*************************/

/*********************EPG 后台服务配置(相对路径)-START*************************/
var fontStyle = "large";//small:小字体样式,large大字体样式
//var VODEPG_SERVER = "/vodEPG/jsonp/"; //点播服务
var VODEPG_SERVER = HOST + "/vodEPG/jsonp/"; //点播服务http://27.221.10.83:7070
var LOGEPG_SERVER = HOST + "/logEPG/jsonp/";
var LIVE_FASHION = "m3u8";//直播方式切换,mongoose:推流服务方式,m3u8:m3u8方式
var WATCHTV_FASHION = "m3u8";//回看方式切换,mongoose:推流服务方式,m3u8:m3u8方式,p4p:p4p方式,xnm s:http方式
var LIVEEPG_SERVER = HOST + "/liveEPG/jsonp/"; //直播回看服务
var LUNBOEPG_SERVER = HOST + "/liveEPG/"; //轮播
//var LIVEEPG_SERVER = "/liveEPG/jsonp/"; //直播回看服务
var ISVERIFY = false; //终端验证功能(此开关暂时没有用,保留)
//var USEREPG_SERVER = "/userEPG/jsonp/"; //用户服务
var USEREPG_SERVER = HOST + "/userEPG/jsonp/"; //用户服务
var ISAAA = false; //false:关闭业务AAA认证, true:开启业务AAA认证
//HOST +
var AUTH_OR_DED_SERVER = HOST + "/tvseeHandle/";//"/tvseeHandle/";//业务认证服务 7072  http://27.221.10.83:9086 http://27.221.10.83:7070
var IS_BACK_EXIT = false; //true:按返回键应用可以退出, false不能退出
var IS_GO_SETTING = true; //true:表示应用可以通过页面入口进入设置, false:表示无法进入
var LIST_STYLE = 1;
var IS_ADD_MULTI_SCREEN = true; //true: 添加三屏工具(即二维码扫描等), false:不支持三屏
var IS_ADD_LIVE_FUNCTION = true; // true: 添加直播功能, false:不支持直播功能
var IS_AUTO_CON_PLAY = true; //添加是否自动连续播放
var IS_ADD_RECE_WATCH = false; //是否在moss中直接添加最近观看
var VOD_PAGE_GOTO = "";
var LIVE_PAGE_GOTO = "../tvseePage16_inner_live/runtime.htm"; //../tvseePage16_inner_live/runtime.htm
//var MOSS_SERVER = "http://110.249.165.145:7070/moss/"; //moss服务
var MOSS_SERVER = "http://x.x.x.x:7070/moss/"; //moss服务
var homeTimes = 500000000;//首页自动刷新时间 单位秒
var DETAIL_POSTER = 0;//0：详情页海报显示节目集图片， 1：显示节目图片
var DETAIL_PROGRAM_NAME = 0;//0：详情页节目名称显示节目集名称， 1：显示节目名称
var LIST_STYLE = 1;//0：cntv列表页风格， 1：gitv列表页风格
var PILOT_TIME = 360000;
var SYSTEM_SOURCE = "1";  //1-艾普   2-西铁
/*********************EPG 后台服务配置(相对路径)-END*************************/

/*********************EPG 页面资源配置(相对路径)-START*************************/
var modulePlex="public";//prepare：预发布,public:已发布
var PREPARE_PATH= HOST + "/backStage/";//EPG首页推荐XML预发布地址 http://118.122.88.227:7070
var PUBLIC_PATH= HOST + "/backStage/epg/public/";//EPG首页推荐XML正式发布地址  http://118.122.88.227:7070
var PUBLIC_VIDEO_PATH= HOST + "/backStage/upload/";//EPG首页推荐XML正式发布图片或视频地 址http://118.122.88.227:7070
/*********************EPG 页面资源配置(相对路径)-END*************************/
/*********************EPG 其他参数配置-START*************************/
var ISJQUERY = true; //true:使用原生JQuery, false:使用自定义AjaxClass

/*********************EPG 其他参数配置-END*************************/
var timeCount = 0;
var saverStatus = 0;

//以下是后台服务接口,开发人员关注

var SETTING_APP_PACKAGE_ARR = [{
							   "packageName": "com.konka.settingsmbox", 
							   "activityName": "com.konka.settingsmbox.SettingsMboxActivity",
							   "params":null},{
							    "packageName": "com.mktech.settings", 
							   "activityName": "com.mktech.settings.MainActivity",
							   "params":null},{
                               "packageName": "com.setting",
                               "activityName": "com.setting.MainActivity",
                               "params":null
                              },{
                               "packageName": "com.mktech.settings",
                               "activityName": "com.mktech.settings.MainActivity",
                               "params":null
                              },{
                                "packageName": "com.mbx.settingsmbox",
                                "activityName": "com.mbx.settingsmbox.SplashActivity",
                                "params":null
                                }];

var APP_LIST_PACKAGE_ARR = [{
							 "packageName": "com.konka.app", 
							 "activityName": "com.konka.app.Allapp",
							 "params":"showType,0"},{
							 "packageName": "com.mktech.localapp", 
							 "activityName": "com.mktech.localapp.MainActivity",
							 "params":null},{
                             "packageName": "tv.cmcc.vendor",
                             "activityName": "tv.cmcc.vendor.AllappActivity",
                             "params":null},{
                             "packageName": "com.linkin.apps",
                             "activityName": "com.linkin.apps.activity.MainActivity",
                             "params":null},{
                             "packageName": "com.skyworthdigital.appmanager",
                             "activityName": "com.skyworthdigital.appmanager.AllAppActivity",
                             "params":null},{
                             "packageName": "com.android.ott.allapp",
                             "activityName": "com.android.ott.allapp.ApplicationActivity",
                             "params":null},{
                             "packageName": "com.rk_itvui.allapp",
                             "activityName": "com.rk_itvui.allapp.AllApp",
                             "params":null}]
/*首页菜单配置*/
var displayMenuCount = 6;//最多显示6个菜单，大于6滑动
var menus = [
	{name:"收费专区",id:"module_5",src:"module_6_public.html",contentLeft:'60px',bgimg:'BG3.png', iframeName: 'child_iframe_1', isLoading: false},
	// 此处是公版epg需要配置的地方，公版epg影视点播用module_18，艾普用module_1
	{name:"影视点播",id:"module_18",src:"module_1_public.html",contentLeft:'110px',bgimg:'BG1.png', iframeName: 'child_iframe_2', isLoading: false},
	/*{name:"欧洲杯",id:"module_5",src:"module_7_public.html",contentLeft:'60px',bgimg:'BG3.png', iframeName: 'child_iframe_3', isLoading: false},*/
	{name:"分类鉴赏",id:"module_2",src:"module_2_public.html",contentLeft:'60px',bgimg:'BG2.png', iframeName: 'child_iframe_3', isLoading: false},
        /*{name:"河北精选",id:"module_5",src:"module_5_public.html",contentLeft:'60px',bgimg:'BG2.png', iframeName: 'child_iframe_3', isLoading: false},*/
	{name:"随心点",id:"module_7",src:"module_7_public.html",contentLeft:'60px',bgimg:'BG2.png', iframeName: 'child_iframe_4', isLoading: false},
	/*{name:"频道回看",id:"module_3",src:"module_3_public.html",contentLeft:'60px',bgimg:'BG2.png', iframeName: 'child_iframe_3', isLoading: false},*/
	{name:"系统功能",id:"module_4",src:"module_4_public.html",contentLeft:'60px',bgimg:'BG3.png', iframeName: 'child_iframe_5', isLoading: false},
	//此处是公版epg需要配置的地方，公版epg系统功能用module_19，艾普用module_4 
//	{name:"系统功能",id:"module_19",src:"module_19_public.html",contentLeft:'60px',bgimg:'BG3.png', iframeName: 'child_iframe_5', isLoading: false},
	{name:"应用管理",id:"module_app",src:"module_8_public.html",contentLeft:'60px',bgimg:'BG3.png', iframeName: 'child_iframe_6', isLoading: false}
	
	/*,
	{name:"精彩专题",id:"module_8",src:"module_8_public.html",contentLeft:'60px',bgimg:'BG3.png', iframeName: 'child_iframe_5', isLoading: false}*,
	{name:"推荐轮循",id:"module_ztcs",src:"module_6_public.html",contentLeft:'60px',bgimg:'BG2.png', iframeName: 'child_iframe_7'}*/
];

var launcherMenus = [];
function launcherMenusChose(){
	if(SETCITY == ""){
		return;
	}
	if(SETCITY == "chengdu"){
		return [{name: "", id: "module_13", src: "module_13_public.html", bgimg: "", iframeName: "launcher_iframe_1", isLoading: false},
				{name: "", id: "module_14", src: "module_14_public.html", bgimg: "", iframeName: "launcher_iframe_2", isLoading: false}];
	}else if(SETCITY == "kunming"){
		return [{name: "", id: "module_11", src: "module_11_public.html", bgimg: "", iframeName: "launcher_iframe_1", isLoading: false},
				{name: "", id: "module_12", src: "module_12_public.html", bgimg: "", iframeName: "launcher_iframe_2", isLoading: false}];
	}else if(SETCITY == "wuhan"){
return [{name: "", id: "module_20", src: "module_20_public.html", bgimg: "", iframeName: "launcher_iframe_1", isLoading: false},
				{name: "", id: "module_21", src: "module_21_public.html", bgimg: "", iframeName: "launcher_iframe_2", isLoading: false}];
	
	}else if(SETCITY == "chongqing"){
return [{name: "", id: "module_22", src: "module_22_public.html", bgimg: "", iframeName: "launcher_iframe_1", isLoading: false},
				{name: "", id: "module_23", src: "module_23_public.html", bgimg: "", iframeName: "launcher_iframe_2", isLoading: false}];
	
	}else if(SETCITY == "changsha"){
return [{name: "", id: "module_24", src: "module_24_public.html", bgimg: "", iframeName: "launcher_iframe_1", isLoading: false},
				{name: "", id: "module_25", src: "module_25_public.html", bgimg: "", iframeName: "launcher_iframe_2", isLoading: false}];
	
	}else if(SETCITY == "guiyang"){
return [{name: "", id: "module_26", src: "module_26_public.html", bgimg: "", iframeName: "launcher_iframe_1", isLoading: false},
				{name: "", id: "module_27", src: "module_27_public.html", bgimg: "", iframeName: "launcher_iframe_2", isLoading: false}];
	
	}
}
launcherMenus = launcherMenusChose();
function getRequest(){
	var url =location.search;
	var theRequest = new Object(); 
	if (url.indexOf("?") != -1) { 
	var str = url.substr(1); 
	strs = str.split("&"); 
	for(var i = 0; i < strs.length; i ++) { 
	theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]); 
	} 
} 
//  getStb();
    
    return theRequest; 
	
}
//function getStb(){
//	var Request = new Object();
//	Request = getRequest();
//	 
////	return
//	if (typeof(Request.CITY) ==undefined){
//		return
//	}else{
//		if (Request.CITY == "kunming"){
//			setCookie("city",12,365);
//			 launcherMenus = [
//	{name: "", id: "module_11", src: "module_11_public.html", bgimg: "", iframeName: "launcher_iframe_1", isLoading: false},
//	{name: "", id: "module_12", src: "module_12_public.html", bgimg: "", iframeName: "launcher_iframe_2", isLoading: false}
//]
//			console.log(Request.CITY);
//			return
//		}else if(Request.CITY == "chengdu"){
//			setCookie("city",1,365);
//			launcherMenus = [
//	{name: "", id: "module_13", src: "module_13_public.html", bgimg: "", iframeName: "launcher_iframe_1", isLoading: false},
//	{name: "", id: "module_14", src: "module_14_public.html", bgimg: "", iframeName: "launcher_iframe_2", isLoading: false}
//]
//			console.log(Request.CITY);
//		}
//	}
//	
//}
if(menus.length < displayMenuCount){
	displayMenuCount = menus.length;
}else{
	displayMenuCount = 6;
}
/*设置字体样式*/
if(fontStyle=="small"){
	document.write("<link type='text/css' rel='stylesheet' href='fontStyle/smallFontSize.css'\/>");
	document.write("<script type='text/javascript' charset='UTF-8' src='fontStyle/smallFontLength.js'><\/script>");
}else{
	document.write("<link type='text/css' rel='stylesheet' href='fontStyle/largeFontSize.css'\/>");
	document.write("<script type='text/javascript' charset='UTF-8' src='fontStyle/largeFontLength.js'><\/script>");
}
try {
    globalvar.set("htmlver", "156");
} catch(e) {}

var SPEC_ID = {
    MEMBER_ID: 999,
    DEFINITION:1,
	LIVE_ID: 9035	
}
//0-回看 1-直播 2-点播 3-时移
function setCookie(c_name,value,expiredays)
{
var exdate=new Date()
exdate.setDate(exdate.getDate()+expiredays)
document.cookie=c_name+ "=" +escape(value)+
((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}
function clearCookie(){
    var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i =  keys.length; i--;)
            document.cookie=keys[i]+'=0;expires=' + new Date( 0).toUTCString()
    }    
}
var PLAYER_TYPE = {
	VOD_PLAYER_ID: 	2,
	VOD_PLAYER_NAME: '点播',
	LIVE_PLAYER_ID: 1,
	LIVE_PLAYER_NAME: '直播',
	LOOKBACK_PLAYER_ID: 0,
	LOOKBACK_PLAYER_NAME: '回看',
	LUNBO_PLAYER_ID: 3,
	LUNBO_PLAYER_NAME: '随心点',
	TIME_PLAYER_SHIFT_ID: 4,
	TIME_PLAYER_SHIFT_NAME: '时移'
	
}
var SPEC_CATALOG_NAME = {
    RECREATION_NAME: "娱乐",
    TV_PART_NAME: "电视栏目",
	HOME_MENU_NAME: "频道回看",
	VIP_JYJC_CATENAME: "骄阳剧场"
}
var SPEC_CATALOG_ID = {
	VIP_JYJC_CATEID: 501,
	VIP_YH_CATEID: 100005,
	VIP_TV_CATEID: 100014,
	MOVIE_CATEID: 1
	
}
var SPEC_CATALOG_TT ={
	TT_VIP :100033
}
var SPEC_CATALOG_TTT ={
	TTT_VIP :100035
}
var LIST_REC_MOVIE_URL = {
	"100005": "module_rec1",
	"100014": "module_rec2"
}
//501
var SPEC_MOVIE_TYPE_NAME = {
	TV: "电视剧",
	MOVIE: "电影",
	VARIETY:"综艺",
	NEWS:"新闻",
	CHILDREN: "少儿",
	ANIME: "动漫",
	OTHER: "其他",
	DOCUMENTARY: "纪录片",
	SPORTS_VIP: "体育VIP"
}

var SPEC_PAY_SERVICE_LIST = [
	{
		serviceId: 1,
		serviceName: '银河VIP'
	},
	{
		serviceId: 2,
		serviceName: '银河VIP'
	},
	{
		serviceId: 3,
		serviceName: '银河VIP'
	}
]

var FOCUS_STYLE = {
	//gitv
	/*BORDER: "3px solid #C0F954"	,
	COLOR: "#C0F954",
	//cntv
	BORDER: "3px solid #ef7e04"	,
	COLOR: "#ef7e04",
	//jiangsu
	BORDER: "3px solid #10a6ea"	,
	COLOR: "#00a0e9",*/
	//aipu
	BORDER: "3px solid #96ff00"	,
	COLOR: "#96ff00"
}

function getStbId(){
	if(typeof(globalvar) == "object"){
		if(typeof(globalvar.get) == "function"){
			return globalvar.get("ca_stbid");
		}
	}
	return "010000000000001";
}
function getAjaxUrl(){
	var url = VODEPG_SERVER;
	var args = arguments;
	var argsLen = args.length;
	var userId = null;
	var stbId = null;
	var cardNo = null;
	
	try{
		if(typeof(globalvar) == "object"){
			if(typeof(globalvar.get) == "function"){
				userId = globalvar.get("ca_mac");
				cardNo = globalvar.get("ca_cardno");
				stbId = globalvar.get("ca_stbid");
			}
		}else{
			userId =cache.stbMac;
			stbId =cache.serialNum;
		}
	}catch(e){
		//TODO handle the exception
	}
	if(userId == null || userId == undefined){
		userId = "eec1667f9fe7";
		cardNo = "888888888888888888";
		stbId = "010144101000086";
	}
//	if (cache0.serialNum != null || cache0.serialNum != "" || cache0.serialNum != undefined){
//		userId =cache0.stbMac;
//		stbId =cache0.serialNum;
//	}
	
	
	switch (args[0]){
		case "menu1List": //得到一级菜单
			if(args[1] == "fix"){
				//url = REC_PATH + "cntv15_recommends_2.js";
			}else{
				url += "GetMenuDataAction.action?parentId=0";	
			}
		break;
		case "menu2List": //得到二级菜单
			url += "GetMenuDataAction.action?parentId=" + args[1];
			break;
		case "mediaList": // 得到二级菜单列表
			url += "GetProgramByCidAction.action?taxis=asc&cid=" + args[1];
			if(argsLen > 2){
				url += "&currentPage=" + args[2] + "&pageSize=" + args[3];		
			}
		break;
		case "mediaDetail": // 得到详情页面	
			url += "GetMoviesByProgramId.action?pid=" + args[1] + "&count=20&taxis=asc";
			if(argsLen > 2){
				url += "&count=" + args[2];
			}
		break;
		case "mediaVarietyDetail": // 得到综艺详情页面
			url += "GetVarietyDetail.action?pid=" + args[1] + "&taxis=asc";
		break;
		case "vodByGuid": //CNTV http点播p2p点播
			url = XNMSEPG_SERVER + "vodByGuid.action?guid=" + args[1] + "&cntvid=" + stbId;
		break;
		case "mediaKeyWordSearch": //根据首字母进行搜索
			url += "SearchProgramAction.action?initWords=" + args[1] + "&flag=" + args[2];
		break;
		case "mediaKeyWordNewSearch": //新搜索带分页带类型   flag: 1:片名  2:还是主演       searchBtnType:首字母还是联想词   0: 联想词   1:首字母
			url += "GetMovieInfoByqueryMovieName.action?searchBtnType=" + args[1] + "&movieValue=" + args[2] + "&flag=" + args[3];
			if(argsLen > 4){
				url += "&currentPage=" + args[4] + "&pageSize=" + args[5];
			}
		break;
		case "mediaLenovoSearch":
			url += "GetMovieNameByqueryIndex.action?flag=" + args[1] + "&queryIndex=" + args[2];
		break;
		case "userSaveSubscriber": //订阅栏目  userId为mac地址，可以得到.  count不知为何参数，暂不加
			url = USEREPG_SERVER + "SaveSubscriberAction.action?userId=" + userId + "&cid=" + args[1] ;
		break;
		case "userQuerySubscriber": //用户查询订阅
			url = USEREPG_SERVER + "GetSubscribersAction.action?userId=" + userId + "&count=" + args[1];
		break;
		case "userDelSubscriber": //删除用户订阅
			url = USEREPG_SERVER + "DeleteSubscribersAction.action?userId=" + userId + "&cid=" + args[1];
		break;
		case "userSaveFavorite": //收藏 userId为mac地址，可以得到.  count不知为何参数，暂不加
			url = USEREPG_SERVER + "SaveFavorite.action?userId=" + userId + "&pid=" + args[1] + "&programName=" + args[2] + "&picurl=" + args[3] + "&type=" + args[4];
		break;
		case "userQueryFavorite": //收藏查询  userId为mac地址，可以得到
			url = USEREPG_SERVER + "GetFavoriteByUserid.action?userId=" + userId + "&count=" + args[1];
		break;
		case "userDelFavorite": //删除用户收藏
			url = USEREPG_SERVER + "DeleteFavorite.action?userId=" + userId + "&pid=" + args[1];
		break;
		case "newUserSaveFavorite": //添加收藏(new) 
			url = USEREPG_SERVER + "SaveFavoriteAction.action?userId=" + userId + "&pid=" + args[1] + "&programName=" + args[2] + "&picUrl=" + args[3] + "&movieType=" + args[4];
		break;
		case "newUserQueryFavorite"://收藏查询(new)  
			url = USEREPG_SERVER + "GetFavoriteByUseridAction.action?userId=" + userId;
		break;
		case "newUserDelFavorite": //删除用户收藏(new)
			url = USEREPG_SERVER + "DelFavoriteProgramAction.action?userId=" + userId + "&pid=" + args[1];
		break;
		case "userSaveRecord": //保存最近观看记录
			url = USEREPG_SERVER + "SaveLastWatchAction.action?userId=" + userId + "&pmid=" + args[1] + "&pmname=" + args[2] + "&type=" + args[3] + "&watchtime=" + args[4];
			url += "&imgUrl=" + args[5] + "&flag=";
		break;
		case "userQueryRecord": //
			url = USEREPG_SERVER + "GetLastWatchGroupList.action?userId=" + userId;
		break;
		case "newUserSaveRecord": //保存最近观看记录(new)
			url = USEREPG_SERVER + "SavePlayHistoryAction.action?userId=" + userId + "&pid=" + args[1] + "&programName=" + args[2] + "&picUrl=" + args[3] + "&movieType=" + args[4];
			url += "&definition=" + args[5] + "&spid=" + args[6] + "&cateId=" + args[7] + "&programId=" + args[8] + "&totalEpisode=" + args[9];
			url += "&watchEpisode=" + args[10];
		break;
		case "mossUserSaveRecord": //moss最近观看记录
			url = MOSS_SERVER + "/bss/cp/bssUserViewLog!save.do?" + args[1];
		break;
		case "newUserQueryRecord"://查询最近观看记录(new)
			url = USEREPG_SERVER + "GetLastWatchListAction.action?userId=" + userId ;
		break;
		case "newUserQueryGroupRecord"://查询最近观看记录(new),分日期查询的
			url = USEREPG_SERVER + "GetLastWatchGroupList.action?userId=" + userId;
		break;
		case "newUserDelRecord"://删除最近观看
			url = USEREPG_SERVER + "DelPlayHistoryAction.action?userId=" + userId + "&pid=" + args[1];
		break;
		case "userAddPlayMark": //添加用户标记,记录播放位置 flag=0表示带剧集的只记录最后一个节目播放位置,1表示记录每一个节目播放位置
			url = USEREPG_SERVER + "AddPlayMarkAction.action?pid=" + args[1] + "&guid=" + args[2] + "&timelength=" + args[3] + "&userId=" + userId+"&flag=0";
		break;
		case "userQueryPlayMark": //查询用户标记(记录播放位置)
			url = USEREPG_SERVER + "GetUserPlayMarkAction.action?userId=" + userId;
		break;
		case "userDelPlayMark": //删除用户标记(记录播放位置)
			url = USEREPG_SERVER + "DelPlayMarkAction.action?userId=" + userId + "&guid=" + args[1];
		break;
		case "userSaveMyTV":  //添加我的追剧
			url = USEREPG_SERVER + "SaveMyAddTvAction.action?userId=" + userId + "&pid=" + args[1] + "&programName=" + args[2] + "&picUrl=" + args[3] + "&movieType=" + args[4];
			url += "&definition=" + args[5] + "&spid=" + args[6] + "&cateId=" + args[7] + "&programId=" + args[8] + "&totalEpisode=" + args[9];
			url += "&watchEpisode=" + args[10];
		break;
		case "userQueryMyTV": //查询我的追剧
			url = USEREPG_SERVER + "GetMyAddTvAction.action?userId=" + userId;
			if(argsLen > 2){
				url += "&count=" + args[1];	
			}
		break;
		case "userUpdateMyTVEpisode": //更新我的追剧集数
			url = USEREPG_SERVER + "UpdateMyAddTvAction.action?userId=" + userId + "&pid=" + args[1] + "&watchEpisode=" + args[2];
		break;
		case "userDelMyTV":	//删除我的追剧
			url = USEREPG_SERVER + "DelMyAddTvAction.action?userId=" + userId + "&pid=" + args[1];
		break;
		case "userActive": //激活
			url = AUTH_OR_DED_SERVER + "ActiveAction.action?activeServletUrl=" + args[1] + "&authcode=" + args[2] + "&serialNum=" + stbId + "&stbMac=" + userId;
		break;
		case "userAAAVerify": //验证
			//serialNum:  cntvkey   cardNo:  卡号   stbMac: mac地址  ppvid: 付费id pirceType:价签类型 0回看 1直播 2点播
			url = AUTH_OR_DED_SERVER + "AuthAction.action?cardNo=" + cardNo + "&stbMac=" + userId + "&serialNum=" + stbId + "&ppvid=" + args[1] + "&guid=" + args[2] + "&priceType=" + args[3];
			url = AUTH_OR_DED_SERVER + "AuthAction.action?cardNo=" + cardNo + "&stbMac=" + userId + "&serialNum=" + stbId + "&ppvid=" + args[1] + "&guid=" + args[2] + "&priceType=" + args[3];
			if(null == args[1] || "null" == args[1]){
				url = AUTH_OR_DED_SERVER + "vodAuthAction/vodAuth?cardNo=" + cardNo + "&stbMac=" + userId + "&serialNum=" + stbId + "&ppvid=&guid=" + args[2] + "&priceType=" + args[3];
			}else{
				url = AUTH_OR_DED_SERVER + "vodAuthAction/vodAuth?cardNo=" + cardNo + "&stbMac=" + userId + "&serialNum=" + stbId + "&ppvid=" + args[1] + "&guid=" + args[2] + "&priceType=" + args[3];
			}
		break;
		case "userCharge": //用户购买影片 扣费
			url = AUTH_OR_DED_SERVER + "ChargeAction.action?cardNo=" + cardNo + "&guid=" + args[1] + "&serialNum=" + stbId + "&ppvid=" + args[2];
			url += "&price=" + args[3] + "&sessionId=" + args[4] + "&movieName=" + args[5] + "&stbMac=" + userId;
			
			url = AUTH_OR_DED_SERVER + "vodAuthAction/vodCharge?cardNo=" + cardNo + "&guid=" + args[1] + "&serialNum=" + stbId + "&ppvid=" + args[2];
			url += "&price=" + args[3] + "&sessionId=" + args[4] + "&movieName=" + args[5] + "&stbMac=" + userId;
		break;
		case "userVIPActivation":
			url = AUTH_OR_DED_SERVER + "vodAuthAction/vodCharge?&serialNum=" + stbId + "&passcode=" + args[1];
		break;
		case "userCardCharge": //用户充值
			url = AUTH_OR_DED_SERVER + "CardChargeAction.action?stbid=" + stbId + "&stbMac=" + userId + "&cardNo=" + "&cardPasswd=" + args[1];
		break;
		case "userCardBalance": //用户卡余额查询
			url = AUTH_OR_DED_SERVER + "CardBalanceAction.action?stbid=" + stbId;
		break;
		case "userQueryPraises":  //用户好评
			url = USEREPG_SERVER + "GetUserPraisesAction.action?count=" + args[1];
		break;
		case "userRegMember": //注册会员
			url = USEREPG_SERVER + "SaveMemberInfo.action?username=" + args[1] + "&password=" + args[2] + "&sex=" + args[3] + "&age=" +args[4];
			url += "&province=" +args[5]  + "&stbid=" + stbId + "&stbmac=" + userId;
		break;
		case "userUpdateMember": //修改会员信息
			url = USEREPG_SERVER + "ModifyMemberInfo.action?username=" + args[1] + "&password=" + args[2] + "&sex=" + args[3] + "&age=" +args[4];
			url += "&province=" + args[5] + "&stbid=" + stbId + "&stbmac=" + userId;
		break;
		case "userLoginByStbid": //根据终端编号自动用户登录
			url = USEREPG_SERVER + "MemberLoginByStbid.action?stbid=" + args[1] + "&stbmac=" + userId;
		break;
		case "userLoginByUserName": //根据用户名登录
			url = USEREPG_SERVER + "UserLoginByUserName.action?username=" + args[1] + "&password=" + args[2] + "&stbid=" + stbId + "&stbmac=" + userId;
		break;
		case "searchProgramByClass": //按影片分类类型检索影片 cid：一级栏目cid, types：类型条件组合,startRecord:查询记录起始位置，countRecord：返回记录数， currentPage：当前页码，pageSize：每页显示记录数,taxis排序
			url += "SearchProgramByMovieClassify.action?cid=" + args[1] + "&types=" + args[2] + "&startRecord=" + args[3] + "&countRecord=500&currentPage="+args[4]+"&pageSize="+args[5]+"&taxis=asc";
		break;
		case "searchProgramByInitial": //新搜索带分页带类型   flag: 1:片名  2:还是主演       searchBtnType:首字母还是联想词   0: 联想词   1:首字母,startRecord:查询记录起始位置，countRecord：返回记录数， currentPage：当前页码，pageSize：每页显示记录数,taxis排序
			url += "SearchProgramByInitial.action?searchBtnType=" + args[1] + "&movieValue=" + args[2] + "&flag=" + args[3] + "&startRecord=" + args[4] + "&countRecord=500&currentPage="+args[5]+"&pageSize="+args[6]+"&taxis=asc";
		break;
		case "getAllGroupType": //获取所有检索影片类型分组
			url += "GetAllGroupTypeAction.action";
		break;
		case "movieType"://根据cid获取节目类型信息
			url += "MovieTypeByCid.action?cid=" + args[1];
		break;
		case "getLastWatchTvChannel": //获取最近观看的直播回看历史频道 userId:终端用户id，count：查询的记录数，默认返回11条
			url = USEREPG_SERVER + "GetLastWatchTvChannelAction.action?userId=" + userId + "&count=11";
		break;
		case "saveLastWatchTvChannel": //保存用户观看的直播回看频道 
			//tvId:电视台id,tvName：电视台名称,channelId：频道id,channelName：频道名称,channelUrl：频道台标url
			url = USEREPG_SERVER + "SaveLastWatchTvChannel.action?tvId="+ args[1] + "&tvName="+ args[2] + "&channelId=" + args[3] + "&channelName=" + args[4] + "&channelUrl=" + args[5] + "&userId=" + userId;
		break;
		case "getAllTv": //取得所有直播频道（包括二级频道和直播节目单）
			//url = LIVEEPG_SERVER+"GetCatalogByCode.action?code=tv&isCache=false";//动态查询取得数据
			url = LIVEEPG_SERVER.replace('jsonp','')+"liveChannels.json?random=" + Math.round(Math.random()*1000);//读取json文件数据
			//url = "http://10.255.199.17:7070/liveEPG/liveChannels.json?random=" + Math.round(Math.random()*1000);
		break;
		case "getAdvertisement": //取得广告
//			url = "http://ads.tv-cloud.cn:9191/api/v1.0/ads/inquire/"+ args[1] +"/"+userId+"/"+args[2];
			url = "http://27.221.10.87:9191/api/v1.0/ads/inquire/"+ args[1] +"/"+userId+"/"+args[2];
		break;
		case "getMovieListByDate": //根据日期查询节目单 curdate：日期(2013-03-20)，catalogid：频道id, sort:排序
			url = LIVEEPG_SERVER+"GetMovieList.action?curdate=" + args[1]+"&catalogid=" + args[2]+"&sort=asc&isCache=true";
		break;
		case "getLastWeekDate": //查询一周的日期，days：最近几天的日期，默认为最近一周
			url = LIVEEPG_SERVER + "GetDateInfo.action?days="+ args[1];
		break;
		case "getWeather": //查询天气预报
			url = VODEPG_SERVER+"GetWeatherBySina.action";
		break;
		case "getNewOnlinePrograms": //获取首页最新上线的节目
			url = VODEPG_SERVER+"SearchNewOnlinePrograms.action?taxis=asc&count="+ args[1];
			url = VODEPG_SERVER+"SearchNewOnlinePrograms.action?cids=1,2,15,100001,100033&pids=&taxis=asc&count="+ args[1];
		break;
		case "uploadPlayerLogData": //上传点播时间数据
			url = LOGEPG_SERVER + "SavePlayLogAction.action?userId=" + stbId + "&cateId=" + args[1] + "&cateName=" + args[2] + "&programId=" + args[3] + "&programName=" + args[4] + "&mid=" + args[5] + "&movieName=" + args[6] + "&picUrl=" + args[7] + "&movieType=" + args[8] + "&timeLength=" + args[9] + "&startTime=" + args[10] + "&endTime=" + args[11] + "&typeId=" + args[12] + "&typeName=" + args[13] + "&mac=" + userId + "&definition=" + args[14] + "&spid=" + args[15] + "&remake=";
		break;
		case "getSpecialList": //专题列表
			url = VODEPG_SERVER+"GetMenuDataAction.action?parentId=" + args[1] + "&pageSize=" + args[2] + "&currentPage=" + args[3];
		break;
		case "getSpecialDetail": //专题详情
			url = VODEPG_SERVER+"getChSubject.action?cid="+ args[1];
		break;
		case "uploadLogs":
			url = "/log/log_down.php";
		break;
		case "payQrCode": //支付生成二维码模式
			//serialNum=010000000000001"+ "&cardNo=1"+"&guid=1"+"&ppvid=30"+"&price=1"+"&stbMac=AA:BB:CC:AA:BB:CC"+ "&sessionId=1"+ "&movieName=gaga"+ "&serviceId=2"+ "&serviceName=vipbaonian"+"&serviceCode=30"+ "&monthLength=3"+"&payMethod=alipay"
			url = AUTH_OR_DED_SERVER + "vodAuthAction/vodOrderVip?serialNum=" + stbId + "&stbMac=" +  userId + "&cardNo=" + cardNo + "&guid=" + args[1] + "&ppvid=" + args[2] + "&price=" + args[3] + "&sessionId=" + args[4] + "&movieName=" + args[5] + "&serviceId=" + args[6] + "&serviceName=" + args[7] + "&serviceCode=" + args[8] + "&monthLength=" + args[9] + "&payMethod=" + args[10] + "&width=" + args[11] + "&height=" + args[12]+ "&xuding=" + args[13]; //userId stbId
		break;
		case "memberPayInfo": //查询会员是否过期
			url = AUTH_OR_DED_SERVER + "vodAuthAction/queryVipOrder?serialNum=" + stbId + "&cardNo=" + cardNo;
		break;
		case "memberPayHistoryInfo":
			url = AUTH_OR_DED_SERVER + "vodAuthAction/queryHistoryVipOrder?serialNum=" + stbId + "&cardNo=" + cardNo;
		break;
		case "getLunBoChannel": //查询轮播频道信息
			//url = LIVEEPG_SERVER + "GetLinearChannelByChannelId.action?id="+ args[1];
			//url = LUNBOEPG_SERVER + "GetEPGByChannelId.action?id="+ args[1];
			url = LIVEEPG_SERVER.replace('jsonp','') + args[1] + ".json?random=" + Math.round(Math.random()*1000);
		break;
		case "queryCustomer"://查询用户是否已注册，注册了返回用户信息
			url = AUTH_OR_DED_SERVER + "customerAction/queryCustomer?serialNum=" + stbId;
		break;
		case "regPhoneCode": //通过手机号生成验证码
			url = AUTH_OR_DED_SERVER + "registerAction/seCode?mobile=" + args[1] + "&type=" + args[2];
		break;
		case "regUserInfo":
			url = AUTH_OR_DED_SERVER + "/registerAction/mobileRegister?mobile=" + args[1] + "&cust_code=" + args[2] + "&customerId=" + args[3] + "&subscriberId=" + args[4] +"&mac=" + userId; 
		break;
		case "phoneReg"://通过手机注册
			url = AUTH_OR_DED_SERVER + "registerAction/mobileRegister?mobile=" + args[1] + "&secode=" + args[2] + "&serialNum=" + stbId;
		break;
		case "otherReg": //通过其他注册
			url = AUTH_OR_DED_SERVER + "registerAction/userRegister?name=" + args[1] + "&password=" + args[2] + "&serialNum=" + stbId;
		break;
		case "checkNameCanUse"://验证用户名是否可用
			url = AUTH_OR_DED_SERVER + "registerAction/checkNameCanUse?name=" + args[1];
		break;
		case "customerBalance": //检测用户是否已被注册
			url = AUTH_OR_DED_SERVER + "registerAction/checkNameCanUse?name=" + args[1];
		break;
		case "updateUserPass": //更改密码
			url = AUTH_OR_DED_SERVER + "customerAction/updatePassword?oldPassword=" + args[1] + "&newPassword=" + args [2]+ "&serialNum=" + stbId;
		break;
		case "cardsRecharge": //充值卡充值
			url = AUTH_OR_DED_SERVER + "vodAuthAction/vodCharge?passcode=" + args[1] + "&serialNum=" + stbId;
		break;
		case "buyVip": //通过余额订购vip
			url = AUTH_OR_DED_SERVER + "customerAction/buyVip?serialNum=" + stbId + "&stbMac=" + userId +"&cardNo=" + cardNo +"&guid=" + args[1] +"&ppvid=" + args[2] + "&sessionId=" + args[3] + "&movieName=" + args[4] + "&serviceId=" + args[5] + "&serviceCode=" + args[6] +"payMethod=balancePay&xuding=" + args[7];
		break;
		case "updateUserInfo": //更新用户信息
			url = AUTH_OR_DED_SERVER + "registerAction/changeMobile?name=" + args[1] + "&mobile=" + args[2] + "&secode=" + args[3];
		break;
		case "luoBoChannelList": //获取节目列表
			//url = LIVEEPG_SERVER + "GetChannelList.action";
			url = LIVEEPG_SERVER.replace('jsonp','')+"lunboepg.json?random=" + Math.round(Math.random()*1000);
			//LIVEEPG_SERVER.replace('jsonp','')
		break;
		case "getServiceInfo":
//		        var AUTH = "http://27.221.10.82:8082/tvseeHandle/"
			url = AUTH_OR_DED_SERVER + "vodAuthAction/getServiceInfo?serviceId=" + args[1];
//          url = AUTH + "vodAuthAction/getServiceInfo?serviceId=" + args[1];
		break;
		case "movieRecVipMovie":
			url = VODEPG_SERVER + "promotionAction.action?position=film_promotion";
		break;
		case "listRecMovie":
			//PREPARE_PATH = "http://127.0.0.1:7070/backStage/";
			url = "./module_rec_" + (args[1] + 1) + ".json";
		
		break;
	}
	return url;
}  

function uploadVodData(cateId, cateName, programId, programName, mid, movieName, picUrl, movieType, timeLength, startTime, endTime, typeId, typeName, definition, spid, remake){
	var ajaxObj = new ajaxClass();
	ajaxObj.frame = window;
	ajaxObj.url = getAjaxUrl("uploadPlayerLogData" , cateId, cateName, programId, programName, mid, movieName, picUrl, movieType, timeLength, startTime, endTime, typeId, typeName, definition, spid, remake);
	tvsee.debug("ajaxObj.url:" + ajaxObj.url);
	ajaxObj.successCallback = function(_xmlHttp, _params) {
	};
	ajaxObj.failureCallback = function(_xmlHttp, _params) {
			//$("type_0").innerText = "加载数据失败！";
	};
	ajaxObj.requestData();
}
function gotoPageUrl(_url) {
	var path = "";
	if (parent != self) {
		if(typeof(parent.locationAction) == "function"){
			if(_url != "about:blank"){
				parent.locationAction( _url);
			}else{
				parent.loadPageStatus(0, "mainFrame"); 	
			}
		}
	}
	if (parent.parent != self) {
		if(typeof(parent.parent.locationAction) == "function"){
			if(_url != "about:blank"){
				parent.parent.locationAction(_url);
			}else{
				parent.loadPageStatus(0, "mainFrame"); 	
			}
		}
	}
	tvsee.mainFrame.location.href = _url;
}

function exitApp(){
	if(IS_BACK_EXIT == false){
		return;	
	}
	if(mediaPlayer.playerType == "ANDROID"){
		android_userAgent.exit();
	}else if(mediaPlayer.playerType == "QT"){
			
	}else if(mediaPlayer.playerType == "OTHER"){
		
	}
}
function getMovieTypeDetail(_movieType){
	if(_movieType == SPEC_MOVIE_TYPE_NAME.TV || _movieType == SPEC_MOVIE_TYPE_NAME.CHILDREN || _movieType == SPEC_MOVIE_TYPE_NAME.ANIME || _movieType == SPEC_MOVIE_TYPE_NAME.MOVIE || _movieType == SPEC_MOVIE_TYPE_NAME.SPORTS_VIP){
		return "vodDetail";	
	}else if(_movieType == SPEC_MOVIE_TYPE_NAME.NEWS || _movieType == SPEC_MOVIE_TYPE_NAME.OTHER || _movieType == SPEC_MOVIE_TYPE_NAME.DOCUMENTARY){
		return "vodVarietyDetail";
	}else if(_movieType == SPEC_MOVIE_TYPE_NAME.VARIETY){
		return "vodVarietyDetailNew";
	}
}

function getMovieListByCid(_cid){
	if(_cid == SPEC_CATALOG_TT.TT_VIP ||_cid == SPEC_CATALOG_TTT.TTT_VIP){
		return "widgetnewVodList";
	}
	if(_cid == SPEC_CATALOG_ID.VIP_YH_CATEID || _cid == SPEC_CATALOG_ID.VIP_TV_CATEID){
		return "widgetRecVodList";	
	}else{
		return "widgetVodList";
	}
}

function getMovieTypeTvOrNoTv(_movieType){
	if(_movieType == SPEC_MOVIE_TYPE_NAME.TV || _movieType == SPEC_MOVIE_TYPE_NAME.CHILDREN || _movieType == SPEC_MOVIE_TYPE_NAME.ANIME ){
		return "TV";
	}else{
		return "NO_TV";	
	}
}
//VIP专区(骄阳剧场的)目录ID
var VIP_JYJC_CATEID = 501;
var VIP_JYJC_PID = 1200000001;
