/*
初始化功能页
*/
function intoFun(){
	this.dramaesArray=document.getElementsByName("dramaes");
	this.histroyArray=document.getElementsByName("histroy");
	this.searchArray=document.getElementsByName("search");
	this.collectArray=document.getElementsByName("collect");
	this.installArray=document.getElementsByName("install");
	this.interactArray=document.getElementsByName("interact");
	if(dramaesArray!=null){
		for(var i=0;i<dramaesArray.length;i++){
			dramaesArray[i].setAttribute("action","#functionFun('dramaes')");
			//var id_dramaes=dramaes.parentNode.getAttribute("id");
		}
		this.dramaesSrc = dramaesArray[0].getAttribute("src");
	}
	if(histroyArray!=null){
		for(var i=0;i<histroyArray.length;i++){
			histroyArray[i].setAttribute("action","#functionFun('histroy')");
		}
	}
	if(searchArray!=null){
		for(var i=0;i<searchArray.length;i++){
			searchArray[i].setAttribute("action","#functionFun('search')");
		}
	}
	if(collectArray!=null){
		for(var i=0;i<collectArray.length;i++){
			collectArray[i].setAttribute("action","#functionFun('collect')");
		}
		this.collectSrc = collectArray[0].getAttribute("src");
	}
	if(installArray!=null){
		for(var i=0;i<installArray.length;i++){
			installArray[i].setAttribute("action","#functionFun('install')");
		}
	}
	if(interactArray!=null){
		for(var i=0;i<interactArray.length;i++){
			interactArray[i].setAttribute("action","#functionFun('interact')");
		}
	}
	this.loadFunction();
	this.eventHandlers();
	
}

/*
加载功能数据信息
*/
function loadFunction(){
	this.favorite = tvsee.eventFrame.globalParams.globalCache.get("favorite_CACHE");
	this.addTv = tvsee.eventFrame.globalParams.globalCache.get("addTv_CACHE");
	
	if(favorite)intoCollect();
	if(addTv)intoDramaes();
	//this.setTwoDimensionCode();
	this.cntvid=globalVar.get("ca_stbid");
	intoInstall();
}




function updateCache(){
	this.favorite = tvsee.eventFrame.globalParams.globalCache.get("favorite_CACHE");
	this.addTv = tvsee.eventFrame.globalParams.globalCache.get("addTv_CACHE");
	this.dramaesArray=document.getElementsByName("dramaes");
	this.collectArray=document.getElementsByName("collect");
	this.installArray=document.getElementsByName("install");
	if(dramaesArray.length!=0){
		if(addTv!=false && addTv.length != 0){
			dramaesArray[0].setAttribute("src",PICURL+addTv[0].picUrl);
		}else{
			dramaesArray[0].setAttribute("src", this.dramaesSrc);	
		}
		if(addTv!=false){
			$("dramaeCount").innerHTML=addTv.length;
		}
	}
	if(collectArray.length!=0){
		if(favorite!=false && favorite.length != 0){
			collectArray[0].setAttribute("src",PICURL+favorite[0].picUrl);
		}else{
			collectArray[0].setAttribute("src", this.collectSrc);	
		}
		if(favorite!=false){
			$("collectCount").innerHTML=favorite.length;
		}
	}
	if(installArray.length!=0){
		if(IS_ADD_MULTI_SCREEN == true){
			this.setTwoDimensionCode("imgInstall",5);
		}
	}
}

function selects(id){
	var thenName=$(id).getAttribute("name");
	if(jQuery("#div_"+thenName).attr("wh")!=undefined){
		var div_width=parseInt(jQuery("#div_"+thenName).attr("wh").split("*")[0]);
		var div_height=parseInt(jQuery("#div_"+thenName).attr("wh").split("*")[1]);
		var new_width=div_width+14+"px",new_height=div_height+14+"px";
		switch (thenName) {
			case "dramaes":
				jQuery("#div_"+thenName).css({"width":new_width,"height":new_height});
				break
			case "histroy":
				break;
			case "search":
				break;
			case "collect":
				jQuery("#div_"+thenName).css({"width":new_width,"height":new_height});
				break;
			case "install":
				break;
			case "interact":
				break;
		}
	}
}

/*
监听控制
*/
function eventHandlers(){
	addEventHandler(this,"keydown",function(){
		if(gCurObjId==""||lastId=="")return;
		var thenName=$(gCurObjId).getAttribute("name");
		var lastName=$(lastId).getAttribute("name");
		var div_width=0,div_height=0;
		var new_width="",new_height="";
		{//移入
			if(jQuery("#div_"+thenName).attr("wh")!=undefined){
				 div_width=parseInt(jQuery("#div_"+thenName).attr("wh").split("*")[0]);
				 div_height=parseInt(jQuery("#div_"+thenName).attr("wh").split("*")[1]);
			}
			new_width=div_width+14+"px";
			new_height=div_height+14+"px";
			jQuery("#div_"+thenName).css({"width":new_width,"height":new_height});
		}
		{//移出
			if(jQuery("#div_"+lastName).attr("wh")!=undefined){
				 div_width=parseInt(jQuery("#div_"+lastName).attr("wh").split("*")[0]);
				 div_height=parseInt(jQuery("#div_"+lastName).attr("wh").split("*")[1]);
			}
			new_width=div_width+"px";
			new_height=div_height+"px";
			jQuery("#div_"+lastName).css({"width":new_width,"height":new_height});
		}
	});
}
//添加解决android上面不能监听按键事件 
function keyDownOverOrOut(_typeName){
	if(gCurObjId==""||lastId=="")return;
	var thenName=$(gCurObjId).getAttribute("name");
	var lastName=$(lastId).getAttribute("name");
	var div_width=0,div_height=0;
	var new_width="",new_height="";
	if(_typeName == "over"){//移入
		if(jQuery("#div_"+thenName).attr("wh")!=undefined){
			div_width=parseInt(jQuery("#div_"+thenName).attr("wh").split("*")[0]);
			div_height=parseInt(jQuery("#div_"+thenName).attr("wh").split("*")[1]);
		}
		new_width=div_width+14+"px";
		new_height=div_height+14+"px";
		jQuery("#div_"+thenName).css({"width":new_width,"height":new_height});
	}else if(_typeName == "out"){//移出
		if(jQuery("#div_"+lastName).attr("wh")!=undefined){
			div_width=parseInt(jQuery("#div_"+lastName).attr("wh").split("*")[0]);
			div_height=parseInt(jQuery("#div_"+lastName).attr("wh").split("*")[1]);
		}
		new_width=div_width+"px";
		new_height=div_height+"px";
		jQuery("#div_"+lastName).css({"width":new_width,"height":new_height});
	}
}

function intoDramaes(){
	if(this.addTv.length != 0){
		dramaes.setAttribute("src", PICURL + addTv[0].picUrl);
	}else{
		dramaes.setAttribute("src", this.dramaesSrc);	
	}
	var w=dramaes.getAttribute("wh").split("*")[0],
		h=dramaes.getAttribute("wh").split("*")[1];
	dramaes.width=parseInt(w.split("px")[0]);
	dramaes.height=parseInt(h.split("px")[0]);
	var id_dramaes=dramaes.parentNode.getAttribute("id");
	jQuery("#"+id_dramaes).find(".div_fonts").css("display","none");
	jQuery("#"+id_dramaes).append("<div id ='div_dramaes' class='div_img' style='top:326px;width:"+dramaes.width+"px;height:100px;'>"+
				"<img src='images/home/fgx.png' style='position:absolute;z-index:10;border:solid 0;top:20px;left:120px'/>"+
				"<span style='margin-left:140px;line-height:80px;width:110px;'>我的追剧"+
					"<span id='dramaeCount' style='color:" + FOCUS_STYLE.COLOR + "'>"+addTv.length+"</span>"+
				"</span></div>"+
				"<img src='images/home/dramaes.png' style='position:absolute;z-index:10;border:solid 0;top:300px;left:10px'/>");
	var $dramaes=jQuery("#div_dramaes");
	$dramaes.attr("wh",$dramaes.css("width")+"*"+$dramaes.css("height"));
}

function intoCollect(){
	if(this.favorite.length != 0){
		collect.setAttribute("src",PICURL+favorite[0].picUrl);
	}else{
		collect.setAttribute("src",this.collectSrc);
	}
	var w=collect.getAttribute("wh").split("*")[0],
		h=collect.getAttribute("wh").split("*")[1];
	collect.width=parseInt(w.split("px")[0]);
	collect.height=parseInt(h.split("px")[0]);
	var id_collect=collect.parentNode.getAttribute("id");
	jQuery("#"+id_collect).find(".div_fonts").css("display","none");
	jQuery("#"+id_collect).append("<div id ='div_collect' class='div_img' style='top:326px;width:"+collect.width+"px;height:100px'>"+
				"<img src='images/home/fgx.png' style='position:absolute;z-index:10;border:solid 0;top:20px;left:120px'/>"+
				"<span style='margin-left:140px;line-height:80px;width:110px;'>我的收藏"+
					"<span id='collectCount' style='color: " + FOCUS_STYLE.COLOR + "'>"+favorite.length+"</span>"+
				"</span></div>"+
				"<img src='images/home/collect.png' style='position:absolute;z-index:10;border:solid 0;top:300px;left:10px'/>");
	var $collect=jQuery("#div_collect");
	$collect.attr("wh",$collect.css("width")+"*"+$collect.css("height"));
}

function intoInstall(){
	if(IS_ADD_MULTI_SCREEN == true){
		var id_install=install.parentNode.getAttribute("id");
		var imgSize=5;
		jQuery("#"+id_install).append("<img id='imgInstall' src='" + VODEPG_SERVER + "/twoDimensionCodeAction.action?ipAdd=127.0.0.1&imgSize="+imgSize+"&cntvid="+cntvid+"&code=100001' style='position:absolute;z-index:100;border:solid 0;top:20px;left:90px'/>");
	}
}



function functionFun(name){
	switch (name) {
		case "dramaes":
			tvsee.pageWidgets.getByName("widgetMenu").hideWin();
			gotoPageUrl("addTVList.html");
		break;
		case "histroy":
			tvsee.pageWidgets.getByName("widgetMenu").hideWin();
			gotoPageUrl("recordList.html");
		break;
		case "search": 
			tvsee.pageWidgets.getByName("widgetMenu").hideWin();
			gotoPageUrl("search.html");
		break;
		case "collect":
			tvsee.pageWidgets.getByName("widgetMenu").hideWin();
			gotoPageUrl("favoriteList.html");
		break;
		case "install":
			if(IS_ADD_MULTI_SCREEN == true){
				tvsee.pageWidgets.getByName("widgetMenu").hideWin();
				var widgetTriScreen = tvsee.pageWidgets.getByName("widgetTriScreen");	
				widgetTriScreen.show();
			}
		break;
		case "interact":
			if(typeof(mediaPlayer.playerType)!="undefined"){
				if(mediaPlayer.playerType == "ANDROID"){
					android_userAgent.startApp("com.android.settings","com.android.settings.Settings");
				}
			}
		break;
	}
}
