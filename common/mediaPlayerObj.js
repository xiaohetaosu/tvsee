var userAgent = navigator.userAgent.toLowerCase();
var isAndroid = userAgent.indexOf("android") != -1;
var isQt = false;
var mediaPlayerListerenName = "mediaPlayerListeren";
if(typeof(android_userAgent) != "undefined"){
   isAndroid = true;
}
var qtPlayer = null;
if(typeof(player) != "undefined"){
	if(typeof(player.finished) != "undefined"){
		isQt = true;	
		qtPlayer = player;
	}
}else if(typeof(parent) != "undefined"){
	if(typeof(parent.player) != "undefined"){
		if(typeof(parent.player.finished) != "undefined"){
			isQt = true;	
			qtPlayer = parent.player;
		}
	}
}

var otherPlayer = null;
var otherVod = null;
var otherIsStartPlay = false;
if(isAndroid == false && isQt == false){
	if(typeof(player) != "undefined"){
		otherPlayer = player;	
		otherVod = vod;
		
	}else if(typeof(parent.player != "undefined")){
		otherPlayer = parent.player;
		otherVod = parent.vod;
	}
}

//android
var androidMediaPlayer = {
	pos: 0,
	guidPlay:function(guid, pos){
		this.pos = pos;
		player.loadAndPlay("vod://" + guid, 0);		
	},
	loadAndPlay:function(url,pos){
		this.pos = pos;
		player.loadAndPlay(url, pos);	
	},
	setFullScreen:function(){
		player.setFullScreen();	
	},
	setPlayPostion:function(top, left, width, height){
		player.setPlayPostion(top, left, width, height);
	},
	isFullScreen:function(){
		return player.isFullScreen();	
	},
	play:function(){
		return 	player.play();
	},
	stop:function(){
		this.pos = 0;
		return player.stop();	
	},
	pause:function(){
		return player.pause();	
	},
	setVolume:function(volumeValue){
		return player.setVolume(volumeValue);	
	},
	volume:function(){
		return player.volume();
	},
	getMaxVolume:function(){
		if(typeof(player.getMaxVolume) == "undefined"){
			return 0;
		}
		
		return player.getMaxVolume();	
	},
	setMute:function(mute){
		player.setMute(mute);	
	},
	mute:function(){
		return player.mute();	
	},
	seek:function(pos){
		return player.seek(pos);
	},
	currentTime:function(){
		return player.currentTime();	
	},
	totalTime:function(){
		return player.totalTime();	
	},
	registerPlayerEvent:function(funName){
		//return player.registerPlayerEvent(funName);
		player.registerPlayerEvent(mediaPlayerListerenName);
	},
	setMediaPlayerMode:function(type){
		if(typeof(player.setMediaPlayerMode) != "undefined"){
			var typeMode = 0;
			if(type == "" || type == null){
				typeMode = 0;
			}else if(type == "3D-HSBS"){
				typeMode = 1;
			}else if(type == "3D-FSBS"){
				typeMode = 2	
			}else if(type == "3D-HTAB"){
				typeMode = 3;	
			}else if(type == "3D-FTAB"){
				typeMode = 4;
			}
			player.setMediaPlayerMode(typeMode);
		}
	},
	load:function(url, pos){
		player.load(url,pos);	
	},
	setTotalTime:function(total){
	
	},
	isPlaying:function(){
		//return player.isPlaying();	
	},
	isPaused:function(){
		//return player.isPaused();	
	},
	isBuffering:function(){
		//return player.isBuffering();	
	},
	isStopped:function(){
		//return player.isStopped();	
	},
	bringPlayerFront:function(){
		
	},
	pushPlayerBack:function(){
			
	},
	setVideoScale:function(_isScale){
		if(typeof(player.setVideoScale) == "function"){
			player.setVideoScale(_isScale);
		}
	}
}
//QT
var qtMediaPlayer = {
	pos: 0,
	videoLeft:0,
	videoTop: 0,
	videoWidth: 0,
	videoHeigth: 0,
	guidPlay:function(guid,pos){
		var bufferObj = document.getElementById("buffer");
		if(bufferObj != null){
			bufferObj.style.visibility = "hidden";
		}
		qtMediaPlayer.pos = pos;
		qtPlayer.loadAndPlay("vod://" + guid, pos);		
		//lisenterPlay(3);
		//lisenterPlay(8);
	},
	loadAndPlay:function(url, pos){
		var bufferObj = document.getElementById("buffer");
		if(bufferObj != null){
			bufferObj.style.visibility = "hidden";
		}
		qtMediaPlayer.pos = pos;
		//qtPlayer.loadAndPlay("vod://" + "{37158A06-3849-404F-AFE3-D906B359CCD1}");
		qtPlayer.loadAndPlay(url, pos);
		//lisenterPlay(3);
		//lisenterPlay(8);
	},
	setFullScreen:function(){
		qtPlayer.setFullScreen(true);
		qtPlayer.pushBack();
	},
	setPlayPostion:function(left, top, width, height){
		qtMediaPlayer.videoLeft = left;
		qtMediaPlayer.videoTop = top;
		qtMediaPlayer.videoWidth = width;
		qtMediaPlayer.videoHeigth = height;
		if(document.getElementById("playArea") == null){
			var playAreaObj = document.createElement("div");
			playAreaObj.id = "playArea";
			playAreaObj.style.position = "absolute";
			playAreaObj.style.width = width + "px";
			playAreaObj.style.left = left + "px";
			playAreaObj.style.height = height + "px";
			playAreaObj.style.top = top + "px";
			document.body.appendChild(playAreaObj);
			document.getElementById("playArea").innerHTML = "<object type='application/x-qt-plugin' classid='playArea' name='playArea' id='playArea' width='100%' height='100%' playAfterLoad='true' enableSOD='true' fullScreen='true'></object>";
		}/*else{
			playAreaObj.style.width = width + "px";
			playAreaObj.style.left = left + "px";
			playAreaObj.style.height = height + "px";
			playAreaObj.style.top = top + "px";
		}*/
		return;
		try{
			qtPlayer.setPlayPostion(left, top, width, height);
		}catch(e){
			qtPlayer.setPlayPosition(left, top, width, height);
		}
	},
	play:function(){
		qtPlayer.play();
	},
	stop:function(){
		this.pos = 0;
		qtPlayer.stop();
	},
	pause:function(){
		qtPlayer.pause();
	},
	volume:function(){
		return qtPlayer.volume();
	},
	mute:function(){
		return qtPlayer.mute();
	},
	setMute:function(mute){
		qtPlayer.setMute(mute);	
	},
	setVolume:function(volumeValue){
		qtPlayer.setVolume(volumeValue);	
	},
	isPlaying:function(){
		//return qtPlayer.isPlaying();	
	},
	isPaused:function(){
		//return qtPlayer.isPaused();
	},
	isBuffering:function(){
		//return qtPlayer.isBuffering();
	},
	seek:function(pos){
		qtPlayer.seek(pos);
		lisenterPlay(101);				
	},
	currentTime:function(){
		return qtPlayer.currentTime();
	},
	setTotalTime:function(totalTime){
		qtPlayer.setTotalTime(totalTime);
	},
	totalTime:function(){
		return qtPlayer.totalTime();	
	},
	version:function(){
		return qtPlayer.version();
	},
	load:function(url, pos){
		qtPlayer.load(url, pos);
	},
	bringPlayerFront:function(){
		qtPlayer.bringPlayerFront();
	},
	pushPlayerBack:function(){
		qtPlayer.pushPlayerBack();
	},
	setMediaPlayerMode:function(type){
			
	},
	registerPlayerEvent:function(funName){
		
	},
	getMaxVolume:function(){//可以默认返回100,如果不操作音量可以设置为0
		return 1;	
	},
	setVideoScale:function(_isScale){
	
	}
}
//qt
function qtMeidaPlayerConnectListener(){
	if(isQt == true){
		if(typeof(qtPlayer.finished) != "undefined"){
			qtPlayer.finished.connect(qtFinished);//播放结束，自然结束
		}
		if(typeof(qtPlayer.playFailed) != "undefined"){
			qtPlayer.playFailed.connect(qtPlayFailed);//播放失败
		}
		if(typeof(qtPlayer.loadFailed) != "undefined"){
			qtPlayer.loadFailed.connect(qtLoadPlayer);//加载失败
		}
		if(typeof(qtPlayer.playListFinished) != "undefined"){
			qtPlayer.playListFinished.connect(qtPlayListFinished);//播放列表结束
		}
		if(typeof(qtPlayer.playFaileddisconnect) != "undefined"){
			qtPlayer.playFaileddisconnect.connect(qtPlayFaileddisconnect);//视频播放失败, error：0-未知，1-格式不支持，2-解码失败，4-视频异常，8-音频异常 ，16- seek位置错误
		}
		if(typeof(qtPlayer.playStarted) != "undefined"){
			qtPlayer.playStarted.connect(qtPlayStarted);//视频开始播放，指的是load之后视频开始播放
		}
		if(typeof(qtPlayer.playPaused) != "undefined"){
			qtPlayer.playPaused.connect(qtPlayPaused);//播放暂停
		}
		if(typeof(qtPlayer.playStopped) != "undefined"){
			qtPlayer.playStopped.connect(qtPlayerStop);//播放停止
		}
		if(typeof(qtPlayer.bufferingStart) != "undefined"){
			qtPlayer.bufferingStart.connect(qtBufferingBegin);//buffer结束后会发送bufferEnd消息
		}
		if(typeof(qtPlayer.bufferingProgress) != "undefined"){
			qtPlayer.bufferingProgress.connect(qtBufferingProgress);// 缓冲进度, percent:0-100
		}
		if(typeof(qtPlayer.bufferingEnd) != "undefined"){
			qtPlayer.bufferingEnd.connect(qtBufferingEnd);	
		}
	}
}
//qt  缓冲进度  缓冲结束的消息都没有给过来
function qtMediaPlayerDisconnectListener(){
	if(isQt == true){
			if(typeof(qtPlayer.finished) != "undefined"){
				qtPlayer.finished.disconnect(qtFinished);//播放结束，自然结束
			}
			if(typeof(qtPlayer.playFailed) != "undefined"){
				qtPlayer.playFailed.disConnect(qtPlayFailed);//播放失败
			}
			if(typeof(qtPlayer.loadFailed) != "undefined"){
				qtPlayer.loadFailed.disconnect(qtLoadPlayer);//加载失败	
			}
			if(typeof(qtPlayer.playListFinished) != "undefined"){
				qtPlayer.playListFinished.disconnect(qtPlayListFinished);//播放列表结束
			}
			if(typeof(qtPlayer.playFaileddisconnect) != "undefined"){
				qtPlayer.playFaileddisconnect.disconnect(qtPlayFaileddisconnect);//视频播放失败, error：0-未知，1-格式不支持，2-解码失败，4-视频异常，8-音频异常 ，16- seek位置错误
			}				
			if(typeof(qtPlayer.playStarted) != "undefined"){
				qtPlayer.playStarted.disconnect(qtPlayStarted);//视频开始播放，指的是load之后视频开始播放
			}
			if(typeof(qtPlayer.playPaused) != "undefined"){
				qtPlayer.playPaused.disconnect(qtPlayPaused);//播放暂停
			}
			if(typeof(qtPlayer.playStopped) != "undefined"){
				qtPlayer.playStopped.disconnect(qtPlayerStop);//播放停止
			}
			if(typeof(qtPlayer.bufferingStart) != "undefined"){
				qtPlayer.bufferingStart.disconnect(qtBufferingBegin);//buffer结束后会发送bufferEnd消息
			}
			if(typeof(qtPlayer.bufferingProgress) != "undefined"){
				qtPlayer.bufferingProgress.disconnect(qtBufferingProgress);	//缓冲进度, percent:0-100
			}
			if(typeof(qtPlayer.bufferingEnd) != "undefined"){
				qtPlayer.bufferingEnd.disconnect(qtBufferingEnd);//缓冲结束
			}
	}
}
//播放列表结束
function qtPlayListFinished(){
	lisenterPlay(400);
}

function qtLoadPlayer(){
	
}
function qtPlayFaileddisconnect(){

}
//加载成功
function qtPlayStarted(){
	lisenterPlay(3);
}
//暂停
function qtPlayPaused(){

}
//用户手动结束
function qtPlayerStop(){
	//lisenterPlay(400);
}
//缓冲开始
function qtBufferingBegin(){
	//lisenterPlay(400);
}
//缓冲进度
function qtBufferingProgress(_progress){
	lisenterPlay(102, _progress);
}
//缓冲结束
function qtBufferingEnd(){
	lisenterPlay(101);
}
//播放结束
function qtFinished(){
	lisenterPlay(1);				
}
//播放失败
function qtPlayFailed(){
	lisenterPlay(400);	
}
//加载失败
function qtLoadFailed(){
	lisenterPlay(400);
}

//android

//第三方
var otherMediaPlayer = {
	pos: 0,
	guidPlay: function(guid,pos){
		this.pos = pos;
		otherVod.guidToUrl(guid,"GuidToUrl_Callback");
	},
	loadAndPlay:function(url,pos){
		this.pos = pos;
		otherIsStartPlay = false;
		if(typeof(pos) == "undefined"){
			otherPlayer.loadAndPlay(url);
		}else{
			otherPlayer.loadAndPlay(url, pos);	
		}
	},
	setFullScreen:function(){
		otherPlayer.setFullScreen(true);	
	},
	setPlayPostion:function(top, left, width, height){
		//otherPlayer.setPlayPostion(top, left, width, height);
		if(typeof(otherPlayer.setPlayPostion) == "function"){
			otherPlayer.setPlayPostion(left, top, width, height);
		}else if(typeof(otherPlayer.setPlayPosition) == "function"){
			otherPlayer.setPlayPosition(left, top, width, height);
		}
	},
	isFullScreen:function(){
		return otherPlayer.isFullScreen();	
	},
	play:function(){
		return 	otherPlayer.play();
	},
	stop:function(){
		this.pos = 0;
		return otherPlayer.stop();	
	},
	pause:function(){
		return otherPlayer.pause();	
	},
	setVolume:function(volumeValue){
		return otherPlayer.setVolume(volumeValue);	
	},
	volume:function(){
		return otherPlayer.volume();
	},
	getMaxVolume:function(){
		return 100;
	},
	setMute:function(mute){
		otherPlayer.setMute(mute);	
	},
	mute:function(){
		return otherPlayer.mute();	
	},
	seek:function(pos){
		return otherPlayer.seek(pos);
	},
	currentTime:function(){
		return otherPlayer.currentTime();	
	},
	totalTime:function(){
		return otherPlayer.totalTime();	
	},
	registerPlayerEvent:function(funName){
		//return player.registerPlayerEvent(funName);
		//otherPlayer.registerPlayerEvent(mediaPlayerListerenName);
	},
	setMediaPlayerMode:function(type){
		
	},
	load:function(url, pos){
		otherPlayer.load(url,pos);	
	},
	setTotalTime:function(total){
		otherPlayer.setTotalTime(total);
	},
	isPlaying:function(){
		return otherPlayer.isPlaying();	
	},
	isPaused:function(){
		return otherPlayer.isPaused();	
	},
	isBuffering:function(){
		return otherPlayer.isBuffering();	
	},
	isStopped:function(){
		return otherPlayer.isStopped();	
	},
	bringPlayerFront:function(){
		return otherPlayer.bringPlayerFront();	
	},
	pushPlayerBack:function(){
		return otherPlayer.pushPlayerBack();		
	},
	setVideoScale:function(_isScale){
	
	}

}



/*function GuidToUrl_Callback(_url){
	if(_url == ""){
		lisenterPlay(408);	
		return;
	}
	web_player.loadAndPlay(_url);
	lisenterPlay(3);	
	lisenterPlay(8);	
}*/


/*
	    1001- 播放结束  
	    1002- 播放停止（通常是用户选择 stop） 
	    1100-缓冲开始 
	    1101-缓冲结束，开始播放 
	    1102-缓冲进度，第二个参数值为进度值0-100 
	    400-播放错误 

	   
	    2001- 播放结束  
	    2002- 播放停止（通常是用户选择 stop） 
	    2100-缓冲开始 
	    2101-缓冲结束，开始播放 
	    2102-缓冲进度，第二个参数值为进度值0-100 
	    2400-播放错误 
		 case 1: case 2: case 100: case 101: case 102:  case 400:  case 3:  case 8:
*/
function pxPlayerCallback(state, param){
	switch(state){
		case 1001://播放结束
		case 2001:
			lisenterPlay(1);
		break;
		case 1002://用户停止
		case 2002:
			//window[mediaPlayerListerenName](400);			
		break;
		
		case 1100://这个消息不能发
		//case 2100://缓冲开始
			//lisenterPlay(100);
		break;
		case 1101://缓冲结束
		case 2101:
			if(otherIsStartPlay == false){
				otherIsStartPlay = true;
				lisenterPlay(3);
			}
			lisenterPlay(101);
		break;
		case 1102://缓冲进度
		case 2102:
			lisenterPlay(102, param);
		break;
		case 2400://播放错误
		case 400:
			lisenterPlay(400);	
		break;
	}
}


function lisenterPlay(state, param){
	if(typeof(param) != "undefined"){
		window[mediaPlayerListerenName](state, param);	
	}else{
		window[mediaPlayerListerenName](state);
	}
}


if(isAndroid == true){
	web_player = androidMediaPlayer;
	web_player.playerType = "ANDROID";
}else if(isQt == true){
	web_player = qtMediaPlayer;	
	web_player.playerType = "QT";
}else{
	web_player = otherMediaPlayer;	
	web_player.playerType = "OTHER";
}

