
/*初始直播回看*/
function intoDirectLookBack(){
	this.getNowDate();
	this.directArray=document.getElementsByName("direct");//直播
	this.channelArray=document.getElementsByName("channel");//频道
	this.lookBackArray=document.getElementsByName("lookBack");//回看
	this.channelListArray=document.getElementsByName("channelList");//频道列表
	this.setDirectAttr=function(name,obj){
		var markIndex=parseInt(obj.getAttribute("id").split("_")[1]);//定位焦点位置
		var channelId=obj.getAttribute("channelId"), //频道Id 
			tvId=obj.getAttribute("tvId"),//电视台Id
			playDate=obj.getAttribute("playDate"),
			guid=obj.getAttribute("guid");//节目guid
		var thenVal="";
		if(name=="direct"||name=="lookBack"){
			getDirectInfo(markIndex,obj);
			thenVal=name=="direct"?"正在直播":GetDateStr(playDate);
			jQuery(obj).parent().append("<div style='position:absolute;top:10px;height:35px;"+
					"font-weight:bold;font-size:15px;line-height:20px;left:10px;'>"+
									"<span style='color:white'>"+thenVal+"</span></div>");	
		}
		if(name=="channel"||name=="channelList"){//(name,channelId,tvId,data,guid)
			obj.setAttribute("action","#functionDirectLookBack('"+markIndex+"','"+name+"','"+channelId+"','"+tvId+"','"+playDate+"','"+guid+"')");
		}

	}
	if(directArray!=null){
		for(var i=0;i<directArray.length;i++){
			setDirectAttr("direct",directArray[i]);
		}
		
	}
	if(channelArray!=null){
		for(var i=0;i<channelArray.length;i++){
			setDirectAttr("channel",channelArray[i]);
		}
	}
	if(lookBackArray!=null){
		for(var i=0;i<lookBackArray.length;i++){
			setDirectAttr("lookBack",lookBackArray[i]);
		}
	}
	if(channelListArray!=null){
		for(var i=0;i<channelListArray.length;i++){
			setDirectAttr("channelList",channelListArray[i]);
		}
	}
	this.loadDirectLookBack();
	/*
	var meunClikStatue=parent.meunClikStatue;
	if(meunClikStatue!=undefined){
		parent.meunMove("down_"+meunClikStatue);
	}
	*/
	
}
/*加载功能数据信息*/
function loadDirectLookBack(){
	var lastWatchTvChannel=tvsee.eventFrame.globalParams.globalCache.get("lastWatchTvChannel_CACHE");
	if(lastWatchTvChannel){
		intoTvWatchHistory(lastWatchTvChannel);
	}else{
		loadLastWatchTvChannel(1,function(data){
			intoTvWatchHistory(data);
		})
	}
}

function updateCache(){
	loadDirectLookBack();
}

/*初始化电视台观看历史*/
function intoTvWatchHistory(lastWatchTvChannel){
	Each(lastWatchTvChannel,function(data,i){
		if(channelArray[i]==undefined)return;
		channelArray[i].setAttribute("src",LIVE_PICURL+data.picUrl);
		channelArray[i].setAttribute("channelname",data.channelName);
		channelArray[i].setAttribute("channelId",data.channelId);
		channelArray[i].setAttribute("tvId",data.tvId);
		var markIndex=parseInt(channelArray[i].getAttribute("id").split("_")[1]);
		jQuery("#div_"+markIndex).find(".titles").html("<span style='color:white' id=span_"+markIndex+" remarks='"+data.channelName+"'>"+data.channelName+"</span>");
		/*
		if(channelArray[i].getAttribute("down")=="0"){
			var markIndex=parseInt(channelArray[i].getAttribute("id").split("_")[1]);
			//jQuery(channelArray[i]).parent().parent().find(".titles").html("<span style='color:white'>"+data.channelName+"</span>");
			jQuery("#div_"+markIndex).find(".titles").html("<span style='color:white'>"+data.channelName+"</span>");
		}else{
			jQuery(channelArray[i]).parent().find(".titles").html("<span style='color:white'>"+data.channelName+"</span>");
		}
		*/
		
		setDirectAttr("channel",channelArray[i]);
	})
	tvsee.eventFrame.globalParams.globalCache.put("directLookInner_CACHE",jQuery("#content").html());
}

//设置一个回调空函数
function selects(id){}


function functionDirectLookBack(markIndex,name,channelId,tvId,date,mid){
	if(name!="channelList" && channelId==""){
		return;
	}
	tvsee.eventFrame.globalParams.globalCache.put("markIndex_CACHE",markIndex);
	tvsee.pageWidgets.getByName("widgetMenu").hideWin();
	switch (name) {
		case "direct"://直播
				//tvsee.mainFrame.location.href ="vodPlay.html?fromPage=WAT2013/10/22CHTVHOME&type=1&date="+date+"&cid="+channelId+"&playUrl="+guid+"&timelength=0&episode=0&movieName=&isHttp=false&moviePic=";
				gotoPageUrl("vodPlay.html?fromPage=WATCHTVHOME&type=1&date="+date+"&cid="+channelId+"&mid="+mid+"&playUrl=&timelength=0&episode=0&movieName=&isHttp=false&moviePic=");
				break;
		case "lookBack"://回看
				//tvsee.mainFrame.location.href ="vodPlay.html?fromPage=WATCHTVHOME&type=0&date="+date+"&cid="+channelId+"&playUrl="+guid+"&timelength=0&episode=0&movieName=&isHttp=false&moviePic=";
				gotoPageUrl("vodPlay.html?fromPage=WATCHTVHOME&type=0&date="+date+"&cid="+channelId+"&mid="+mid+"&playUrl=&timelength=0&episode=0&movieName=&isHttp=false&moviePic=");
				break;
		case "channel"://频道
				//tvsee.mainFrame.location.href ="watchTv.html?fromPage=WATCHTVHOME&cid="+channelId+"&tvId="+tvId;
				gotoPageUrl("watchTv.html?cid="+channelId);
				break;
		case "channelList"://频道列表
				//tvsee.mainFrame.location.href ="watchTv.html?fromPage=WATCHTVHOME&cid=all";
				gotoPageUrl("watchTv.html?cid=all");
				break;
	}
}


//http://192.168.120.14:8080/newhk/jsonp/GetMovieByPid.action?programName=2013-08-29&cid=2
//定时跟新获取直播流
//var intervalArray=[];//循环定时
var timeoutArray=[];//循环定时
function getDirectInfo(markIndex,obj){
	/*
	if(obj==undefined){
		obj=this.obj;
		markIndex=this.markIndex;
		Each(timeoutArray,function(data,i){
			if(data.b==obj){
				//this.clearInterval(data.a);//清除上一个时间段
				if(data.a!=undefined)clearTimeout(data.a);
			}
		})
	}
	*/
	if(timeoutArray!=""){
		Each(timeoutArray,function(data,i){
			if(data.b==markIndex){
				if(data.a!=undefined)clearTimeout(data.a);
			}
		})
	}
	this.markIndex=markIndex;
	var playDate=obj.getAttribute("playDate"),//播放日期
		channelId=obj.getAttribute("channelId"),//频道Id
		tvId=obj.getAttribute("tvId"),//电视台Id
		guid=obj.getAttribute("guid");
	if(playDate==""||channelId=="")return;
	if(obj.getAttribute("name")=="direct"){
		playDate=this.nowDate;
		var marks=playDate+"_"+channelId;
		var directList=tvsee.eventFrame.globalParams.globalCache.get(marks);
		if(directList){
			setDirectInfoByInterval(directList,markIndex,obj,playDate,channelId,tvId,guid);
		}else{
			loadDirectInfo(playDate,channelId,function(data){
				setDirectInfoByInterval(data,markIndex,obj,playDate,channelId,tvId,guid);
			});
		}
	}else{
		obj.setAttribute("action","#functionDirectLookBack('"+markIndex+"','"+obj.getAttribute("name")+"','"+channelId+"','"+tvId+"','"+playDate+"','"+guid+"')");
	}
}
function setDirectInfoByInterval(directList,markIndex,obj,playDate,channelId,tvId,guid){
	if(directList.length!=0){
		Each(directList,function(data,i){
			obj.setAttribute("action","#functionDirectLookBack('"+markIndex+"','"+obj.getAttribute("name")+"','"+channelId+"','"+tvId+"','"+playDate+"','"+data.guid+"')");
			//console.log("直播："+data.createdate+"-"+data.moviepublishdate+"/"+data.moviename);
			if(compareDate(getTimes(),data.createdate)&&!compareDate(getTimes(),data.moviepublishdate)){
				//alert(data.createdate+"-"+data.moviepublishdate+"//"+data.moviename);
				var intervalTime=timeMatrixing(data.moviepublishdate)-timeMatrixing(getTimes());//获得时间差
				console.log(data.createdate+"-"+data.moviepublishdate+"/"+data.moviename+"/"+intervalTime);
				var indexs=parseInt(obj.getAttribute("id").split("_")[1]);
				var titleBol=obj.getAttribute("titleBol");//是否一直显示title
				var title=data.catename+" "+data.moviename;
				var title_show = subStr(title, 15, "...");
				if(titleBol=="true"){
					//jQuery(obj).parent().find(".titles_show").html("<span style='color:white' id=span_"+indexs+" remarks='"+title+"'>"+title_show+"</span>");
					jQuery("#div_"+indexs).find(".titles_show").html("<span style='color:white' id=span_"+indexs+" remarks='"+title+"'>"+title_show+"</span>");
				}else{
					//jQuery(obj).parent().find(".titles").html("<span style='color:white' id=span_"+indexs+" remarks='"+title+"'>"+title_show+"</span>");
					jQuery("#div_"+indexs).find(".titles").html("<span style='color:white' id=span_"+indexs+" remarks='"+title+"'>"+title_show+"</span>");
				}
				//重新设置直播节目信息
				obj.setAttribute("action","#functionDirectLookBack('"+indexs+"','"+obj.getAttribute("name")+"','"+channelId+"','"+tvId+"','"+playDate+"','"+data.guid+"')");
				console.log("接收到的节目----"+title+"/"+"markIndex:"+indexs);
				this.obj=obj;
				var timeout=setTimeout(getDirectInfo,intervalTime,markIndex,obj);
				timeoutArray.push({a:timeout,b:indexs});
			}
		})
	}
}



function loadDirectInfo(playDate,channelId,callback){
	var url = parent.getAjaxUrl("getMovieListByDate",playDate,channelId);
	var marks=playDate+"_"+channelId;
	doAjax(url, null,function(data, status) {
		console.log("直播节目单URl:"+url);
		if (status == "success") {
			tvsee.eventFrame.globalParams.globalCache.put(marks,data.movie);
			callback(data.movie);
		}
	});
}

function loadLastWatchTvChannel(userId,callback){
	//var url = parent.getAjaxUrl("getLastWatchTvChannel",userId);
	//var url="http://125.39.96.92:8080/CNTV_EPG1.5/jsonp/GetLastWatchTvChannelAction.action?userId=1";
	var url=getAjaxUrl("getLastWatchTvChannel");
	console.log("历史频道数据url:"+url);
	doAjax(url, null,function(data, status) {
		if (status == "success") {
			tvsee.eventFrame.globalParams.globalCache.put("lastWatchTvChannel_CACHE", data.lastWatchTvChannel);
			callback(data.lastWatchTvChannel);
		}
	});
}

//获取当前时间
function getTimes(){
	var d=new Date();
	var add_zero=function(temp){
		if(temp<10) return "0"+temp;
		else return temp;
	}
	//setInterval(getTimes,100);
	var hours = add_zero(d.getHours());
	var minutes = add_zero(d.getMinutes());
	return hours+":"+minutes;
}


//时间比较
function compareDate(t1,t2)
{
	var date = new Date();
	var a = t1.split(":");
	var b = t2.split(":");
	return date.setHours(a[0],a[1]) >= date.setHours(b[0],b[1]);
}

//时间转换
function timeMatrixing(t){
	var a = t.split(":");
	return (parseInt(a[0])*3600+parseInt(a[1])*60)*1000;
	
}


/*
获得给定的时间日期
*/
function GetDateStr(cdata){
	var cdataArray=cdata.split("-"),
		date = new Date();
	if(cdataArray[0]==date.getFullYear()&&parseInt(cdataArray[1])==(parseInt(date.getMonth())+1)&&parseInt(cdataArray[2])==parseInt(date.getDate())){
		return "今天";
	}else if(cdataArray[0]==date.getFullYear()&&parseInt(cdataArray[1])==(parseInt(date.getMonth())+1)&&parseInt(cdataArray[2])==parseInt(date.getDate())-1){
		return "昨天";
	}else{
		return parseInt(cdataArray[1])+"月"+parseInt(cdataArray[2])+"日";
	}
}

//从缓存中取当前时间
function getNowDate(){
	var data = tvsee.eventFrame.globalParams.globalCache.get("lastWeekDate_CACHE");
	this.nowDate=data.weekDate[0][1];
}







