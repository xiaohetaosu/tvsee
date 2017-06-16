var imgUrl="http://60.29.227.29/images/";

//var modulePlex="public";//prepare：预发布,public:已发布
var setModules=function(pageId){
	//return "http://"+location.hostname+":8080/backStage/epg/public/"+pageId+".xml";
	//console.log("http://"+location.hostname+":8080/backStage_wxcm/"+pageId+".xml");
	if(modulePlex == "public"){
		return PUBLIC_PATH+pageId+".xml";
	}else{
		return PREPARE_PATH+pageId+".xml";
	}
}
/*
初始化数据
*/
this.variable={};
function setDatasVariable(){
		var pageId="module_1_"+modulePlex,
			url=setModules(pageId);
		variable.modulePlan_1=tvsee.eventFrame.globalParams.globalCache.get("module_1_CACHE");
		if(!variable.modulePlan_1){
			loadModuleXML(pageId,url,function(data,type){
				if(type){
					variable.modulePlan_1=data.content;
					tvsee.eventFrame.globalParams.globalCache.put("module_1_CACHE",variable.modulePlan_1);
				}else{
					variable.modulePlan_1="";
				}
			});
		}
		var pageId="module_2_"+modulePlex,
			url=setModules(pageId);
		variable.modulePlan_2=tvsee.eventFrame.globalParams.globalCache.get("module_2_CACHE");
		if(!variable.modulePlan_2){
			loadModuleXML(pageId,url,function(data,type){
				if(type){
					variable.modulePlan_2=data.content;
					tvsee.eventFrame.globalParams.globalCache.put("module_2_CACHE",variable.modulePlan_2);
				}else{
					variable.modulePlan_2="";
				}
			});
		}

		var pageId="module_3_"+modulePlex,
			url=setModules(pageId);
		variable.modulePlan_3=tvsee.eventFrame.globalParams.globalCache.get("module_3s_CACHE");
		if(!variable.modulePlan_3){
			loadModuleXML(pageId,url,function(data,type){
				if(type){
					//alert(data);
					variable.modulePlan_3=data.content;
					tvsee.eventFrame.globalParams.globalCache.put("module_3_CACHE",variable.modulePlan_3);
				}else{
					variable.modulePlan_3="";
				}
			});
		}
		var pageId="module_4_"+modulePlex,
			url=setModules(pageId);
		variable.modulePlan_4=tvsee.eventFrame.globalParams.globalCache.get("module_4_CACHE");
		if(!variable.modulePlan_4){
			loadModuleXML(pageId,url,function(data,type){
				if(type){
					//alert(data);
					variable.modulePlan_4=data.content;
					tvsee.eventFrame.globalParams.globalCache.put("module_4_CACHE",variable.modulePlan_4);
				}else{
					variable.modulePlan_4="";
				}
			});
		}

		var pageId="hbjx_module_"+modulePlex,
			url=setModules(pageId);
		variable.modulePlan_hbjx=tvsee.eventFrame.globalParams.globalCache.get("module_hbjx_CACHE");
		if(!variable.modulePlan_hbjx){
			loadModuleXML(pageId,url,function(data,type){
				if(type){
					//alert(data);
					variable.modulePlan_hbjx=data.content;
					tvsee.eventFrame.globalParams.globalCache.put("module_hbjx_CACHE",variable.modulePlan_hbjx);
				}else{
					variable.modulePlan_hbjx="";
				}
			});
		}
		
		var pageId="module_ztcs_"+modulePlex,
			url=setModules(pageId);
		variable.modulePlan_ztcs=tvsee.eventFrame.globalParams.globalCache.get("module_ztcs_CACHE");
		if(!variable.modulePlan_ztcs){
			loadModuleXML(pageId,url,function(data,type){
				if(type){
					//alert(data);
					variable.modulePlan_ztcs=data.content;
					tvsee.eventFrame.globalParams.globalCache.put("module_ztcs_CACHE",variable.modulePlan_ztcs);
				}else{
					variable.modulePlan_ztcs="";
				}
			});
		}
		//预加载首页最近跟新信息
		//loadNewOnlineProgramsFun(function(data){
		//	console.log("预加载最近更新");
		//});
		//homeRefreshTask();
}

/*****************首页最近跟新信息**********************/
function loadNewOnlineProgramsFun(callback){
	var url = parent.getAjaxUrl("getNewOnlinePrograms",20);
	tvsee.debug("最近更新信息"+url);
	doAjax(url, null,function(data, status) {
		if (status == "success") {
			if(data.programs!=null){
				tvsee.eventFrame.globalParams.globalCache.put("newOnlinePrograms",data.programs);
				callback(data.programs);
			};
		}
	})
}

/*首页内容定时更新*/
var homeTimeOut = -1;
function homeRefreshTask(){
	var times = 3600;
	if(typeof(homeTimes) != "undefined"){
		times = homeTimes;
	}
	homeTimeOut = setInterval(function(){
		var cacheVersion = tvsee.eventFrame.globalCache.versionArr;
		for(var i=0;i<cacheVersion.length;i++){
			var url = setModules(cacheVersion[i].module);
			var pageId = cacheVersion[i].module;
			loadModuleXML(pageId,url,function(data,type){
				if(type==true && (data.version != cacheVersion[i].version)){
					for(var j=0;j<menus.length;j++){
						if(data.version == menus[j].id){
							tvsee.eventFrame.globalParams.globalCache.put(menus[j]+"_CACHE",data.content);
							parent.window.frames["child_iframe_" + (j+1)].document.getElementById("content").innerHTML=data.content;
							parent.getFocus("meun_"+_vers[1]);//数据加载完，设置焦点
							var pagePos = tvsee.pageWidgets.getByName("widgetMenu").menuSelectPos;
							var hrClass = tvsee.eventFrame.globalCache.homeRecomendClass;
							var tmpHrClass = [];
							for(var ii=0;ii<hrClass.length;ii++){
								if(hrClass[ii].menuPos != pagePos){
									tmpHrClass.push(hrClass[ii]);
								}else{
									var loopObjArr = hrClass[ii].loopObjs;
									for(var jj=0;jj<loopObjArr.length;jj++){
										loopObjArr[jj].win.clearInterval(loopObjArr[jj].absTimeOut_1);
										loopObjArr[jj].win.clearTimeout(loopObjArr[jj].absTimeOut_2);
										loopObjArr[jj].win.clearTimeout(loopObjArr[jj].oppTimeOut);
									}
								}
							}
							tvsee.eventFrame.globalCache.homeRecomendClass = tmpHrClass;
							var iframe_child = parent.window.frames["child_iframe_" + (j+1)];
							//initPageDiv(iframe_child);
						}
					}
				}
			});
		}
	},times*1000);
}
function initPageDiv(iframe_child){
	var maxSize=15;//滚动最大字数控制
	var imgs = iframe_child.document.getElementsByTagName("img");
	for(var i=0;i<imgs.length;i++){
		if((imgs[i].getAttribute("id")).indexOf("img_") != -1){
			imgs[i].setAttribute("leftmove","#moves('left_"+imgs[i].getAttribute("left")+"')");
			imgs[i].setAttribute("rightmove","#moves('right_"+imgs[i].getAttribute("right")+"')");
			imgs[i].setAttribute("upmove","#moves('up_"+imgs[i].getAttribute("up")+"')");
			imgs[i].setAttribute("downmove","#moves('down_"+imgs[i].getAttribute("down")+"')");
			var index=parseInt(imgs[i].getAttribute("id").split("_")[1]);
			var title_0 = imgs[i].getAttribute("recommendtitle");
			var title_1 = subStr(title_0, maxSize, "...");
			var titleBol=imgs[i].getAttribute("titleBol");
			var display = "block";
			if(titleBol=="false")display = "none";
			jQuery("#div_"+index).append("<div id=title_"+index+" class='tiltelCl titles_show' style='width:"+imgs[i].width+"px;display:"+display+";' h='30'>"+"<span style='color:white' id=span_"+index+" remarks='"+title_0+"'>"+title_1+"</span></div>");	
			var obj = new setLoopClass({
				menuPos : parent.fatherMeunIndex,
				index : index,
				ifram: window
			});
			obj.addLoopObj(obj);
			obj.startLoop();
		}
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
/*加载首页模板*/
function loadModuleXML(pageId,url,callback){
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
				if(id==pageId){
					if(jQuery(xml).find("VERSION").length==0){
						return callback(data,true);
					}else{
						jQuery(xml).find("VERSION").each(function(){
							data.code = jQuery(this).attr("code");
							cacheHomeVersion(pageId,data.code);
							callback(data,true);
						});
					}
				}
			});
		}
	});
}