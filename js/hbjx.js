/*初始影视*/
function intoModulePlan(){
	this.detailedArray=document.getElementsByName("detailed");//详情页
	this.columnArray=document.getElementsByName("column");//栏目
	this.urlArray=document.getElementsByName("URL");//自定义链接
	this.searchArray=document.getElementsByName("search");//查询
	this.newestArray=document.getElementsByName("newest");//最近更新
	this.playArray=document.getElementsByName("play");//更新

	if(detailedArray!=null){
		for(var i=0;i<detailedArray.length;i++){
			detailedArray[i].setAttribute("action","#functionModulePlan('detailed','"+detailedArray[i].getAttribute("pid")+"')");
		}
	}
	if(columnArray!=null){
		for(var i=0;i<columnArray.length;i++){
			columnArray[i].setAttribute("action","#functionModulePlan('column',"+i+")");
		}
	}
	if(searchArray!=null){
		for(var i=0;i<searchArray.length;i++){
			searchArray[i].setAttribute("action","#functionModulePlan('search')");
		}
	}
	if(urlArray!=null){
		for(var i=0;i<urlArray.length;i++){
			urlArray[i].setAttribute("action","#functionModulePlan('URL',"+i+")");
		}
	}
	if(newestArray!=null){
		var newOnlinePrograms=getNewestInfo();
		for(var i=0;i<newestArray.length;i++){
			newestArray[i].setAttribute("src",PICURL+newOnlinePrograms[i].picurl);
			newestArray[i].setAttribute("action","#functionModulePlan('newest',"+newOnlinePrograms[i].pid+")");
			intoNewest(newestArray[i]);
		}
	}
	if(playArray!=null){
		for(var i=0;i<playArray.length;i++){
			playArray[i].setAttribute("action","#functionModulePlan('play',"+i+")");
		}
		
	}
	
}
function selects(id){}
function functionModulePlan(name,pid){
	var url="",cateId="";
	switch (name) {
		case "column":
				var columnId=columnArray[pid].getAttribute("columnId");//栏目Id
			    var columnName=columnArray[pid].getAttribute("columnName");//栏目名称
				this.LoadWidgetVodList(columnId,columnName);
				break;
		case "search":
				tvsee.pageWidgets.getByName("widgetMenu").hideWin();
				gotoPageUrl("search.html");
				break;
		case "detailed":
				homeGoToDetailPage(pid);
				break;
		case "newest":
				homeGoToDetailPage(pid);
				break;
		case "URL":
				var url=urlArray[pid].getAttribute("url");//链接地址
				window.open(url);
				break;
		case "play":
				alert("暂时未开放");
				break;
	}
}
/*加载列表页*/
function LoadWidgetVodList(id,name){
	tvsee.pageWidgets.getByName("widgetMenu").hideWin();
	
	var widgetVodList = tvsee.pageWidgets.getByName("widgetVodList");
	if(widgetVodList != null){
		widgetVodList.show();
		widgetVodList.initMenu(id,name);
	}
}

// 获得最近更新信息
function getNewestInfo(){
	 var newOnlinePrograms=tvsee.eventFrame.globalParams.globalCache.get("newOnlinePrograms");
	//目前取最新的一条（以后可能获取多条设置轮播控制）
	return newOnlinePrograms;
}


function intoNewest(obj){
	var w=obj.getAttribute("wh").split("*")[0],
		h=obj.getAttribute("wh").split("*")[1];
	obj.width=parseInt(w.split("px")[0]);
	obj.height=parseInt(h.split("px")[0]);
	var newestH=70;
	var id_obj=obj.parentNode.getAttribute("id");
	jQuery("#"+id_obj).find(".div_fonts").css("display","none");
	jQuery("#"+id_obj).append("<div id ='div_newest' class='div_img' style='top:"+(obj.height-newestH+1)+"px;width:"+obj.width+"px;height:"+newestH+"px'>"+
				"<img src='images/home/fgx.png' style='position:absolute;z-index:10;border:solid 0;top:20px;left:70px'/>"+
				"<span style='margin-left:90px;line-height:80px;width:110px;'>最近更新</span></div>"+
				"<img src='images/home/newest.png' style='position:absolute;z-index:10;border:solid 0;top:"+(obj.height-newestH-30)+"px;left:10px'/>");
	var $newest=jQuery("div_newest");
	$newest.attr("wh",$newest.css("width")+"*"+$newest.css("height"));
}