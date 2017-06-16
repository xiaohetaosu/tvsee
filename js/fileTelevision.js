/*
初始影视
*/
function intoFileTelevision(){
	this.detailedArray=document.getElementsByName("detailed");
	this.searchArray=document.getElementsByName("search");
	this.movieArray=document.getElementsByName("movie");
	this.teleplayArray=document.getElementsByName("teleplay");
	this.newestArray=document.getElementsByName("newest");
	if(detailedArray!=null){
		for(var i=0;i<detailedArray.length;i++){
			detailedArray[i].setAttribute("action","#functionFileTelevision('detailed','"+detailedArray[i].getAttribute("pid")+"')");
		}
	}
	if(searchArray!=null){
		for(var i=0;i<searchArray.length;i++){
			searchArray[i].setAttribute("action","#functionFileTelevision('search')");
		}
	}
	if(movieArray!=null){
		for(var i=0;i<movieArray.length;i++){
			movieArray[i].setAttribute("action","#functionFileTelevision('movie')");
		}
	}
	if(teleplayArray!=null){
		for(var i=0;i<teleplayArray.length;i++){
			teleplayArray[i].setAttribute("action","#functionFileTelevision('teleplay')");
		}
	}
	if(newestArray!=null){
		var newOnlinePrograms=getNewestInfo();
		for(var i=0;i<newestArray.length;i++){
			newestArray[i].setAttribute("src",PICURL+newOnlinePrograms[i].picurl);
			newestArray[i].setAttribute("action","#functionFileTelevision('newest',"+newOnlinePrograms[i].pid+")");
			intoNewest(newestArray[i]);
		}
		
	}
	//this.eventHandlers();
	/*
	search.setAttribute("action","#functionFileTelevision('search')");
	movie.setAttribute("action","#functionFileTelevision('movie')");
	teleplay.setAttribute("action","#functionFileTelevision('teleplay')");
	//detailed.setAttribute("action","#functionFileTelevision('detailed')");
	newest.setAttribute("action","#functionFileTelevision('newest')");
	*/
	/*
	var id_newest=newest.parentNode.getAttribute("id");
	var id_search=search.parentNode.getAttribute("id");
	var id_movie=movie.parentNode.getAttribute("id");
	var id_teleplay=teleplay.parentNode.getAttribute("id");
	*/
	//jQuery("#"+id_newest).append("<div class='div_fonts' style='top:250px;left:100px'></div>");/*最近跟新*/
	//this.loadFileTelevision();
}

/*
加载功能数据信息
*/
function loadFileTelevision(){
	if(variable.MenuObj)intoMenu();
}

/*
初始化菜单
*/
function intoMenu(){
	Each(variable.menus,function(data,i){
		if(data.title=="电影"){
			movie.setAttribute("cateId",data.id);
		}
		if(data.title=="电视剧"){
			teleplay.setAttribute("cateId",data.id);
		}
	})
}

function selects(id){}

/*
监听控制
*/
function eventHandlers(){
	addEventHandler(this,"keydown",function(){

	});
}

function functionFileTelevision(name,pid){
	var url="",cateId="";
	switch (name) {
		case "newest":
				homeGoToDetailPage(pid);
				break;
		case "search":
				tvsee.pageWidgets.getByName("widgetMenu").hideWin();
				gotoPageUrl("search.html");
				break;
		case "movie":
				this.LoadWidgetVodList(10,"电影");
				break;
		case "teleplay":
				this.LoadWidgetVodList(1,"电视剧");
				break;
		case "detailed":
				homeGoToDetailPage(pid);
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
	tvsee.mainFrame.location.href = "about:blank";
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