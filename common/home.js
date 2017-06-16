var imgCount = 1;
var isFirstLoad = true;
var focusPos = 1;//默认焦点位置
var maxSize=15;//滚动最大字数控制
var videoPos = 0;//当前视频窗口位置
var isFullScreen = false;//是否全屏播放，false小窗口 true全屏
var lunBoCid = "";//默认轮播频道id
var lunBoPlayUrl = "";
var lunBoTimeOut = -1;//轮播频道定时器
var lunBoUrlParam = "?playType=linear";
var timelength = 0;//seekTime
var imgPostionSize = 28;//图片移动放大尺寸
var globalParams = {
	forPlayAjax: null,
	vodByGuidAjax: null,
	mediaDetailAjax: null,
	appList: ['','','','','','','','']
	//isLunBoUpdateing:false//判断轮播是否正在更新节目(防止定时器和播放结束后同时更新)
}
function imgLoadFun(){
	if(imgCount == parseInt(jQuery(".reflect").size())){
		isFirstLoad = false;
	}
	imgCount++;
}

function getAppList(){
	if(typeof(mediaPlayer.playerType) != "undefined" && mediaPlayer.playerType == "ANDROID"){
		if(typeof(android_userAgent.getAppList) == "function"){
			globalParams.appList = eval("(" + android_userAgent.getAppList() + ").appList");
		}
	}
}
//初始化页面信息
window.onload = intoPageInfo;
function intoPageInfo(){
	getAppList();
	initPageElement();
}
//获取xml模板url
function getXmlModuleUrl(moduleId){
	var xmlFileName = moduleId+"_"+modulePlex;
	if(modulePlex == "public"){
		return PUBLIC_PATH+xmlFileName+".xml";
	}else{
		return PREPARE_PATH+xmlFileName+".xml";
	}
}
/*加载首页xml模板*/
function loadModuleXML(moduleId,url,callback){
  moduleId = moduleId+"_"+modulePlex;
 jQuery.ajax({
		type: "GET",
		url: url,
		dataType: "xml",
		timeout: 50000,
		cache: false,
		error: function(xhr){
			if( xhr.status=="404"){
				callback(false);
			}
		},
		success: function (xml) {
			var data = {content:'',version:''};
		   if(jQuery(xml).find("_PAGE_").length==0)return callback(data,false);
		   jQuery(xml).find("_PAGE_").each(function( ){
				var id = jQuery(this).attr("id");
				data.content=jQuery(this).text().replace("<p>",'').replace("</p>",'').replace("<![CDATA[",'').replace("]]>",'');
				if(id==moduleId){
					if(jQuery(xml).find("VERSION").length==0){
						return callback(data,true);
					}else{
						jQuery(xml).find("VERSION").each(function(){
							data.code = jQuery(this).attr("code");
							cacheHomeVersion(moduleId,data.code);
							callback(data,true);
						});
					}
				}
			});
		}
	});
}
//初始化页面元素
function initPageElement(){
	var menuPos = 0;
	for(var i = 0; i < menus.length; i++){
		if(window.name == menus[i].iframeName){
			menuPos = i;
			break;
		}
	}
	var imgs = jQuery("#content").find("img");
	for(var i=0;i<imgs.length;i++){
		if((imgs[i].getAttribute("id")).indexOf("img_") != -1){
			var picUrl = PUBLIC_VIDEO_PATH + imgs[i].getAttribute("imgad");
			if(picUrl.indexOf("http")==-1){
				if(picUrl.indexOf("upload") != -1){
					picUrl = PUBLIC_VIDEO_PATH+picUrl.substring((picUrl.indexOf("upload/")+7),picUrl.length);
				}else{
					picUrl = PUBLIC_VIDEO_PATH+picUrl;
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
			if(titleBol=="false")display = "none";
			jQuery("#div_"+index).append("<div id=title_"+index+" class='tiltelCl titles_show' style='width:"+imgs[i].width+"px;display:"+display+";' h='30'>"+"<span style='color:white' id=span_"+index+" remarks='"+title_0+"'>"+title_1+"</span></div>");
				
				var obj = new setLoopClass({
					menuPos : menuPos + 1,
					index : index,
					ifram: window
				});
				obj.addLoopObj(obj, menuPos + 1);
				if(window.name == menus[0].iframeName){
					obj.startLoop();
				}
				
			}
	}
	var obj = parent.parent.document.getElementById("blackbg");
	
	if(obj != null){
		//if(obj.style.display != "none"){
		tvsee.debug("tvsee.eventFrame.isLoading:" + tvsee.eventFrame.loadingStatus);
		if(tvsee.eventFrame.loadingStatus == 0 || tvsee.eventFrame.loadingStatus == 2){
			if(tvsee.eventFrame.loadingStatus == 2){
				obj.style.display = "none";	
			}else{
			//obj.style.display = "none";	
				tvsee.eventFrame.loadingStatus = 1;
			}
			if(window.name == "child_iframe_1"){
				for(var i = 1; i < menus.length; i++){
					var iframePos = (i + 1);
					var name = "child_iframe_" + iframePos;
					
					parent.jQuery("#div_iframes").append("<iframe id=child_iframe_"+(i+1)+" name='"+name+"' width='1280px' height='720px' frameBorder='0' scrolling='0' src='"+menus[i].src+"' style='display:none'></iframe>");
					
				}
				tvsee.eventFrame.createWidgets(0);
			}
		}	
	}
	tvsee.eventFrame.globalCache.homeMenus[menuPos].isLoading = true;
	parent.getFocus("meun_"+menuPos);//数据加载完，设置焦点
	parent.focus();
	
}
//设置元素属性值
function setElementAttribute(index,data){
	var imgObj = $("img_"+index);
	$("span_"+index).setAttribute("remarks",data.subhead);
	
	var parentNodeObj =  document.getElementById("span_"+index).parentNode;
	if(parentNodeObj != null){
		var width = parseInt(parentNodeObj.style.width, 10);
		maxSize = Math.floor(width / 25) * 2;
	}
	$("span_"+index).innerHTML = data.subhead;//subStr(data.subhead, maxSize, "...");
	if(data.isSubhead == true || data.isSubhead == "true" || index == focusPos){
		if(globalParams.isParentFocus == false || parent.globalParams.isParentFocus == false){
			if(index == focusPos){
				clearMarqueeText("span_"+focusPos,data.subhead, 15);
				if(data.isSubhead == true || data.isSubhead == "true"){
					$("title_"+index).style.display = "block";
				}else{
					if(data.subhead != ""){
						$("title_"+index).style.display = "block";
					}else{
						$("title_"+index).style.display = "none";
					}
				}
				showMarqueeText("span_"+focusPos,data.subhead, 15);
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
	
	if(isFullScreen == false){
		/*try{
			
			mediaPlayer.stop();
		}catch(e){}*/
	}
	if(data.fileType == "video"){//推荐视频
		var picUrl = PUBLIC_VIDEO_PATH+imgObj.getAttribute("imgad");
		imgObj.src = picUrl;
		imgObj.style.visibility = "visible";
		var playUrl = data.fileNames;
		var fileNames = playUrl.substring(0,(playUrl.indexOf("upload/")+7));
		if(playUrl == fileNames)playUrl="";
		if(playUrl != ""){//后台推荐视频
			if(playUrl.indexOf("upload") != -1){
				playUrl = PUBLIC_VIDEO_PATH+playUrl.substring((playUrl.indexOf("upload/")+7),playUrl.length);
			}
			var params = {};
			if(data.params != ""){
				params = eval("("+data.params+")");
			}
			setWinPlayerPostion(index);
			tvsee.pageWidgets.getByName("widgetMenu").indexBackParams.videoPlayUrl = playUrl;
			winPlay(playUrl,true,params.isLoadPlay);
		}else if(data.operateType == "play"){
			/*var params = {};
			if(data.params != ""){
				params = eval("("+data.params+")");
			}*/
			setWinPlayerPostion(index);
			if(data.serviceType == "demand"){//点播
				vodPlay(data.params.pid,data.params.isLoadPlay);
			}else if(data.serviceType == "lookBack"){//回看
				watchTvPlay(data.params.cid,data.params.mid,data.params.date,data.params.isLoadPlay);
			}else if(data.serviceType == "direct"){//直播
				directPlay(data.params.cid,data.params.isLoadPlay);
			}else if(data.serviceType == "carousel111"){//轮播
				lunBoPlay(data.params,true);
			}
			else if(data.serviceType == "carousel"){//轮播
				if(data.showType == "roundPlay"){ //改成默认取第一个
					if(parent.indexBackParams.cid == -1){
						var imgs = jQuery("#content").find("img");
						var cateArr = [];
						for(var i=0;i<imgs.length;i++){
							if((imgs[i].getAttribute("id")).indexOf("img_") != -1){
								var datajson = jsonFormat(imgs[i].getAttribute("datajson"));
								var json = eval("("+datajson+").list")[0];
								if(json.serviceType == "carousel" && json.operateType == "home"){
									cateArr.push(json.params);	
								}
							}
						}
						var rand = Math.round(Math.random()*cateArr.length);
						if(rand >= 6){
							rand = rand - 1;
						}
						randomForPlay(cateArr[rand]);
						parent.indexBackParams.cid = cateArr[rand];
					}else{
						lunBoCid = parent.indexBackParams.cid;
						showLiveMovieList(lunBoCid);
						var watchTvObj = tvsee.eventFrame.globalParams.globalCache.get("watchTvChannel_CACHE");
						var isForPlayCateId = false;
						if(watchTvObj != false){
							for(var i = 0;i < watchTvObj.length; i++){
								if(watchTvObj[i].catalogid == SPEC_ID.LIVE_ID){
									var childs = watchTvObj[i].secondChannel;	
									for(var j = 0; j < childs.length; j++){
										if(childs[j].catalogid == lunBoCid){
											isForPlayCateId = true;
											break;	
										}	
									}
									break;
								}
							}
						}
						var liveOrWatchMenuPos = getLiveOrWatchMenuPos();
						var menuPos = tvsee.pageWidgets.getByName("widgetMenu").menuSelectPos;
						if(liveOrWatchMenuPos > 0 && isForPlayCateId == false){	
							var num = -1;
							if(liveOrWatchMenuPos > menuPos){
								num = 1;
							}
							moveUD(-1);  //轮播页面暂时写死的处理
							for(var i = 0; i < liveOrWatchMenuPos - menuPos; i++){
								parent.moveLR(num);
								parent.doSelect();
								return;
							}
						}
						if(parent.indexBackParams.fromPage == "VODPLAY"){
							if(parent.indexBackParams.videoWidth != 0 && parent.indexBackParams.videoHeight != 0){
								mediaPlayer.setPlayPostion(parent.indexBackParams.videoLeft, parent.indexBackParams.videoTop, parent.indexBackParams.videoWidth, parent.indexBackParams.videoHeight);
							}
						}else{
							randomForPlay(lunBoCid);
						}
					}
				}else{
					lunBoCid = data.params.cid;
					loopChannelPlay(data.params.cid,true,data.showType);
				}
			}
		}
	}else{//推荐图片
		var loopObj = getCurWinVideoObj();
		if(loopObj != null && loopObj.videoPos == index){
			/*try{
				mediaPlayer.stop();
			}catch(e){}*/
		}
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
					});
				}else{
					imgObj.src = PICURL+value[0].picurl;
				}
			}
		}else if(data.serviceType == "lookBack"){
			if(data.operateType == "historyChannel"){
					if($("div_"+index) != null){//设置背景图
						$("div_"+index).style.background = "url(images/watchtv/homeChannelLogoBg.png) no-repeat"
					}
					tvsee.pageWidgets.getByName("widgetMenu").historyChannelList.push(imgObj);
			}
		}else if(data.serviceType == "carousel"){//轮播
			if(data.operateType == "detailed"){//详情节目单
				var width=$("img_"+index).getAttribute("width");
				var height=$("img_"+index).getAttribute("height");
				if($("movieList") == null){
					jQuery("#div_"+index).append("<div id='movieList' style='position: absolute;width:"+width+"px;height:"+height+"px;left:0px;top:0px;z-index:3;display:block;'></div>");
				}
				if(parent.indexBackParams.cid != -1){
					lunBoCid = parent.indexBackParams.cid;
				}
				showLiveMovieList(lunBoCid);
			}
		}else if(data.serviceType == "function"){
			if(data.operateType == "dramaes"){ //追剧
				var addTv = tvsee.eventFrame.globalParams.globalCache.get("addTv_CACHE");
				var addTvLen = 0;
				var obj = $("img_"+index);
				if(addTv != false && addTv.length > 0){
					addTvLen = addTv.length;
					obj.setAttribute("src", PICURL + addTv[0].picUrl);
				}
				if(document.getElementById("div_dramaes") == null){
					jQuery("#" + obj.parentNode.id).append("<div id ='div_dramaes' class='div_img' style='top:326px;width:"+obj.width+"px;height:100px;'>"+
					"<img src='images/home/fgx.png' style='position:absolute;z-index:10;border:solid 0;top:20px;left:120px'/>"+
					"<span style='margin-left:140px;line-height:80px;width:110px;'>我的追剧"+
					"<span id='dramaeCount' style='color:" + FOCUS_STYLE.COLOR + "'>"+addTvLen+"</span>"+
					"</span></div>"+
					"<img src='images/home/dramaes.png' style='position:absolute;z-index:10;border:solid 0;top:300px;left:10px'/>");
				}else{
					document.getElementById("dramaeCount").innerText = addTvLen;
				}
			}else if(data.operateType == "collect"){//收藏
				var favorite = tvsee.eventFrame.globalParams.globalCache.get("favorite_CACHE");
				var favoriteLen = 0;
				var obj = $("img_"+index);
				if(favorite != false && favorite.length > 0){
					favoriteLen = favorite.length;
					obj.setAttribute("src", PICURL + favorite[0].picUrl);
				}
				if(document.getElementById("div_collect") == null){
					jQuery("#" + obj.parentNode.id).append("<div id ='div_collect' class='div_img' style='top:326px;width:" + document.getElementById(obj.parentNode.id).style.width + ";height:100px'>"+
					"<img src='images/home/fgx.png' style='position:absolute;z-index:10;border:solid 0;top:20px;left:120px'/>"+
					"<span style='margin-left:140px;line-height:80px;width:110px;'>我的收藏"+
					"<span id='collectCount' style='color: " + FOCUS_STYLE.COLOR + "'>" + favoriteLen + "</span>"+
					"</span></div>"+
					"<img src='images/home/collect.png' style='position:absolute;z-index:10;border:solid 0;top:300px;left:10px'/>");
				}else{
					document.getElementById("collectCount").innerText = favoriteLen;
				}
			}else if(data.operateType == "histroy"){//历史
				
			}else if(data.operateType == "interact"){//设置
					
			}else if(data.operateType == "search"){//搜索
					
			}else if(data.operateType == "install"){//二维码
				if(IS_ADD_MULTI_SCREEN == true){
					var imgSize=5;
					var cntvid = "";
					var caIp = "";
					try{
						//cntvid = APK_URL + "?" + globalvar.get("ca_stbid");
						//caIp = globalvar.get("ca_ip") + ":10063";
						cntvid = globalvar.get("ca_mac");
					}catch(e){
						
					}
					jQuery("#img_" + index).parent().append("<img id='imgInstall' src='" + VODEPG_SERVER + "/twoDimensionCodeAction.action?ipAdd=" + caIp + "&imgSize="+imgSize+"&cntvid="+cntvid+"&code=100001' style='position:absolute;z-index:100;border:solid 0;top:20px;left:85px'/>");
				}
			}
			
		}else if(data.serviceType == "app"){
			if(globalParams.appList.length > 0){
				var packageArr = data.packageName.split(",");
				var isShow = "hidden";
				if(getAppIsInstall(packageArr[0]) == true){// 已安装启动应用
					isShow = "visible";
				}
				if($("appInstall" + index) == null){
					jQuery("#img_" + index).parent().append("<img width='106' height='108' id='appInstall"+index+"' src='images/appInstall.png' style='position:absolute;z-index:1;border:solid 0;top:1px;left:176px;visibility: "+isShow+"'/>");
				}else{
					$("appInstall" + index).style.visibility = isShow;	
				}
				/*else{
					var appSiteArr = data.appSite.split(",");
					android_userAgent.downloadApp(appSiteArr[0], appSiteArr[1]);
				}*/
			}
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
//获取文件path
function getFilePath(data){
	var playUrl = data.fileNames;
	var fileNames = playUrl.substring(0,(playUrl.indexOf("upload/")+7));
	if(playUrl == fileNames)playUrl="";
	return playUrl;
}
function randomForPlay(_cid){
	getAllChannel({'catalogid':_cid},function(params,data){
		var channelList = [];
		var intRound = "";
		for(var i=0;i < data.length;i++){
			var childs = data[i].secondChannel;
			for(var j=0;j<childs.length;j++){
				channelList.push(childs[j]);
				tvsee.debug("childs[j].catalogid:" + childs[j].catalogid + "==" + params.catalogid );
				if(childs[j].catalogid == params.catalogid){
					intRound = channelList.length - 1;
				}
			}
		}
		if(intRound == ""){
			intRound = 0;	
		}
		lunBoCid = channelList[intRound].catalogid;
		getDirectPlayURl(channelList[intRound], true);
	});
}
/*页面跳转Action*/
function gotoPageAction(){
	var data = getDataJson(focusPos);
	if(data.length == 1){//不轮循
		data = data[0];
	}else if(data.length > 1){
		var loopObj = getLoopObj(focusPos);
		if(loopObj == null)return;
		data = data[loopObj.loopPos];
	}else{
		return;
	}
	var isAuth = true;
	var filePath = getFilePath(data);
	switch (data.serviceType) {
		case "demand"://点播
			if(data.operateType == "detailed"){//电影详情
				gotoDetailPage(data.params,'detailed');
			}else if(data.operateType == "variety"){//综艺详情
				gotoDetailPage(data.params,'variety');
			}else if(data.operateType == "otherDetail"){
				gotoDetailPage(data.params,'otherDetail');
			}else if(data.operateType == "column"){//列表
				//data =  eval("(" + data.params + ")");
				//data={'cid':1,'colName':'电影'}
				
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
					//params = eval("("+data.params+")");
					params = data.params;
				}
				if(filePath != "" && (params.isLoadPlay == false || params.isLoadPlay == "false")){
					isAuth = false;
				}
				//
				vodPlayPage(isAuth, true, params.pid, params.guid);
				//openVideoPlay(true , params.pid, params.guid);
			}else if(data.operateType == "VIPdetailed"){//VIP详情
				gotoDetailPage(data.params,'VIPdetailed');
			}
			break;
		case "lookBack"://回看
			if(data.operateType == "detailed"){//详情
				homeGotoUrl("watchTv.html?cid="+data.params);
			}else if(data.operateType == "historyChannel"){
				var obj = $("img_"+focusPos);
				if(obj == null){
					return;	
				}
				var channelId = obj.getAttribute("channelId");
				if(channelId == null || channelId == ""){
					channelId = data.params;
				}
				homeGotoUrl("watchTv.html?cid=" + channelId);	
			}else if(data.operateType == "column"){//列表
				homeGotoUrl("watchTv.html?cid=all");
			}else if(data.operateType == "play"){//播放
				var params = {};
				if(data.params != ""){
					params = eval("("+data.params+")");
				}
				if(filePath != "" && params.isLoadPlay == false){
					isAuth = false;
				}
				directAndWatchTvPlayPage(isAuth,data.fileType,0,params.cid,params.mid,params.playDate,data.isLoadPlay);
			}
			break;
		case "direct"://直播
			if(data.operateType == "detailed"){//详情
				homeGotoUrl("watchTv.html?cid="+data.params);
			}else if(data.operateType == "column"){//列表
				homeGotoUrl("watchTv.html?cid=all");
			}else if(data.operateType == "play"){//播放
				var params = {};
				if(data.params != ""){
					params = eval("("+data.params+")");
				}
				if(filePath != "" && params.isLoadPlay == false){
					isAuth = false;
				}
				directAndWatchTvPlayPage(isAuth,data.fileType,1,params.cid,"","",params.isLoadPlay);
			}
			break;
		case "carousel111"://轮播
			if(data.operateType == "detailed"){//详情
				homeGotoUrl("watchTv.html?cid="+data.params);
			}else if(data.operateType == "column"){//列表
				homeGotoUrl("watchTv.html?cid=all");
			}else if(data.operateType == "play"){//播放
				var params = {};
				if(data.params != ""){
					params = eval("("+data.params+")");
				}
//				if(filePath != "" && params.isLoadPlay == false){
//					isAuth = false;
//				}
				isAuth = false;
				
				if(typeof(lunBoCid)=="undefined" || lunBoCid == ""){
					lunBoCid = params.cid;
				}
				lunBoTvPlayPage(isAuth,data.fileType,3,lunBoCid,"","",false);
			}else if(data.operateType == "home"){//小窗口播放
				lunBoPlay(data.params,true);
			}
			break;
//		case "carousel"://轮播
//			if(data.operateType == "detailed"){//详情
//				//directAndWatchTvPlayPage(data.fileType,1,lunBoCid,"","",params.isLoadPlay);
//				if(lunBoCid == ""){
//					return;	
//				}
//				homeGotoUrl("watchTv.html?cid=" + lunBoCid);
//			}else if(data.operateType == "column"){//列表
//				homeGotoUrl("watchTv.html?cid=all");
//			}else if(data.operateType == "play"){//播放
//				var params = {};
//				if(data.params != ""){
//					params = eval("("+data.params+")");
//				}
//				if(filePath != "" && params.isLoadPlay == false){
//					isAuth = false;
//				}
//				//directAndWatchTvPlayPage(isAuth,data.fileType,1,lunBoCid,"","",params.isLoadPlay);
//				directAndWatchTvPlayPage(isAuth,data.fileType,1,lunBoCid,"","", 'false');
//			}else if(data.operateType == "home"){//首页窗口播
//				lunBoCid = data.params;
//				loopChannelPlay(data.params,true,"");
//				showLiveMovieList(data.params);
//			}
//			break;
		case "function"://系统功能
			if(data.operateType == "dramaes"){//我的追剧
				homeGotoUrl("addTVList.html");
			}else if(data.operateType == "collect"){//我的收藏
				homeGotoUrl("favoriteList.html");
			}else if(data.operateType == "histroy"){//观看历史
				homeGotoUrl("recordList.html");
			}else if(data.operateType == "interact"){//系统设置
				/*try{
					mediaPlayer.stop();
				}catch(e){}
				top.triscreenFrame.init3ScreenPage(); 
				top.remotePlayStatus = 2;
				top.document.getElementById("rootDiv").style.display="none";
				top.document.getElementById("div_3screen").style.display="block";*/
				if(IS_GO_SETTING == false){
					return;	
				}
				try{
					mediaPlayer.stop();
				}catch(e){}
				if(typeof(mediaPlayer.playerType)!="undefined"){
					if(mediaPlayer.playerType == "ANDROID"){
						if(typeof(android_userAgent.getAppList) == "function"){
							var appListJsonObj = eval("(" + android_userAgent.getAppList() + ")");
							var index = null;
							for(var i = 0; i < SETTING_APP_PACKAGE_ARR.length; i++){
								for(var j = 0; j < appListJsonObj.appList.length; j++){
									if(SETTING_APP_PACKAGE_ARR[i].packageName == appListJsonObj.appList[j].packageName){
										index = i;
										break;	
									}
								}	
								if(index != null){
									break;	
								}
							}
							if(index != null){
								var obj = SETTING_APP_PACKAGE_ARR[index];
								hashtable.put("operateObjType", 7);
								hashtable.put("operateObjName", obj.packageName);
								tvsee.eventFrame.saveLogUserActioncontent();
								android_userAgent.startApp(obj.packageName, obj.activityName, obj.params);	
							}
						}else{
							android_userAgent.startApp("com.konka.settingsmbox", "com.konka.settingsmbox.SettingsMboxActivity", null);
						}
						//android_userAgent.startApp("com.konka.app", "com.konka.app.Allapp", "showType,0");	
					}
				}
			}else if(data.operateType == "search"){
				homeGotoUrl("search.html?words="+data.params);
			}else if(data.operateType == "install"){//三屏互动
				if(IS_ADD_MULTI_SCREEN == true){
					var widgetTriScreen = tvsee.pageWidgets.getByName("widgetTriScreen");	
					if(widgetTriScreen != null){
						tvsee.pageWidgets.getByName("widgetMenu").hideWin();
						widgetTriScreen.show();
					}
					return;
				}
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
						//android_userAgent.startApp("com.android.settings", "com.android.settings.Settings");
						
					}
				}
				
			}
			break;
		case "expand"://扩展
			if(data.operateType == "newest"){//最近更新
				homeGotoUrl("recentlyUpdatedList.html?windowSize=fullScreen");
			}else if(data.operateType == "special"){//专题
				gotoSpecialDescPage(data.params);
			}else if(data.operateType == "search"){//搜索
				homeGotoUrl("search.html?words="+data.params);
			}else if(data.operateType == "channelDetailed"){//频道详情
				//showChannelHistory();
			}/*else if(data.operateType == "URL"){//url跳转
				/homeGotoUrl(url)
			}*/else if(data.operateType == "URL"){
				tvsee.pageWidgets.getByName("widgetMenu").hideWin();
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
							//android_userAgent.startApp("com.android.settings", "com.android.settings.Settings");
							
						}
					}
					return;
				}
			if(getAppIsInstall(packageArr[0]) == true){// 已安装启动应用
				/*var otherParams = data.otherParams;
				if(otherParams == "" || otherParams == "null"){
					otherParams = null;
				}*/
				hashtable.put("operateObjType", 7);
				hashtable.put("operateObjName", packageArr[0]);
				tvsee.eventFrame.saveLogUserActioncontent();
				android_userAgent.startApp(packageArr[0], packageArr[1], otherParams);
			}else{
				var widgetDialog = tvsee.pageWidgets.getByName("widgetDialog");
				if(widgetDialog != null){
					var appSiteArr = data.appSite.split(",");
					widgetDialog.initData(["是否下载当前应用?", 0], [["确认", "取消"], 0], function(_btnArea, _callParams){
						if(_btnArea == 0){
							hashtable.put("operateObjType", 6);
							hashtable.put("operateObjName", _callParams[1]);
							tvsee.eventFrame.saveLogUserActioncontent();
							android_userAgent.downloadApp(_callParams[0], _callParams[1]);
						}
					}, appSiteArr);	
					widgetDialog.show();
				}		
				//var appSiteArr = data.appSite.split(",");
				//android_userAgent.downloadApp(appSiteArr[0], appSiteArr[1]);
			}
		break;
	}
	if(globalParams.vodByGuidAjax != null){
		globalParams.vodByGuidAjax.requestAbort();	
	}
	if(globalParams.mediaDetailAjax != null){
		globalParams.mediaDetailAjax.requestAbort();	
	}
	clearLoopTask(0);
	parent.resetBackParams();
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

function resetVideoPlay(){
		
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
//mediaPlayer.guidPlay(_playUrl, lastTimelength);
String.prototype.replaceAll = function (str1,str2){
  var str    = this;     
  var result   = str.replace(eval("/"+str1+"/gi"),str2);
  return result;
}
function jsonFormat(datajson){
	if(datajson==null || datajson == ""){
		return null;
	}
	
	if(datajson.indexOf("'serviceType':'app'") != -1){
		datajson = datajson.replace("'serviceType':'app'", "'serviceType':'app','params':''");
	}
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
			 v_2="'{"+v_1+"}'"+test_2[1]
		}
		
		if(i==jsonArray.length-1){
			newList+=test_1[0]+"'params':"+v_2;	
		}else{
			newList+=test_1[0]+"'params':"+v_2+"},";		
		}
	}
	return "{'list':["+newList+"]}";
}
//获取Img中的dataJson数据
function getDataJson(index){
	var dataJson = [];
	var imgObj = $("img_"+index);
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
//点播
function vodPlay(pid,isLoadPlay){
	if(pid == "")return;
	var value = tvsee.eventFrame.globalParams.dataCache.get("movieDetail_" + pid);	
	if(value==null || value == false){
		/*var url = parent.getAjaxUrl("mediaDetail",pid);
		doAjax(url, null,function(data, status) {
			if (status == "success") {
				tvsee.eventFrame.globalParams.dataCache.put("movieDetail_" + pid, data);
				if(data.movies.length>0){
					getVodPlayUrl(data.movies[0].guid,isLoadPlay);
				}
			}
		})*/
		if(globalParams.mediaDetailAjax != null){
			globalParams.mediaDetailAjax.requestAbort();	
		}
		globalParams.mediaDetailAjax = new ajaxClass();
		globalParams.mediaDetailAjax.frame = window;
		globalParams.mediaDetailAjax.url = getAjaxUrl("mediaDetail", pid);
		globalParams.mediaDetailAjax.callbackParams = [isLoadPlay, pid];
		globalParams.mediaDetailAjax.successCallback = function(_xmlHttp, _params) {
			eval("var data = (" + _xmlHttp.responseText + ")");
			tvsee.eventFrame.globalParams.dataCache.put("movieDetail_" + _params[1], data);
			if(data.movies.length > 0){
				getVodPlayUrl(data.movies[0].guid, _params[0]);
			}
		};
		globalParams.mediaDetailAjax.failureCallback = function(_xmlHttp, _params) {
			
		};
		globalParams.mediaDetailAjax.requestData();	
	}else{
		if(value.movies.length>0){
			getVodPlayUrl(value.movies[0].guid,isLoadPlay);
		}
	}
}
//获取点播地址
function getVodPlayUrl(guid,isLoadPlay){
	if(ISXNMS == true){
		/*var url = parent.getAjaxUrl("vodByGuid",guid);
		doAjax(url, null,function(data, status) {
			if (status == "success") {
				if(data.xnms.vodType == "p4p"){
					winPlay("vod://" + guid,false,isLoadPlay);
				}else{
					winPlay(data.xnms.vodURL,true,isLoadPlay);
				}
			}
		})*/
		if(globalParams.vodByGuidAjax != null){
			globalParams.vodByGuidAjax.requestAbort();	
		}
		globalParams.vodByGuidAjax = new ajaxClass();
		globalParams.vodByGuidAjax.frame = window;
		globalParams.vodByGuidAjax.url = getAjaxUrl("vodByGuid", guid);
		globalParams.vodByGuidAjax.callbackParams = [isLoadPlay, guid];
		globalParams.vodByGuidAjax.successCallback = function(_xmlHttp, _params) {
			eval("var data = (" + _xmlHttp.responseText + ").xnms");
			if(data.vodType == "p4p"){
				winPlay(_params[1], false, _params[0]);
			}else{
				winPlay(data.vodURL, true, _params[0]);
			}
		};
		globalParams.vodByGuidAjax.failureCallback = function(_xmlHttp, _params) {
		////$("type_0").innerText = "加载数据失败！";
			winPlay("vod://" + _params[1], false, _params[0]);
		};
		globalParams.vodByGuidAjax.requestData();	
	}else{
		winPlay("vod://" + guid,false,isLoadPlay); 
	}
}
//回看播放
function watchTvPlay(cid,mid,date,isLoadPlay){
	if(cid == "" || mid=="" || date=="")return;
	var params = {
		'catalogid' : cid,
		'date' : date,
		'mid' : mid,
		'isLoadPlay' : isLoadPlay
	}
	getMovieListByDate(params, function(params, data){
		for(var i = 0; i < data.movie.length; i++){
			if(data.movie[i].mid == params.mid){
				winPlay(getWatchPlayUrl(data.channel, data.movie[i]), true, params.isLoadPlay);
				break;
			}
		}
	});
}
//获取当前频道
function getcurrChannelData(catalogid){
	var channel = null;
	var channelList = tvsee.eventFrame.globalParams.globalCache.get("watchTvChannel_CACHE");
	//缓存频道
	for(var i=0;i<channelList.length;i++){
		var childs = channelList[i].secondChannel;
		for(var j=0;j<childs.length;j++){
			if(catalogid == childs[j].catalogid){
				 channel = childs[j];
				 break;
			}
		}
	}
	return channel; 
}
//获取当前轮播频道
function getcurrLunBoChannelData(catalogid){
	var channel = tvsee.eventFrame.globalParams.globalCache.get("watchLunBoTvChannel_CACHE");
	//缓存频道
//	for(var i=0;i<channelList.length;i++){
//		var childs = channelList[i].secondChannel;
//		for(var j=0;j<childs.length;j++){
//			if(catalogid == childs[j].catalogid){
//				 channel = childs[j];
//				 break;
//			}
//		}
//	}
	return channel; 
}
//直播播放
function directPlay(cid,isLoadPlay){
	if(cid == "")return;
	getAllChannel({'catalogid' : cid}, function(params, data){
		var playUrl = getLivePlayUrl(getChannelById(params.catalogid, data));
		winPlay(playUrl, true, params.isLoadPlay);
	});
}
//轮播播放
function lunBoPlay(cid,isLoadPlay){
	tvsee.debug("cid:" + cid);
	if(cid == "")return;
	parent.clearInterval(parent.lunBoInterval);
	try{
		mediaPlayer.stop();
	}catch(e){}
	var imgObj = $("img_1");
	tvsee.debug("imgObj:" + imgObj);
	if(imgObj.style.visibility != "hidden"){
		imgObj.style.visibility = "hidden";
	}
	lunBoCid = cid;
	removeCacheData("watchLunBoTvChannel_CACHE");//频道已经切换，清除缓存
	getLunBoChannel({'catalogid' : cid}, function(params, data){
		tvsee.debug("data:" + data);
		var lunBoProgram = getLunBoProgramByTime(TvseeDate.getTime(),data);
		tvsee.debug("lunBoProgram:" + lunBoProgram);
		if(lunBoProgram != null ){//当前时间有节目
			lunBoPlayUrl = REDIRECT_LUNBO_URL + lunBoProgram.guid;//播放url
			tvsee.debug("lunBoPlayUrl:" + lunBoPlayUrl);
			tvsee.debug("TvseeDate.getTime():" + TvseeDate.getTime());
			var seekTime = TvseeDate.getTime()-new Date(Date.parse(lunBoProgram.beginTime.replace(/-/g, "/"))).getTime();
			$("title_1").style.display = "block";
			$("span_1").innerText = "正在播放:" + lunBoProgram.moviename;
			if(seekTime > 0){//判断是否需要seek
				winPlay(lunBoPlayUrl, true, isLoadPlay,seekTime);
			}else{
				winPlay(lunBoPlayUrl, true, isLoadPlay, 0);
			}
		}else{//当前时间没有节目
		 tvsee.debug("lunBoProgram is null" );
			$("title_1").style.display = "none";
			lunBoPlayUrl = "";
			if(imgObj.src.indexOf("ending") < 0){
				imgObj.src="images/play/ending.jpg";
			}
			if(imgObj.style.visibility != "visible"){
				imgObj.style.visibility = "visible";
			}

		}
		
	});
		parent.lunBoInterval = parent.setInterval(function(){//开启定时任务去更新当前节目
			updateLunboProgram();	
		}, 600000);

}
//更新轮播节目
function updateLunboProgram(){
	if(lunBoPlayUrl != ""){
		return ;
	}
	removeCacheData("watchLunBoTvChannel_CACHE");//频道已经切换，清除缓存
	var imgObj = $("img_1");
	if(imgObj.style.visibility =="hidden" || imgObj.src != "images/play/ending.jpg"){
		imgObj.src="images/play/ending.jpg";
		imgObj.style.visibility = "visible";
	}
	
	getLunBoChannel({'catalogid' : lunBoCid}, function(params, data){
		var lunBoProgram = getLunBoProgramByTime(TvseeDate.getTime(), data);
		if(lunBoProgram != null ){//还有播放的节目
			lunBoPlayUrl = REDIRECT_LUNBO_URL + lunBoProgram.guid;
			$("title_1").style.display = "block";
			$("span_1").innerText = "正在播放:" + lunBoProgram.moviename;
			var seekTime = TvseeDate.getTime()-new Date(Date.parse(lunBoProgram.beginTime.replace(/-/g, "/"))).getTime();
			if(seekTime > 0){//判断是否需要seek
				winPlay(lunBoPlayUrl, true, true,seekTime);
			}else{
				winPlay(lunBoPlayUrl, true, true,0);
			}
		}else{
			lunBoPlayUrl = "";
		}
		
	});
}
//获取直播地址
function getDirectPlayURl(channel,isLoadPlay){
	winPlay(getLivePlayUrl(channel),true,isLoadPlay);
}
//轮播频道播放
function loopChannelPlay(cid,isLoadPlay,showType){
	if(showType == "roundPlay"){//随机获取频道
		getAllChannel({'catalogid':_cid},function(params,data){
			var channelList = [];
			for(var i=0;i<data.length;i++){
				var childs = data[i].secondChannel;
				for(var j=0;j<childs.length;j++){
					channelList.push(childs[j]);
				}
			}
			var intRound = Math.round(Math.round(channelList.length));
			if(intRound>0)intRound=intRound-1;
			lunBoCid = channelList[intRound].catalogid;
			getDirectPlayURl(channelList[intRound],isLoadPlay);
		});
	}else{//指定默认频道
		if(cid == "")return;
		/*getAllChannel({'catalogid':cid},function(params,data){
			var channel = getChannelById(params.catalogid,data);
			if(typeof(channel.catalogid) != "undefined"){
				lunBoCid = channel.catalogid;
			}
			getDirectPlayURl(channel,isLoadPlay);
		});*/
		//getDirectPlayURl("http://27.221.10.83:7080/tvseeHandle/authentication/video?type=3&url=http://10.255.199.60:1220/luzhi1/vdd/live/c001/now/live.m3u8",isLoadPlay);
		winPlay("http://27.221.10.83:7080/tvseeHandle/authentication/video?type=3&url=http://10.255.199.60:1220/luzhi1/vdd/live/c001/now/live.m3u8",true,isLoadPlay);
	}
}

//显示轮播频道节目单
function showLiveMovieList(_cid){
	if(_cid == ""){
		return;	
	}
	getLiveMovieList({'catalogid':_cid}, function(params, data){
		var movies = [];
		for(var i=0;i<data.movie.length;i++){
			if(data.movie[i].status != 0){
				movies.push(data.movie[i]);
			}
		}
		initMovieList(movies);
	});
}

//初始化节目单
function initMovieList(movieList){
	var size = 9,isDivAt = false,top = "",id="";
	if(document.getElementById("programName0") != null){
		isDivAt = true;					   
	}
	for(var i = 0; i < size; i++){
		if(isDivAt == true){
			document.getElementById("programName" + i).innerHTML = "";
			document.getElementById("line" + i).style.visibility = "hidden";
			document.getElementById("play_live" + i).style.visibility = "hidden";
		}else{
			var id = 'programName' + i;
			var img_id = 'line' + i;
			top = (i * 47) + "px";	
			img_top = (i * 47) + "px";
			if(i == 0){
				jQuery("#movieList").append("<div id='play_live"+i+"'  style='background:url(images/watchtv/zhiboIcon.png); width: 34px; height: 32px; top: 5px; left: 10px; z-index: 2; visibility: hidden;'></div>");
				jQuery("#movieList").append("<div id="+ id +"   style='width: 100%; height: 90px; z-index: 1; left: 50px; position:absolute; color: #FFF; line-height: 47px; font-size:22px; top: " + top + "'></div>");
			}else{
				jQuery("#movieList").append("<div  id='play_live"+i+"' style='background:url(images/watchtv/zbnosel.png); width: 34px; height: 32px; top: "+(parseInt(top, 10) + 5)+"px; left: 10px; z-index: 2; visibility: hidden;'></div>");
				jQuery("#movieList").append("<div id="+ id +"   style='width: 100%; height: 90px; z-index: 1; left: 50px; position:absolute; color: #717171; line-height: 47px; font-size:22px; top: " + top + "'></div>");	
			}
			jQuery("#movieList").append("<div id="+ img_id +"   style='background:url(images/home/live_line.png);width: 280px; height: 3px; z-index: 2; left: 0px; position:absolute;   top: " + top + ";visibility: hidden'></div>");
		}
	}
	if(movieList.length < size){
		size = movieList.length;
	}
	var stratTime = "",movieName = "",id = "";
	var firstProgramEndTime = 0;
	if(size > 0){
		firstProgramEndTime = movieList[0].classification;	
		updateProgramListShow(firstProgramEndTime);
	}
	for(var i = 0; i < size; i++){
		stratTime = movieList[i].stratTime;
		movieName = movieList[i].moviename;
		if(getCharByte(movieName) > 14){
			movieName = subStr(movieName, 14, "");	
		}
		document.getElementById("play_live" + i).style.visibility = "visible";	
		document.getElementById("programName" + i).innerHTML = stratTime + "&nbsp;" + movieName;
		document.getElementById("line" + i).style.visibility = "visible";
	}
	
}
function updateProgramListShow(_endTime){
	var currTime = TvseeDate.getTime();
	window.clearTimeout(lunBoTimeOut);
	lunBoTimeOut = setTimeout(function(){
		showLiveMovieList(lunBoCid);						
	}, (_endTime - currTime) * 1000);
}
//轮播频道节目单刷新
function lunBoMovieRef(liveMovie){
	clearTimeout(lunBoTimeOut);
	var times = liveMovie.endMillisecond - TvseeDate.getTime();
	lunBoTimeOut = setTimeout(function(){
		showLiveMovieList(liveMovie.cateid);
	},times*1000);
}
/*回看历史频道*/
function watchTvHistoryChannel(channelList){
	hashtable.put("professionType", 2);
	var channelArray=document.getElementsByName("channel");//频道
	for(var i=0;i<channelList.length;i++){
		channelArray[i].setAttribute("src",getChannelLogoPicUrl(channelList[i].picUrl));
		channelArray[i].setAttribute("channelname",channelList[i].channelName);
		channelArray[i].setAttribute("channelId",channelList[i].channelId);
		channelArray[i].setAttribute("tvId",channelList[i].tvId);
		$("span_"+(i+1)).setAttribute("remarks",channelList[i].channelName);
		$("span_"+(i+1)).innerHTML = subStr(channelList[i].channelName, $("title_"+(i+1)).getAttribute("fontLength"), "...");
	}
}
/*跳转栏目列表页面*/
function gotoProgramListPage(cid,cname){
	var saverstatus = tvsee.eventFrame.globalParams.globalCache.get("isSaverStatus");
	
	if (saverstatus == "true"){
		return 
	}else{
		
	}
	try{
		mediaPlayer.stop();
	}catch(e){}
	if(cid == "")return;
	if(cname == "专题"){
		var widgetSpecialList = tvsee.pageWidgets.getByName("widgetSpecialList");
		if(widgetSpecialList != null){
			tvsee.pageWidgets.getByName("widgetMenu").hideWin();
			widgetSpecialList.show();
			widgetSpecialList.initData(cid,cname);
		}
	}else{
		var widgetVodList = tvsee.pageWidgets.getByName(getMovieListByCid(cid));
		if(widgetVodList != null){
			tvsee.pageWidgets.getByName("widgetMenu").hideWin();
			widgetVodList.show();
			widgetVodList.initMenu(cid, cname, "HOME");
		} 
	}
}
/*专题详细页面*/
function gotoSpecialDescPage(pid){
	try{
		mediaPlayer.stop();
	}catch(e){}
	if(pid == "")return;
	tvsee.pageWidgets.getByName("widgetMenu").hideWin();
	widgetObj = tvsee.pageWidgets.getByName("widgetSpecialDesc");
	widgetObj.show();
	widgetObj.initData(pid,"HOME");
}
/*跳转电影或综艺详情页面*/
function gotoDetailPage(pid,type){
	if(typeof(pid) == "object"){
		pid = pid.pid;
	}
	try{
		mediaPlayer.stop();
	}catch(e){}
	if(pid == "")return;
	var goToUrl = "vodDetail.html?pid=" + pid;
	goToUrl += "&fromPage=HOME&windowSize=fullScreen";
	if(type == "variety"){//综艺详情页
		goToUrl = " vodVarietyDetailNew.html?pid=" + pid;
		goToUrl += "&fromPage=HOME&windowSize=fullScreen";
	}else if(type == "otherDetail"){
		goToUrl = " vodVarietyDetail.html?pid=" + pid;
		goToUrl += "&fromPage=HOME&windowSize=fullScreen";
	}/*else if(type == "VIPdetailed"){
		goToUrl = "vipVodDetail.html?pid=" + pid;
		goToUrl += "&fromPage=VIPHOME&windowSize=fullScreen";
	}*/
	hashtable.put("ratingsSource", 3);
	//goToUrl = "userManager.html";
	tvsee.pageWidgets.getByName("widgetMenu").hideWin();
	gotoPageUrl(goToUrl);
}
/*点播全屏播放*/
function openVodPlay(isAuth,isLoadPlay,pid,guid){
	var value = tvsee.eventFrame.globalParams.dataCache.get("movieDetail_" + pid);
	if(value == false){
		return;
	}
	var movie = null;
	var ppvid = value.program.tag;
	if(guid.indexOf("{") == -1){
		guid = "{" + guid + "}";	
	}
	for(var i=0;i<value.movies.length;i++){
		if(value.movies[i].guid == guid){
			movie = value.movies[i];
			break;
		}
	}
	//if(typeof(guid)=="undefined" || guid == null || guid == ""){
		movie = value.movies[0];
///	}
	if(movie == null)return;
	if(isAuth == true && ISAAA == true){//业务认证
		var widgetAuthOrDed = tvsee.pageWidgets.getByName("widgetAuthOrDed");
		widgetAuthOrDed.show();
		var winObj = tvsee.pageWidgets.getByName("widgetMenu");
		var callMethod = "openVodPlay(false,"+isLoadPlay+","+pid+",'"+guid+"')";
		widgetAuthOrDed.initData({pid:pid,guid: movie.guid, ppvid: ppvid, movieName:movie.moviename, pirceType:'2'}, callMethod, winObj, "home");
		return; 
	}
	tvsee.pageWidgets.getByName("widgetMenu").hideWin();
	hashtable.put("ratingsSource", 3);
	if((isLoadPlay == "true" || isLoadPlay == true) && isFullScreen == false){
		try{
			mediaPlayer.stop();
		}catch(e){}
		//isFullScreen = false;
		var url = "vodPlay.html?fromPage=HOME&isHttp=false&pid=" + pid;
		url += "&playUrl=" +guid + "&timelength=" + movie.timelength + "&lastTimelength=0";
		url += "&movieName=" + movie.moviename + "&moviePic=" + movie.moviepicurl + "&episode=0";
		tvsee.pageWidgets.getByName("widgetMenu").hideWin();
		gotoPageUrl(url);
	}else{
		var widgetVodPlay = tvsee.pageWidgets.getByName("widgetVodPlay");
		widgetVodPlay.show();
		clearLoopTask(0);
		try{
			mediaPlayer.setFullScreen();
		}catch(e){}
		isFullScreen = true;
		widgetVodPlay.widgetPlay("", "", "HOMEPLAY", "", "", guid, movie.timelength, 0, pid, 0, movie.moviename,true, movie.moviepicurl,isLoadPlay);
	}
}
/*首页URL跳转*/
function homeGotoUrl(url){
	try{
		mediaPlayer.stop();
	}catch(e){}
	tvsee.pageWidgets.getByName("widgetMenu").hideWin();
	gotoPageUrl(url);
}

/*回看直播播全屏播放页面*/
function directAndWatchTvPlayPage(_isAuth,fileType,type,cid,mid,date,isLoadPlay){
	//业务认证
	//isLoadPlay = true;
	if(_isAuth == true && ISAAA == true && cid != null && cid != ""){
		var widgetAuthOrDed = tvsee.pageWidgets.getByName("widgetAuthOrDed");
		widgetAuthOrDed.show();
		var winObj = tvsee.pageWidgets.getByName("widgetMenu");
		var channel = getcurrChannelData(cid);
		if(type == 1){//直播价签
			ppvid = channel.spname;
		}else{//回看价签
			ppvid = channel.spid;
		}
		var callMethod = "directAndWatchTvPlayPage(false,'"+fileType+"','"+type+"','"+cid+"','"+mid+"','"+date+"','"+isLoadPlay+"')";
		widgetAuthOrDed.initData({guid: cid, ppvid: ppvid, movieName: channel.catalogname, pirceType:type}, callMethod, winObj, "home");
		return;
	}
	//isLoadPlay true全屏后需要重新加载播放地址， false全屏后继续播当前视频,只是窗口全屏
	parent.backLunBoCid = cid;
	tvsee.pageWidgets.getByName("widgetMenu").hideWin();
	if(isLoadPlay == "false"){
		try{
			mediaPlayer.setFullScreen();
		}catch(e){}
		isFullScreen = true;
		var widgetVodPlay = tvsee.pageWidgets.getByName("widgetVodPlay");
		widgetVodPlay.show();
		clearLoopTask(0);
		widgetVodPlay.widgetPlay(cid, type, "HOMEPLAY", mid, date, "", 0, 0, 0, '', '','true', '',isLoadPlay);
	}else{
		try{
			mediaPlayer.stop();
		}catch(e){}
		//isFullScreen = true;
		gotoPageUrl("vodPlay.html?fromPage=WATCHTVHOME&type=" + type +"&date="+date+"&cid="+cid+"&mid="+mid+"&playUrl=&timelength=0&episode=0&movieName=&isHttp=true&moviePic=");
	}
}
/*轮播全屏播放页面*/
function lunBoTvPlayPage(_isAuth,fileType,type,cid,mid,date,isLoadPlay){
	/*
	//业务认证
	//isLoadPlay = true;
	if(_isAuth == true && ISAAA == true && cid != null && cid != ""){
		var widgetAuthOrDed = tvsee.pageWidgets.getByName("widgetAuthOrDed");
		widgetAuthOrDed.show();
		var winObj = tvsee.pageWidgets.getByName("widgetMenu");
		var channel = getcurrLunBoChannelData(cid);
		if(type == 1){//直播价签
			ppvid = channel.spname;
		}else{//回看价签
			ppvid = channel.spid;
		}
		var callMethod = "directAndWatchTvPlayPage(false,'"+fileType+"','"+type+"','"+cid+"','"+mid+"','"+date+"','"+isLoadPlay+"')";
		widgetAuthOrDed.initData({guid: cid, ppvid: ppvid, movieName: channel.catalogname, pirceType:type}, callMethod, winObj, "home");
		return;
	}
	*/
	//isLoadPlay true全屏后需要重新加载播放地址， false全屏后继续播当前视频,只是窗口全屏
	//parent.backLunBoCid = cid;
	tvsee.pageWidgets.getByName("widgetMenu").hideWin();
	parent.clearInterval(parent.lunBoInterval);//清除定时任务
	if(isLoadPlay == false){
		try{
			mediaPlayer.setVideoScale(false);
			mediaPlayer.setFullScreen();
		}catch(e){}
		isFullScreen = true;
		var widgetVodPlay = tvsee.pageWidgets.getByName("widgetVodPlay");
		widgetVodPlay.show();
		clearLoopTask(0);
		widgetVodPlay.widgetPlay(cid, type, "HOMEPLAY", mid, date, lunBoPlayUrl, 0, 0, '', '', '','true', '',isLoadPlay);
		//widgetPlay(_cid, _type, _fromPage, _mid, _date, _playUrl, _timelength ,_episode, _pid, _lastTimelength, _movieName, _isHttp, _moviePic,_isLoadPlay)
	}else{
		try{
			mediaPlayer.stop();
		}catch(e){}
		//isFullScreen = true;
		//livePlayUrl = "http://27.221.10.83:7080/tvseeHandle/authentication/video?type=3&url=http://10.255.199.60:1220/luzhi1/vdd/live/c002/now/live.m3u8";
		var widgetVodPlay = tvsee.pageWidgets.getByName("widgetVodPlay");
		widgetVodPlay.show();
		widgetVodPlay.widgetPlay(cid, type, "HOMEPLAY", mid, date, lunBoPlayUrl, 0, 0, '', '', '','true', '',isLoadPlay);
		//gotoPageUrl("vodPlay.html?fromPage=HOMEPLAY&type=" + type +"&date="+date+"&cid="+cid+"&mid="+mid+"&playUrl=&timelength=0&episode=0&movieName=&isHttp=true&moviePic=");
	}
}

function openVideoPlay(_isLaodPlay, _pid, _guid){
	if(ISAAA == true){//业务认证
		var widgetAuthOrDed = tvsee.pageWidgets.getByName("widgetAuthOrDed");
		if(widgetAuthOrDed == null){
			return;	
		}
		var widgetMenuObj = tvsee.pageWidgets.getByName("widgetMenu");
		widgetAuthOrDed.show();
		widgetAuthOrDed.initData({guid: moviesData[0].guid, ppvid: moviesData[0].tag, movieName: moviesData[0].moviename}, callMethod, widgetMenuObj, "home");
	}else{
		tvsee.pageWidgets.getByName("widgetMenu").hideWin();
		gotoPageUrl("vodPlay.html?fromPage=HOME&isHttp=false&pid=" + _pid + "&playUrl=" + _guid + "&timelength=0&lastTimelength=0&movieName=&moviePic=&episode=0");	
	}
}
/*跳转点播全屏播放页面*/
function vodPlayPage(isAuth,isLoadPlay,pid,guid){
	if(pid == "")return;
	if(isLoadPlay){
		try{
			mediaPlayer.stop();
		}catch(e){}
	}
	var value = tvsee.eventFrame.globalParams.dataCache.get("movieDetail_" + pid);	
	if(value==null || value == false){
		var url = parent.getAjaxUrl("mediaDetail",pid);
		doAjax(url, null,function(data, status) {
			if (status == "success") {
				tvsee.eventFrame.globalParams.dataCache.put("movieDetail_" + pid, data);
				openVodPlay(isAuth,isLoadPlay,pid,guid);
			}
		})
	}else{
		openVodPlay(isAuth,isLoadPlay,pid,guid);
	}
}
function cacheHomeVersion(module,version){
	if(tvsee.eventFrame.globalCache.versionArr.length == 0){
		tvsee.eventFrame.globalCache.versionArr.push({
			module: module,
			version: version
		});
	}
	for(var i=0;i<tvsee.eventFrame.globalCache.versionArr.length;i++){
		if(module != tvsee.eventFrame.globalCache.versionArr[i].module){
			tvsee.eventFrame.globalCache.versionArr.push({
				module: module,
				version: version
			});
		}
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
		var blo = tvsee.eventFrame.globalParams.globalCache.get("isSaverStatus");
		if (blo === 0){
			return
		}
		var wigetLauncher = tvsee.pageWidgets.getByName("widgetLauncher");
		if(wigetLauncher != null){
			tvsee.pageWidgets.getByName("widgetMenu").hideWin();
			wigetLauncher.showWin();
		}else{
			tvsee.pageWidgets.getByName("widgetMenu").exitAppTip();
		}
	}
}
function doSelect(){
	var blo = tvsee.eventFrame.globalParams.globalCache.get("isSaverStatus");
	if (blo == false){
		gotoPageAction()
	}	
	if (blo == 0){
		return
	}else{
		gotoPageAction()
		};
	
	
}
function moveLR(_num){
	var _focusPos = -1;
	if(_num == 1){
		_focusPos = getFocusObjId("right");
		if(_focusPos==-1)return;
	}else{
		_focusPos = getFocusObjId("left");
		if(_focusPos==-1)return;
	}
	lostFocusStyle();
	focusPos = _focusPos;
	getFocusStyle();
	getFocus("img_"+focusPos);
}
function moveUD(_num){
	var _focusPos = -1;
	if(_num == 1){
		_focusPos = getFocusObjId("down");
		if(_focusPos==-1)return;
	}else{
		_focusPos = getFocusObjId("up");
		if(_focusPos==-1)return;
		if(_focusPos == 0){
			parent.ifrFocusPos = focusPos;
			lostFocusStyle();
			hideFrame();
			var menuPos = tvsee.pageWidgets.getByName("widgetMenu").menuFocusPos;
			parent.getMenuFocusStyle("menu_"+menuPos);
			parent.menuAction();
			parent.globalParams.isParentFocus = true;
			parent.focus();
			return;
		}
	}
	lostFocusStyle();
	focusPos = _focusPos;
	getFocusStyle();
	getFocus("img_"+focusPos);
}
function getFocusStyle(){

	var imgObj = $("img_"+focusPos);
	if(imgObj == null)return;
	var loopObj = getLoopObj(focusPos);
	if(loopObj != null){
		var data = getDataJson(focusPos);
		if(data.length>0){
			data = data[loopObj.loopPos];
			if(data.fileType == "video"){
				return;
				var left = parseInt(imgObj.x)+1;
				var top = parseInt(imgObj.y);
				try{
					mediaPlayer.setPlayPostion(left,top,imgWidth,imgHeight);
				}catch(e){}
			}else if(data.serviceType == "function"){
				if(data.operateType == "dramaes" || data.operateType == "collect" ){
					if($("div_" + data.operateType) != null){
						var width = parseInt($("div_" + data.operateType).style.width);
						var height = parseInt($("div_" + data.operateType).style.height);
						var new_width = (width + imgPostionSize) + "px"
						var new_height = (height + imgPostionSize) + "px";
						jQuery("#div_"+ data.operateType).css({"width": new_width,"height": new_height});
					}
				}	
			}else if(data.serviceType == "app"){
				var width = parseInt($("appInstall" + focusPos).width);
			    var height = parseInt($("appInstall" +focusPos).height);
			    var new_width = (width + imgPostionSize) + "px"
			    var new_height = (height + imgPostionSize) + "px";
			    jQuery("#appInstall"+ focusPos).css({"width": new_width,"height": new_height});	
			}else if(data.isSubhead == false || data.isSubhead == "false"){
				var titles = jQuery("#span_"+focusPos).attr("remarks");
				if(titles != ""){
					$("title_" + focusPos).style.display = "block";	
				}else{
					$("title_" + focusPos).style.display = "none";		
				}
				/*$("title_" + focusPos).style.display = "none";*/
			}else if(data.isSubhead == true || data.isSubhead == "true"){
				var titles = jQuery("#span_"+focusPos).attr("remarks");
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
	if(divObj == null)return;
	var divLeft = jQuery("#div_"+focusPos).css("left")=="auto"?0:jQuery("#div_"+focusPos).css("left");
	var divTop = jQuery("#div_"+focusPos).css("top")=="auto"?0:jQuery("#div_"+focusPos).css("top");
	jQuery("#div_"+focusPos).css({"width":imgWidth+"px","height":imgHeight+"px","display":"block","bottom":"-14px"});
	jQuery("#div_"+focusPos).find("canvas").css("width",imgWidth+"px");
	jQuery("#div_"+focusPos).css({"top":""+(parseInt(divTop)-imgPostionSize/2)+"px","left":""+(parseInt(divLeft)-imgPostionSize/2)+"px","z-index":10});
	jQuery("#title_"+focusPos).css({"width":imgWidth});
	var titles=jQuery("#span_"+focusPos).attr("remarks");
	showMarqueeText("span_"+focusPos,titles,15);
}

function showImgTitle(){
	var imgObj = $("img_" + focusPos);
	if(imgObj == null)return;
	var loopObj = getLoopObj(focusPos);
	if(loopObj != null){
		var data = getDataJson(focusPos);
		var data = getDataJson(focusPos);
		if(data.length > 0){
			var titles = jQuery("#span_"+focusPos).attr("remarks");
			if(titles != ""){// && (data.isSubhead == true || data.isSubhead == "true")
				$("title_" + focusPos).style.display = "block";	
			}else{
				$("title_" + focusPos).style.display = "none";		
			}
		}
	}
	var imgWidth = parseInt(imgObj.getAttribute("wh").split("*")[0])+imgPostionSize;
	jQuery("#title_"+focusPos).css({"width":imgWidth});
	var titles = jQuery("#span_"+focusPos).attr("remarks");
	clearMarqueeText("span_"+focusPos,titles, 15);
	showMarqueeText("span_"+focusPos,titles, 15);
}

function lostFocusStyle(){
	var titles=jQuery("#span_"+focusPos).attr("remarks");
	clearMarqueeText("span_"+focusPos,titles,15);
	var imgObj = $("img_"+focusPos);
	if(imgObj == null)return;
	var loopObj = getLoopObj(focusPos);
	if(loopObj != null){
		var data = getDataJson(focusPos);
		if(data.length>0){
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
					if($("div_" + data.operateType) != null){
						var width = parseInt($("div_" + data.operateType).style.width);
						var height = parseInt($("div_" + data.operateType).style.height);
						var new_width = (width - imgPostionSize) + "px"
						var new_height = (height - imgPostionSize) + "px";
						jQuery("#div_"+ data.operateType).css({"width": new_width,"height": new_height});
					}
				}	
			}else if(data.serviceType == "app"){
				var width = parseInt($("appInstall" + focusPos).width);
			    var height = parseInt($("appInstall" +focusPos).height);
			    var new_width = (width - imgPostionSize) + "px"
			    var new_height = (height - imgPostionSize) + "px";
			    jQuery("#appInstall"+ focusPos).css({"width": new_width,"height": new_height});	
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
	var divLeft = jQuery("#div_"+focusPos).css("left")=="auto"?0:jQuery("#div_"+focusPos).css("left");
	var divTop = jQuery("#div_"+focusPos).css("top")=="auto"?0:jQuery("#div_"+focusPos).css("top");
	jQuery("#div_"+focusPos).css({"width":imgWidth+"px","height":imgHeight+"px","display":"block","bottom":"0px"});
	jQuery("#div_"+focusPos).find("canvas").css("width",imgWidth+"px");
	jQuery("#div_"+focusPos).css({"top":""+(parseInt(divTop)+imgPostionSize/2)+"px","left":""+(parseInt(divLeft)+imgPostionSize/2)+"px","z-index":9});
	jQuery("#title_"+focusPos).css({"width":imgWidth});
	
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

//设置文本移动控制
function showMarqueeText(id,title,size){
	if($(id) != null || $(id) != undefined){
		//parseInt(document.getElementById(id).parentNode.style.width);
		var parentNodeObj =  document.getElementById(id).parentNode;
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
		var parentNodeObj =  document.getElementById(id).parentNode;
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

//控制最近跟新移动状态
function evenNewest(type,obj,width){
	var names=jQuery(obj).attr("name");
	var $obj=jQuery("#div_"+names);
	var $objH=70;//原始高度
	if(names=="newest"){
		if(type=="over"){//移入
			$obj.css({"height":($objH+14)+"px","width":width});
		}else{
			$obj.css({"height":($objH)+"px","width":width});
		}
	}
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
		var hrClass = tvsee.eventFrame.globalCache.homeRecomendClass;
		var menuPos = _menuPos;
		for(var i=0;i<hrClass.length;i++){
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
					tvsee.eventFrame.globalCache.homeRecomendClass[i].loopObjs = loopObjs;
				}
			}
		}
		if(count == 0){
			tvsee.eventFrame.globalCache.homeRecomendClass.push({
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
function setCurPagePlayWinPos(index){
	var hrClass = tvsee.eventFrame.globalCache.homeRecomendClass;
	var menuPos = tvsee.pageWidgets.getByName("widgetMenu").menuSelectPos;
	for(var i=0;i<hrClass.length;i++){
		if(hrClass[i].menuPos == menuPos){
			tvsee.eventFrame.globalCache.homeRecomendClass[i].videoPos=index;
			break;
		}
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
	var widgetMenuObj = tvsee.pageWidgets.getByName("widgetMenu");
	widgetMenuObj.historyChannelList = [];
	isFullScreen = false;
	var hrClass = tvsee.eventFrame.globalCache.homeRecomendClass;
	var menuPos = widgetMenuObj.menuSelectPos;
	for(var i = 0;i < hrClass.length;i++){
		if(hrClass[i].menuPos == menuPos){
			var loopObjArr = hrClass[i].loopObjs;
			for(var j = 0;j < loopObjArr.length;j++){
				loopObjArr[j].startLoop();
			}
		}
	}
	getChannelHistoryData();
	if(widgetMenuObj.globalParams.isParentFocus == false){
		widgetMenuObj.frames[menus[menuPos - 1].iframeName].showImgTitle();
	}
}

function getChannelHistoryData(){
		if(tvsee.pageWidgets.getByName("widgetMenu").historyChannelList.length > 0){
			var value = tvsee.eventFrame.globalParams.globalCache.get("lastWatchTvChannel_CACHE");
			if(value == false){
				var url = getAjaxUrl("getLastWatchTvChannel");	
				doAjax(url, null,function(data, status) {
					if (status == "success") {
						tvsee.eventFrame.globalParams.globalCache.put("lastWatchTvChannel_CACHE", data.lastWatchTvChannel);
						showChannelHistoryData(data.lastWatchTvChannel);
					}
				});
			}else{
				showChannelHistoryData(value);	
			}	
		}
}

function showChannelHistoryData(_data){
	var hisCList = tvsee.pageWidgets.getByName("widgetMenu").historyChannelList;
	var len = hisCList.length;
	if(len > _data.length){
		len = _data.length;
	}
	for(var i = 0; i < len; i++){
		hisCList[i].setAttribute("src", getChannelLogoPicUrl(_data[i].picUrl));
		hisCList[i].setAttribute("channelname", _data[i].channelName);
		hisCList[i].setAttribute("channelId", _data[i].channelId);
		hisCList[i].setAttribute("tvId", _data[i].tvId);
		if($("span_"+(i+1)) != null){
			$("span_"+(i+1)).setAttribute("remarks", _data[i].channelName);
			$("span_"+(i+1)).innerHTML = subStr(_data[i].channelName, $("title_"+(i+1)).getAttribute("fontLength"), "...");
		}
	}
}

function getLiveOrWatchMenuPos(){
	var index = -1;
	for(var i = 0; i < menus.length; i++){
		if(SPEC_CATALOG_NAME.HOME_MENU_NAME == menus[i].name){
			index = i + 1;
			break;	
		}
	}
	return index;
}
//获取当前轮循对象
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
			if(videoPos != 0){
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

function playEndLunBoPlay(_data){
	var lunBoProgram = getLunBoProgramByTime(TvseeDate.getTime()+600000,_data);
	if(lunBoProgram != null ){//还有播放的节目
		var lunBoUrl = REDIRECT_LUNBO_URL + lunBoProgram.guid;
		if(lunBoPlayUrl != lunBoUrl){
			$("span_1").innerText = "正在播放:" + lunBoProgram.moviename;
			lunBoPlayUrl = lunBoUrl;//播放url
			var seekTime = TvseeDate.getTime()-new Date(Date.parse(lunBoProgram.beginTime.replace(/-/g, "/"))).getTime();
			if(seekTime > 0){//判断是否需要seek
				winPlay(lunBoPlayUrl, true, true,seekTime);
			}else{
				winPlay(lunBoPlayUrl, true, true,0);
			}	
		}else{
			if($("title_1") != null){
				$("title_1").style.display = "none";
			}
			lunBoPlayUrl = "";
		}			
	}else{
		if($("title_1") != null){
			$("title_1").style.display = "none";
		}
		lunBoPlayUrl = "";
	}	
}