var frameManager = {
	zIndex: 0,
	pages: [],
	history: [],
	zIndexChange: function(_element) {
		_element.style.zIndex = this.zIndex;
		this.zIndex++;
	},
	$: function(_id) {
		return typeof(_id) == "object" ? _id : window.document.getElementById(_id);
	},
	show: function(_id, _transition, _duration) {
		var THIS = this.$(_id);
		if (THIS == null) {
			tvsee.debug("[ERROR] show, id not exist: " + _id);
			return;
		}
		if (THIS.getAttribute("zIndexConstant") == null) {
			this.zIndexChange(THIS);
		}
		if (THIS.getAttribute("withoutFocus") == null) {
			var zIndexArr = [];
			var iframes = window.document.getElementsByTagName("iframe");
			for (var i = 0; i < iframes.length; i++) {
				if (this.$(iframes[i].name).style.visibility == "visible" && this.$(iframes[i].name).getAttribute("withoutFocus") == null) {
					zIndexArr.push({
						name: iframes[i].name,
						index: parseInt(iframes[i].parentNode.style.zIndex, 10)
					});
				}
			}
			var info = null;
			if (zIndexArr.length > 1) {
				zIndexArr.sort(function(_a, _b) {
					return _a.index - _b.index;
				});
				if (zIndexArr[zIndexArr.length - 1].name != _id && zIndexArr[zIndexArr.length - 1].index > parseInt(this.$(_id).style.zIndex, 10)) {
					info = [zIndexArr[zIndexArr.length - 1].index, _id];
					_id = zIndexArr[zIndexArr.length - 1].name;
					tvsee.debug("[DEBUG] show, change focus id " + info[1] + " to " + _id + " by zIndex");
				}
			}
			
			tvsee.debug("[DEBUG] show, and will focus on: " + _id);
			window.frames[_id].focus();
			for (var i = 0; i < this.history.length; i++) {
				if (this.history[i] == _id) {
					this.history.splice(i, 1);
					break;
				}
			}

			if (info != null) {
				for (var i = 0; i < this.history.length; i++) {
					if (this.history[i] == info[1]) {
						this.history.splice(i, 1);
						break;
					}
				}
				this.history.push(info[1]);

				for (var i = this.history.length - 1; i >= 0; i--) {
					if (this.$(this.history[i]).style.zIndex <= info[0]) {
						this.history.splice(i + 1, 0, _id);
						break;
					}
				}
			} else {
				this.history.push(_id);
			}
		}
		THIS.style.visibility = "visible";
	},
	hide: function(_id, _transition, _duration) {
		var THIS = this.$(_id);
		if (THIS == null) {
			tvsee.debug("[ERROR] hide, id not exist: " + _id);
			return;
		}
		if (THIS.getAttribute("withoutFocus") == null) {
			if (THIS.style.visibility == "visible") {
				this.history.pop();
			}
			if (this.history.length > 0) {
				tvsee.debug("[DEBUG] hide " + _id + ", and will focus on: " + this.history.slice(-1));
				window.frames[this.history.slice(-1)].focus();
			}
		}
		THIS.style.visibility = "hidden";
	},
	appendElement: function(_element, _type, _attribute, _zIndexConstant, _withoutFocus) {
		if (_type == "iframe" && (globalParams.browserType == "Android" || globalParams.browserType == "Chrome" || globalParams.browserType == "Safari")) {
			this.$(_attribute.name).setAttribute("readyState", "uninitialized");
		}
		var element = window.document.createElement(_type);
		for (var key in _attribute) {
			if (typeof(_attribute[key]) == "object") {
				for (var keySub in _attribute[key]) {
					element[key][keySub] = _attribute[key][keySub];
				}
			} else {
				element[key] = _attribute[key];
			}
		}
		if (_type == "div") {
			if (!_attribute.style.zIndex) {
				this.zIndexChange(element);
			}
		}
		_element.appendChild(element);
		if (_type == "iframe" && (globalParams.browserType == "Android" || globalParams.browserType == "Chrome" || globalParams.browserType == "Safari")) {
			this.$(_attribute.name).setAttribute("readyState", "loading");
		}

		if (_zIndexConstant) {
			element.setAttribute("zIndexConstant", true);
		}
		if (_withoutFocus) {
			element.setAttribute("withoutFocus", 1);
		}

		if (_type == "iframe") {
			this.pages.push(_attribute.name);
			this.setPrivateAttributes(_attribute.name); //destroyed when iframe location url change
		}
	},
	setPrivateAttributes: function(_name) {
		var frame = window.frames[_name];
		if (frame == null) {
			tvsee.debug("[DEBUG] iframe not exist yet: " + _name);
			return;
		}
		var THIS = this;
		/**
		 * @rewrite
		 * make browsers support sepecial functions
		 */
		frame.blur = function() {
			if (THIS.history.length > 0) {
				tvsee.debug("[DEBUG] onblur: " + this.name + ", and will focus on: " + THIS.history.slice(-1));
				window.frames[THIS.history.slice(-1)].focus();
			}
		};
		frame.moveTo = function(_x, _y) {
			THIS.$(_name).style.left = _x + "px";
			THIS.$(_name).style.top = _y + "px";
		};
		frame.resizeTo = function(_w, _h) {
			THIS.$(_name).style.width = _w + "px";
			THIS.$(_name).style.height = _h + "px";
		};

		/**
		 * @private
		 * do not define them in iframe pages
		 */
		frame.show = function(_transition, _duration) {
			THIS.show(_name, _transition, _duration);
		};
		frame.hide = frame.minimize = function(_transition, _duration) {
			THIS.hide(_name, _transition, _duration);
		};
	}
}

var tvseeObject = {
	debug: function(_str) {
		try {
			console.log(_str);
		} catch (exception) {
			return false;
		}
	},
	getDisplayString: function(_str) {
		return _str;
	},
	sendSimulateEvent: function(_type, _msg, _value) { //系统消息
		if (_msg == 340) { //iPanel to Standard
			_msg = 8;
		}
		_value = _value || 0;
		if (_type == 2 || _type == 7) { //keydown
		} else if (_type == 256 || _type == 257) { //message
			_value = "0x" + _value;
		}
		try {
			var evtObj = window.document.createEvent("KeyboardEvent");
			evtObj.initKeyEvent("keydown", true, true, null, false, false, false, false, _msg, _value); //Firefox
		} catch (exception) {
			var evtObj = window.document.createEvent("Event");
			evtObj.initEvent("keydown", true, true);
			evtObj.which = _msg;
			evtObj.modifiers = _value;
		}
		window.frames[frameManager.history.slice(-1)].document.dispatchEvent(evtObj);
	},
	System: {
		revision: "others.1.0.0.00001"
	},
	exitToHomePage: function(){
		window.location.href = "../entry/entry.html";	
	},
	showParInfo: function(){
		frameManager.$("publicInfoBar").style.visibility = "visible";
	},
	hiddenParInfo: function(){
		frameManager.$("publicInfoBar").style.visibility = "hidden";
	},
	misc: {
		startOtherApp: function(_str) {
			if (_str == "EXIT_IPANEL") {
				if (globalParams.browserType == "Android" && typeof(androidExtApi_app) != "undefined") {
					androidExtApi_app.exit();
				} else {
					window.location.href = "about:blank";
				}
			}
		}
	},

	eventFrame: window,
	mainFrame: window.frames["mainFrame"], //需要在创建window.frames["mainFrame"]后重新赋值
	overlayFrame: { //需要在创建window.frames["overlayFrame"]后重新赋值
		location: {
			hash: "",
			host: "",
			hostname: "",
			href: "",
			pathname: "",
			port: "",
			protocol: "",
			search: "",
			assign: function(_url) {},
			reload: function() {},
			replace: function(_url) {}
		},
		close: function() {},
		moveTo: function(_x, _y) {},
		resizeTo: function(_w, _h) {}
	},
	pageWidgets: {
		rootNode: null,
		length: 0,
		getByName: function(_name, _notCheckReady) {
			var readyState = "";
			if (globalParams.browserType == "Android" || globalParams.browserType == "Chrome" || globalParams.browserType == "Safari") {
				if (frameManager.$(_name) != null) {
					readyState = frameManager.$(_name).getAttribute("readyState");
				}
			} else {
				if (window.frames[_name] != null) {
					readyState = window.frames[_name].document.readyState;
				}
			}
			if (window.frames[_name] != null && (readyState == "complete" || typeof(_notCheckReady) != "undefined")) {
				return window.frames[_name];
			}
			return null;
		},
		create: function(_name, _url, _priority, _conflicFlag, _left, _top, _width, _height, _zIndexConstant, _zIndex, _withoutFocus) {
			/**
			 * @extensions
			 * _zIndexConstant, _zIndex, _withoutFocus
			 */
			if (this.rootNode == null) {
				var rootNode = window.document.createElement("div");
				rootNode.id = "rootDiv";
				rootNode.style.zIndex = -2;
				rootNode.style.position = "absolute";
				rootNode.style.left = "0px";
				rootNode.style.top = "0px";
				rootNode.style.visibility = "hidden"; //处理出现白屏问题
				rootNode.style.width = (globalParams.screenWidth || 1280) + "px";
				rootNode.style.height = (globalParams.screenHeight || 720) + "px";
				rootNode.style.overflow = "hidden";
				window.document.body.appendChild(rootNode);
				this.rootNode = rootNode;
			}
			if (this.getByName(_name) != null) {
				this.destroy(_name);
			}
			var attribute = {
				id: _name,
				style: {
					position: "absolute",
					left: _left || "0px",
					top: _top || "0px",
					width: (_width || globalParams.screenWidth || 1280) + "px",
					height: (_height || globalParams.screenHeight || 720) + "px",
					visibility: "hidden"
				}
			};
			if (_zIndex) {
				attribute.style.zIndex = _zIndex;
			}
			frameManager.appendElement(this.rootNode, "div", attribute, _zIndexConstant, _withoutFocus);
			frameManager.appendElement(frameManager.$(_name), "iframe", {
				name: _name,
				src: _url,
				width: "100%",
				height: "100%",
				frameBorder: 0,
				scrolling: "no"
			});
			this.length = frameManager.pages.length;
			if (_url != "about:blank") {
				loadPageStatus(1, _name); //show loading
			}
		},
		destroy: function(_name) {
			if (this.rootNode == null) {
				return;
			}
			for (var i = 0; i < frameManager.history.length; i++) {
				if (frameManager.history[i] == _name) {
					frameManager.history.splice(i, 1);
					break;
				}
			}
			for (var i = 0; i < frameManager.pages.length; i++) {
				if (frameManager.pages[i] == _name) {
					frameManager.pages.splice(i, 1);
					break;
				}
			}
			this.length = frameManager.pages.length;
			this.rootNode.removeChild(frameManager.$(_name));
			loadPageStatus(0, _name); //hide loading
		},
		getAt: function(_num) {
			for (var i = 0; i < frameManager.pages.length; i++) {
				if (frameManager.pages[i] == _name) {
					return window.frames[frameManager.pages[i]];
					break;
				}
			}
			return null;
		}
	}
};

function jsExtendedInterface(_frame, _isListener) {
	var frame = _frame || window;
	frame.tvsee = tvseeObject;
	frame.globalVar = tvsGlobalVar;
	frame.tvsLogger = tvsLogger;
	frame.hashtable = hashtable;
	frame.mediaPlayer = web_player;
	if (globalParams.browserType == "Firefox") {
		/**
		 * @define
		 * Firefox without innerText but textContent
		 */
		frame.HTMLElement.prototype.__defineGetter__("innerText", function() {
			return this.textContent;
		});
		frame.HTMLElement.prototype.__defineSetter__("innerText", function(_str) {
			this.textContent = _str;
		});
		/**
		 * @rewrite
		 * DOM focus need setTimeout in Firefox
		 * iframe里面嵌套iframe还是会有异常
		 */
		frame.focusWindow = frame.focus;
		frame.focus = function() {
			this.setTimeout(this.focusWindow, 1);
		};
	} else if (globalParams.browserType == "Android") {
		/**
		 * @rewrite
		 * call history.back in iframe make main page reload in webkit browsers
		 */
		frame.history.back = function() {
			if (globalParams.naviHistory.length <= 1) {
				return;
			}
			globalParams.naviHistory.pop();
			frame.location.href = globalParams.naviHistory.slice(-1);
		};
	}

	/**
	 * @force define
	 */
	if (globalParams.browserType == "Opera" || frame.name == "overlayFrame") {
		frameManager.setPrivateAttributes(frame.name);
	}

	/**
	 * @spec
	 */
	frame.oncontextmenu = function() {
		return false;
	};
	frame.document.onselectstart = function() {
		return false;
	};

	/**
	 * @define
	 * set / get window's property, do not define them in iframe pages
	 */
	Object.defineProperty(frame, "zIndex", {
		get: function() {
			return frameManager.$(this.name).style.zIndex;
		},
		set: function(_num) {
			frameManager.$(this.name).style.zIndex = _num;
			frameManager.$(this.name).setAttribute("zIndexConstant", true);
		}
	});
	Object.defineProperty(frame, "withoutFocus", {
		get: function() {
			return frameManager.$(this.name).getAttribute("withoutFocus") != null ? 1 : 0;
		},
		set: function(_num) {
			if (_num == 1) {
				frameManager.$(this.name).setAttribute("withoutFocus", 1);
			} else {
				frameManager.$(this.name).removeAttribute("withoutFocus");
			}
		}
	});
	Object.defineProperty(frame, "displayStatus", {
		get: function() {
			return frameManager.$(this.name).style.visibility == "visible" ? 1 : 0;
		}
	});

	/**
	 * @debug
	 */
	frame.onblur = function() {
		tvsee.debug("[DEBUG] onblur: " + this.name + "," + new Date().getTime());
	};
	frame.onfocus = function() {
		tvsee.debug("[DEBUG] onfocus: " + this.name + "," + new Date().getTime());
	};

	/**
	 * @define
	 * CSS3 property prefix
	 */
	frame.browserCss3Prefix = {
		"Android": "webkit",
		"Chrome": "webkit",
		"Firefox": "moz", //Firefox 4
		"IE": "ms", //IE 9
		"iPanel": "webkit",
		"Opera": "o",
		"Safari": "webkit"
	}[globalParams.browserType];
	
	if(typeof(_isListener) != "undefined"){
		return;	
	}
	/**
	 * @load page status
	 */
	if (globalParams.browserType == "Android" || globalParams.browserType == "Chrome" || globalParams.browserType == "Safari") {
		if (frameManager.$(frame.name) != null) {
			frameManager.$(frame.name).setAttribute("readyState", "interactive");
		}
	}
	frame.addEventListener("load", function() {
		// Add by bobo on 2013-11-14 -0 
		if (this.name == "videoRemotePlayerFrame"){
			return;
		}
		// Add by bobo on 2013-11-14 -1 
		if (globalParams.browserType == "Android" || globalParams.browserType == "Chrome" || globalParams.browserType == "Safari") {
			if (frameManager.$(this.name) != null) {
				if(this.name == "mainFrame"){
					frameManager.$(this.name).style.visibility = "visible";	
				}else if(this.name != "widgetMenu"){
					//this.blur();
					//window.frames["widgetMenu"].focus();
				}
				frameManager.$(this.name).setAttribute("readyState", "complete");
			}
		}
		loadPageStatus(0, this.name); //hide loading
	}, false);
}
function locationAction(_url) {
	if (globalParams.browserType == "Android" || globalParams.browserType == "Chrome" || globalParams.browserType == "Safari") {
		if (frameManager.$("mainFrame") != null) {
			frameManager.$("mainFrame").setAttribute("readyState", "loading");
			frameManager.$("mainFrame").style.visibility = "hidden";
		}
	}
	if (globalParams.browserType == "Android") {
		globalParams.naviHistory.push(_url); //record history
	}
	loadPageStatus(1, "mainFrame"); //show loading
}
function loadPageStatus(_type, _frameName) {
	if (_type == 1) {
		globalParams.loadPagesObj[_frameName] = true;
		if (Object.keys(globalParams.loadPagesObj).length > 1) {
			return;
		}
		if (globalParams.browserType == "Firefox") {
			frameManager.$("loadPageStatus").style.backgroundImage = "url(loadingIcon.gif)"; //APNG
		} else {
			frameManager.$("loadPageStatus").style.backgroundImage = "url(images/loadPageStatus.gif)";
		}
		frameManager.$("loadPageStatus").style.visibility = "visible";
	} else {
		if (typeof(globalParams.loadPagesObj[_frameName]) == "undefined") {
			tvsee.debug("[DEBUG] loading icon hide action, the frame is not in stack, frame: " + _frameName);
			return;
		}
		delete globalParams.loadPagesObj[_frameName];
		if (Object.keys(globalParams.loadPagesObj).length > 0) {
			return;
		}
		frameManager.$("loadPageStatus").style.backgroundImage = "none";
		frameManager.$("loadPageStatus").style.visibility = "hidden";
	}
}



function initEnvironment() {
	window.name = "eventFrame";
	jsExtendedInterface(window);
	window.oncontextmenu = null;
	if (globalParams.browserType != "Android" || typeof(androidExtApi_app) == "undefined") {
		//mediaAPI.sound.value = 25;
	}

	//mainFrame
	tvsee.pageWidgets.create("mainFrame", "about:blank", null, null, null, null, null, null, true);
	tvsee.pageWidgets.getByName("mainFrame", 1).show();
	tvsee.mainFrame = tvsee.pageWidgets.getByName("mainFrame", 1);

	//overlayFrame, could not call other attributes after define overlayFrame as this way.
	tvsee.pageWidgets.create("overlayFrame", "about:blank", null, null, null, null, null, null, true, 9999);
	if (globalParams.browserType == "Android" || globalParams.browserType == "Chrome" || globalParams.browserType == "Safari") {
		frameManager.$("overlayFrame").setAttribute("readyState", "uninitialized");
	}
	var overlayFrame = tvsee.pageWidgets.getByName("overlayFrame", 1);
	tvsee.overlayFrame.close = function() {
		overlayFrame.hide();
		loadPageStatus(0, "overlayFrame");
		if (globalParams.browserType == "Android" || globalParams.browserType == "Chrome" || globalParams.browserType == "Safari") {
			frameManager.$("overlayFrame").setAttribute("readyState", "uninitialized");
		}
		//overlayFrame.location.href = "about:blank";
	};
	tvsee.overlayFrame.moveTo = overlayFrame.moveTo;
	tvsee.overlayFrame.resizeTo = overlayFrame.resizeTo;
	for (var key in overlayFrame.location) {
		if (key == "href") { //rewrite
			tvsee.overlayFrame.location.__defineGetter__("href", function() {
				return overlayFrame.location.href;
			});
			tvsee.overlayFrame.location.__defineSetter__("href", function(_url) {
				overlayFrame.show(); //all for this
				loadPageStatus(1, "overlayFrame");
				if (globalParams.browserType == "Android" || globalParams.browserType == "Chrome" || globalParams.browserType == "Safari") {
					frameManager.$("overlayFrame").setAttribute("readyState", "loading");
				}
				overlayFrame.location.href = _url;
			});
		} else {
			if (key == "assign" || key == "reload" || key == "replace" || key == "getParameter" || key == "origin" || key == "toString" || key == "valueOf") {
				tvsee.overlayFrame.location[key] = overlayFrame.location[key];
				continue;
			}
			Object.defineProperty(tvsee.overlayFrame.location, key, Object.getOwnPropertyDescriptor(overlayFrame.location, key)); //only Firefox can get property "get" & "set"
		}
	}
}
/*----------environment---------*/


/*----------portal---------*/
function eventLevel(_eventObj, _type) {
	for (; globalParams.currFrameIndex >= 0;) {
		var handled = false;
		if(frameManager.history[globalParams.currFrameIndex] == "widgetMenu"){
			if( window.frames["widgetMenu"].globalParams.isParentFocus == true){
				if(typeof(window.frames["widgetMenu"].eventHandler) == "function"){
					rst = window.frames["widgetMenu"].eventHandler(Event.mapping(_eventObj));	
				}
			}else if(window.frames["widgetMenu"].globalParams.isParentFocus == false){
				var frameObj = window.frames[frameManager.history[globalParams.currFrameIndex]];
				if(typeof(frameObj.frames[frameObj.globalParams.ifrChildName].eventHandler) == "function"){
					rst = frameObj.frames[frameObj.globalParams.ifrChildName].eventHandler(Event.mapping(_eventObj));
				}
			}
			handled = true;	
		}else if(frameManager.history[globalParams.currFrameIndex] == "widgetLauncher"){
			if( window.frames["widgetLauncher"].globalParams.isParentFocus == true){
				if(typeof(window.frames["widgetLauncher"].eventHandler) == "function"){
					rst = window.frames["widgetLauncher"].eventHandler(Event.mapping(_eventObj));	
				}
			}else{
				var frameObj = window.frames[frameManager.history[globalParams.currFrameIndex]];	
				if(typeof(frameObj.frames["launcher_iframe_" + frameObj.menuSelectPos].eventHandler) == "function"){
					rst = frameObj.frames["launcher_iframe_" + frameObj.menuSelectPos].eventHandler(Event.mapping(_eventObj));
				}
			}
			handled = true;	
		}
		if (handled == false) {
			if (typeof(window.frames[frameManager.history[globalParams.currFrameIndex]].eventHandler) == "function") {
				rst = window.frames[frameManager.history[globalParams.currFrameIndex]].eventHandler(Event.mapping(_eventObj));
			} else {
				return EVENT_DESC.DOWN;
			}
		}
		globalParams.currFrameIndex--;
		if (rst == EVENT_DESC.STOP) {
			return EVENT_DESC.STOP;
		} if (rst == EVENT_DESC.DOWN) {
			break;
		} else if (rst == EVENT_DESC.ADVECTED) {
			return eventLevel(_eventObj, _type);
		}
	}
	return EVENT_DESC.DOWN;
}


/* Added by bobo on 2013-11-12 */
var remotePlayStatus = 0;
function doVideoPlay(_videoUrl, _timelength, _position, _movieName, _moviePic, _type){
	console.debug("===doVideoPlay::_movieName="+_movieName+", moviePic="+_moviePic+", _type="+_type+", _timelength="+_timelength);
	console.debug("typeof(mainFrame):" +typeof(mainFrame));
	
	
	if (_type != null && _type != ""&& _type == "queryVip"){
		try{
			tvsee.pageWidgets.getByName("widgetOrder").getPayInfo();
		}catch(e){
			//TODO handle the exception
			
		}
		tvsee.pageWidgets.getByName("widgetOrder").getPayInfo(0);
//		getPayinfo();
		return
	}
	try{
		console.debug("mainFrame.location.href.indexOf('vodPlay.html'):" + mainFrame.location.href.indexOf('vodPlay.html'));
		if (mainFrame.location.href.indexOf("vodPlay.html") != -1)	{	//当前在播放页，先退出播放页
			if (typeof(mainFrame.exitVodRemotePlay)=="function"){
				try{
					mainFrame.exitVodRemotePlay(1);
				}catch(e){
					console.debug("===doVideoPlay Exception:");	
				}	
			}else{		//播放页正在加载中...
				mainFrame.location.href= "about:blank";
			}
		}
		
		var focusName = frameManager.history[frameManager.history.length - 1];
		if(focusName == "widgetMenu"){
			if(typeof(window.frames["widgetMenu"].clearLoopTask) == "function"){
				window.frames["widgetMenu"].clearLoopTask(0);
			}
		}
	} catch (e) {}
	
	var _pid = 100;
	var _duration = _timelength;
	//主页隐藏，显示远程播放页
	document.getElementById("rootDiv").style.display="none";
	document.getElementById("videoRemotePlayerDiv").style.display="block";
	//设置甩屏状态
	remotePlayStatus = 1;
	videoRemotePlayerFrame.REMOTE_moviename = _movieName;
	videoRemotePlayerFrame.mediaPlay(_videoUrl, _duration, 0, 1, _movieName, _position);
}

function widgetMenuStartLoopTask(){
	var focusName = frameManager.history[frameManager.history.length - 1];
	if(focusName == "widgetMenu"){
		if(typeof(window.frames["widgetMenu"].startLoopTask) == "function"){
			window.frames["widgetMenu"].startLoopTask();
		}	
	}
}



function doKeyDown_keyboard(_eventObj){
	var keyCode = Event.mapping(_eventObj).code;  //KEY_VOLUME_UP  KEY_VOLUME_DOWN KEY_VOLUME_MUTE
	if (remotePlayStatus==1 && keyCode != "KEY_VOLUME_UP" && keyCode != "KEY_VOLUME_DOWN" && keyCode != "KEY_VOLUME_MUTE"){//
		videoRemotePlayerFrame.eventHandler(Event.mapping(_eventObj));
	}else{
		if(_eventObj.keyCode == 6001 || _eventObj.keyCode == 6002 || _eventObj.keyCode == 6003 || _eventObj.keyCode == 6004){
			var focusName = frameManager.history[frameManager.history.length - 1];
			//alert("focusName:" + focusName);
			if(focusName == "widgetMenu"){
				if( _eventObj.keyCode == 6001 ||  _eventObj.keyCode == 6003){
					if(typeof(window.frames["widgetMenu"].clearLoopTask) == "function"){
						window.frames["widgetMenu"].clearLoopTask(0);
					}
				}else{
					if(typeof(window.frames["widgetMenu"].startLoopTask) == "function"){
						window.frames["widgetMenu"].startLoopTask();
					}
				}
			}else if(focusName == "widgetLauncher"){
				if( _eventObj.keyCode == 6001 ||  _eventObj.keyCode == 6003){
					if(typeof(window.frames["widgetLauncher"].clearLoopTask) == "function"){
						window.frames["widgetLauncher"].clearLoopTask(0);
					}
				}else{
					if(typeof(window.frames["widgetLauncher"].startLoopTask) == "function"){
						window.frames["widgetLauncher"].startLoopTask();
					}
				}	
			}
			//alert("initVolume:" + typeof(window.frames["widgetVolume"].initVolume));
			if(typeof(window.frames["widgetVolume"].initVolume) == "function"){
				setTimeout(function(){
					window.frames["widgetVolume"].initVolume();
				}, 5000);
			}
		}
		gotoLiveOrVod(_eventObj.keyCode, 1);
		eventHandler(_eventObj);
	}	
}
function eventHandler(_eventObj, _type) {
	if (globalParams.browserType == "Android") {
		globalParams.currFrameIndex = frameManager.history.length - 1;
		if (globalParams.currFrameIndex == -1) {
			globalParams.currFrameIndex = 0;
		}
		if (frameManager.history.length > 0 || globalParams.isInfoBarShow == true) {
			var rst = eventLevel(_eventObj, _type);
			if (rst == EVENT_DESC.STOP) {
				return EVENT_DESC.STOP;
			}
		}
	}
	var widgetVolume = window.frames["widgetVolume"];
	switch (Event.mapping(_eventObj).code) {
		case "KEY_VOLUME_UP":
			if(widgetVolume != null){
				widgetVolume.volumeUD(1);
			}
		break;
	case "KEY_VOLUME_DOWN":
			if(widgetVolume != null){
				widgetVolume.volumeUD(-1);
			}
		break;
	case "KEY_VOLUME_MUTE":
			if(widgetVolume != null){
				widgetVolume.setMute();
			}
		break;

	}
	return EVENT_DESC.STOP;
}

function initPortal() {
	window.document.title = "TVSEE3.0";
	globalCache.homeMenus = menus;
	initPage(window); //eventHandler
	globalParams.globalCache = new hashTableClass(50);/*保存用户数据相关信息,不可以清除的*/
	globalParams.dataCache = new hashTableClass(100); /*保存EPG数据相关信息,可以清除的*/
	globalParams.focusCache = new hashTableClass(100); /*保存页面焦点相关信息,不可以清除的*/
	globalParams.stbCache = getStbInfo();
	if(typeof(action_type) == "undefined" && typeof(action_id) == "undefined"){
		createWidgetMenu(0);
		return;
	}
	//document.getElementById("blackbg").style.visibility = "hidden";
	var type = "";
	if(typeof(action_type) != "undefined"){
		type = action_type;	
	}
	var goUrl = "";
	if(type == "ADD_TV_LIST"){
		goUrl = "addTVList.html";
	}else if(type == "RECORD_LIST"){
		goUrl = "recordList.html";	
	}else if(type == "FAVORITE_LIST"){
		goUrl = "favoriteList.html";
	}else if(type == "VOD_DETAIL"){//vodDetail vodVarietyDetail vodVarietyDetailNew
		if(getMovieTypeDetail(movie_type) == "vodDetail"){
			goUrl = "vodDetail.html?pid=" + action_id;	
		}else if(getMovieTypeDetail(movie_type) == "vodVarietyDetail"){
			goUrl = "vodVarietyDetail.html?pid=" + action_id;	
		}else if(getMovieTypeDetail(movie_type) == "vodVarietyDetailNew"){
			goUrl = "vodVarietyDetailNew.html?pid=" + action_id;	
		}
		goUrl += "&windowSize=fullScreen";
	}else if(type == "SEARCH"){//search
		goUrl = "search.html";	
	}else if(type == "VOD_LIST"){
		createWidgetVodList("OTHER_APP");
		checkWidgetVodListReady();
		createWidgets(2);
		return;
	}
	if(goUrl.indexOf("?") != -1){
		goUrl += "&fromPage=OTHER_APP";	
	}else{
		goUrl += "?fromPage=OTHER_APP";		
	}
	if(goUrl.split("?")[0] != ""){
		tvsee.mainFrame.location.href = goUrl;	
		createWidgets(1);
	}else{
		createWidgetMenu(0);
	}
}

function setCookie(c_name,value,expiredays)
{
var exdate=new Date()
exdate.setDate(exdate.getDate()+expiredays)
document.cookie=c_name+ "=" +escape(value)+
((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}
function createWidgetMenu(_type){
	tvsee.pageWidgets.create("widgetMenu", "index.html");
	if(SETCITY == ""){
		checkWidgetMenuReady();	
		return;
	}
	tvsee.pageWidgets.create("widgetLauncher", "widgetLauncher.html?CITY = " + SETCITY);
	if(SETCITY == "chengdu"){
		tvsee.pageWidgets.create("widgetPayList", "widgetPayList.html");
	}else if(SETCITY == "wuhan" || SETCITY == "chongqing"|| SETCITY == "guiyang"|| SETCITY == "changsha"){
		tvsee.pageWidgets.create("widgetPayList", "widgetPayList.html");	
	}
	checkWidgetLauncherReady();
}
function checkWidgetLauncherReady(){
	var widgetLauncher = tvsee.pageWidgets.getByName("widgetLauncher", 1);	
	if(widgetLauncher != null){
		document.getElementById("rootDiv").style.visibility = "visible";
		widgetLauncher.show();
	}else{
		setTimeout("checkWidgetLauncherReady()", 100);	
	}
}
function checkWidgetMenuReady(){
	var widgetMenu = tvsee.pageWidgets.getByName("widgetMenu", 1);	
	if(widgetMenu != null){
		document.getElementById("rootDiv").style.visibility = "visible";
		widgetMenu.show();
	}else{
		setTimeout("checkWidgetMenuReady()", 100);	
	}
}


function createWidgetVodList(fromPage){
	if(typeof(LIST_STYLE) != "undefined" && LIST_STYLE == 1){//gitv列表页
		tvsee.pageWidgets.create("widgetMovieType", "movieType.html");
		tvsee.pageWidgets.create("widgetVodList", "vodListPage.html?fromPage=" + fromPage);
		tvsee.pageWidgets.create("widgetRecVodList", "vodRecListPage.html?fromPage=" + fromPage);
		tvsee.pageWidgets.create("widgetnewVodList", "newvodListPage.html?fromPage=" + fromPage);
	}else{//cntv列表页
		tvsee.pageWidgets.create("widgetVodList", "vodList.html?fromPage=" + fromPage);
	}
}
function createWidgets(_type){
	initCacheData();
	if(_type == 0){
		createWidgetVodList("");
	}else if(_type == 1){
		
	}
	if(_type == 0 || _type == 2){
		//tvsee.pageWidgets.create("widgetVIPDetail", "vipVodDetail.html?fromPage=VIPLIST&windowSize=small");//VIP描述页
		tvsee.pageWidgets.create("widgetOrder", "widgetOrder.html");
//		tvsee.pageWidgets.create("noticePage", "noticePage.html");
		//tvsee.pageWidgets.create("widgetSpecialList", "specialList.html");//专题列表页
		//tvsee.pageWidgets.create("widgetSpecialDesc", "specialDescribe.html");//专题描述页
		//tvsee.pageWidgets.create("widgetVodDetailFull", "vodDetail.html?fromPage=SPELIST&windowSize=fullScreen");//专题全屏详情页
		//tvsee.pageWidgets.create("widgetVodVarietyDetailFull", "vodVarietyDetail.html?fromPage=SPELIST&windowSize=fullScreen");//专题全屏详情页
		tvsee.pageWidgets.create("widgetVodDetail", "vodDetail.html?fromPage=NEWLIST&windowSize=small");
		tvsee.pageWidgets.create("widgetVodVarietyDetail", "vodVarietyDetail.html?fromPage=NEWLIST&windowSize=small");
		tvsee.pageWidgets.create("widgetVodVarietyDetailNew", "vodVarietyDetailNew.html?fromPage=NEWLIST&windowSize=small");
		//tvsee.pageWidgets.create("widgetTriScreen", "3ScreenInteraction.html");
		tvsee.pageWidgets.create("widgetVodPlay", "vodPlay.html?cid=0&type=1&fromPage=&mid=0&date=&playUrl=&timelength=&episode=0&pid=0&lastTimelength=0&movieName=&isHttp=true&moviePic=");
		tvsee.pageWidgets.create("widgetLunBoMenu", "widgetLunBoMenu.html");
		//tvsee.pageWidgets.create("widgetKeyboard", "widgetKeyboard.html");
	}
	//tvsee.pageWidgets.create("widgetAuthOrDed", "widgetAuthOrDed.html");
	tvsee.pageWidgets.create("widgetVodBack", "widgetVodBack.html");
	//tvsee.pageWidgets.create("widgetLiveBack", "widgetLiveBack.html");
	//tvsee.pageWidgets.create("widgetWatchBack", "widgetWatchBack.html");
	tvsee.pageWidgets.create("widgetDialog", "widgetDialog.html");
	//tvsee.pageWidgets.create("widgetUserManager", "userManager.html"); //创建用户管理对象
}

function initData(){
	initCacheData();
	tvsee.pageWidgets.create("widgetVodList", "vodList.html");
	tvsee.pageWidgets.create("widgetVodDetail", "vodDetail.html?fromPage=LIST&windowSize=small");
	tvsee.pageWidgets.create("widgetVodVarietyDetail", "vodVarietyDetail.html?fromPage=NEWLIST&windowSize=small");
	tvsee.pageWidgets.create("widgetTriScreen", "3ScreenInteraction.html");
	tvsee.pageWidgets.create("widgetAuthOrDed", "widgetAuthOrDed.html");
	tvsee.pageWidgets.create("widgetVodBack", "widgetVodBack.html");
	tvsee.pageWidgets.create("widgetLiveBack", "widgetLiveBack.html");
	tvsee.pageWidgets.create("widgetWatchBack", "widgetWatchBack.html");
}

function checkWidgetVodListReady(){
	var widgetVodList = tvsee.pageWidgets.getByName("widgetVodList", 1);	
	if(typeof(widgetVodList.initMenu) == "function"){
		document.getElementById("rootDiv").style.visibility = "visible";
		widgetVodList.show();
		widgetVodList.initMenu(action_id, "");
	}else{
		setTimeout("checkWidgetVodListReady()", 100);	
	}
}
/*----------portal---------*/


/*----------global----------*/
var globalParams = {
	//environment
	screenWidth: 1280,
	screenHeight: 720,
	//environment fix bug / extend function
	naviHistory: [],
	loadPagesObj: {},
	//environment player
	videoPlayer: null,
	//environment and portal
	browserType: "",

	//portal
	currFrameIndex: 0,
	isInfoBarShow: false, //fix bug
	//进入应用取到的数据
	globalCache: null,
	dataCache: null,
	focusCache: null,
	stbCache: null,
	userCache: null
};
/*----------global----------*/


/*----------initialization----------*/
function checkBrowserType() {
	var userAgent = navigator.userAgent.toLowerCase();
	if (userAgent.indexOf("android") != -1 || typeof(androidExtApi_app) != "undefined") {
		globalParams.browserType = "Android";
	} else if (userAgent.indexOf("chrome") != -1) {
		globalParams.browserType = "Chrome";
	} else if (userAgent.indexOf("firefox") != -1) {
		globalParams.browserType = "Firefox";
	} else if (userAgent.indexOf("opera") != -1) {
		globalParams.browserType = "Opera";
	} else if (userAgent.indexOf("safari") != -1) {
		globalParams.browserType = "Safari";
	} else if (userAgent.indexOf("msie") != -1) {
		if (userAgent.indexOf("iPanel") != -1) {
			globalParams.browserType = "iPanel";
		} else {
			globalParams.browserType = "IE";
		}
	}
}

function run() {
	initEnvironment(); //eventFrame, mainFrame, pageWidgets, overlayFrame environment
	initPortal();
}
