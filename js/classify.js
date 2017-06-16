/*分类鉴赏*/
function intoClassify(){
	this.detailedArray=document.getElementsByName("detailed");
	this.childrenArray=document.getElementsByName("children");
	this.documentaryArray=document.getElementsByName("documentary");
	this.recreationArray=document.getElementsByName("recreation");
	this.newsArray=document.getElementsByName("news");
	this.musicArray=document.getElementsByName("music");
	this.sportsdArray=document.getElementsByName("sports");
	if(detailedArray!=null){
		for(var i=0;i<detailedArray.length;i++){
			detailedArray[i].setAttribute("action","#functionClassify('detailed','"+detailedArray[i].getAttribute("pid")+"')");
		}
	}
	if(childrenArray!=null){
		for(var i=0;i<childrenArray.length;i++){
			childrenArray[i].setAttribute("action","#functionClassify('children')");
		}
	}
	if(documentaryArray!=null){
		for(var i=0;i<documentaryArray.length;i++){
			documentaryArray[i].setAttribute("action","#functionClassify('documentary')");
		}
	}
	if(recreationArray!=null){
		for(var i=0;i<recreationArray.length;i++){
			recreationArray[i].setAttribute("action","#functionClassify('recreation')");
		}
	}
	if(newsArray!=null){
		for(var i=0;i<newsArray.length;i++){
			newsArray[i].setAttribute("action","#functionClassify('news')");
		}
	}
	if(musicArray!=null){
		for(var i=0;i<musicArray.length;i++){
			musicArray[i].setAttribute("action","#functionClassify('music')");
		}
	}
	if(sportsdArray!=null){
		for(var i=0;i<sportsdArray.length;i++){
			sportsdArray[i].setAttribute("action","#functionClassify('sports')");
		}
	}
}
function selects(id){}
function functionClassify(name,pid){
	var url="",cateId="";
	switch (name) {
		case "children":
				this.LoadWidgetVodList(6,"少儿");
				break;
		case "documentary":
				this.LoadWidgetVodList(9,"纪录片");
				break;
		case "recreation":
				this.LoadWidgetVodList(5,"娱乐");
				break;
		case "news":
				this.LoadWidgetVodList(2,"新闻");
				break;
		case "music":
				this.LoadWidgetVodList(1002,"音乐");
				break;
		case "sports":
				this.LoadWidgetVodList(7,"体育");
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
	//tvsee.mainFrame.location.href = "about:blank";
}