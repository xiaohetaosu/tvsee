/*
	讲URL带的参数转为全局变量
*/
var URL = window.location.href;
if(URL.indexOf("?")!=-1){ 
	URL = URL.substring(URL.indexOf("?")+1,URL.length);
	URL = decodeURI(URL);
	var tmpArr = URL.split("&"); 
	var tmp = "";
	for (var i = 0;i <= tmpArr.length; i++) {
		tmp = tmpArr[i];
		tmp = "" + tmp;
		var arr = tmp.split("=");
		if(arr[0] != ""){
			if(arr[1] != ""){
				eval(arr[0] + "='" + arr[1] + "'");		
			}else{
				eval(arr[0] + "=''");	
			}
		}
	}
}

/**
		 * 获取标准URL的参数
		 * @_key：字符串，不支持数组参数（多个相同的key）
		 * @_url：字符串，（window）.location.href，使用时别误传入非window对象
		 * @_spliter：字符串，参数间分隔符
		 * 注意：
		 * 	1、如不存在指定键，返回空字符串，方便直接显示，使用时注意判断
		 * 	2、非标准URL勿用（hash部分除外）
		 * 	3、query（？）与hash（#）中存在键值一样时，以数组返回
		 */
function getUrlParams(_key, _url, _spliter) {
    if (typeof(_url) == "object") {
        var url = _url.location.href;
    } else {
        var url = _url ? _url: window.location.href;
    }
    if (url.indexOf("?") == -1 && url.indexOf("#") == -1) {
        return "";
    }
    var spliter = _spliter || "&";
    var haveQuery = false;
    if (url.indexOf("?") != -1) {
        var urlParams = url.split("?")[1];
        if (urlParams.indexOf(spliter) != -1) {
            urlParams = urlParams.split(spliter);
        } else {
            urlParams = [urlParams];
        }
        haveQuery = true;
    } else {
        var urlParams = [url];
    }
    if (urlParams[urlParams.length - 1].indexOf("#") != -1) {
        var urlTemp = urlParams[urlParams.length - 1].split("#");
        urlParams[urlParams.length - 1] = urlTemp[0];
        var hash = urlTemp[1];
        if (hash.indexOf(spliter) != -1) {
            hash = hash.split(spliter);
        } else {
            hash = [hash];
        }
        if (haveQuery == true) {
            urlParams = urlParams.concat(hash);
        } else {
            urlParams = hash;
        }
    }
    var valueArr = [];
    for (var i = 0,
    len = urlParams.length; i < len; i++) {
        var params = urlParams[i].split("=");
        if (params[0] == _key) {
            valueArr.push(params[1]);
        }
    }
    if (valueArr.length > 0) {
        if (valueArr.length == 1) {
            return valueArr[0];
        }
        return valueArr;
    }
    return "";
}

/**
		 * 将秒数格式化为 "HH:mm:SS" 格式
		 * 当然想将分钟格式话为 "HH:mm:SS" ，调用此方法前，将分钟数乘以60
		 */
function secondsToTimeStr(_seconds) {
    _seconds = _seconds / 1000;
    function fullDigit(_num) {
        if (_num < 10) {
            _num = "0" + _num;
        }
        return _num;
    }
    var hour = Math.floor(_seconds / 3600);
    var minute = Math.floor((_seconds - hour * 3600) / 60);
    var second = Math.floor(_seconds - hour * 3600 - minute * 60);
    return fullDigit(hour) + ":" + fullDigit(minute) + ":" + fullDigit(second);
}

function getCharByte(_content, _limit) { //获取字符串的总字节数
	if(typeof(_content) == "undefined"){
		return 0;	
	}
	var byteCount = 0;
	for (var i = 0; i < _content.length; i++) {
		byteCount = (_content.charCodeAt(i) <= 255) ? byteCount + 1 : byteCount + 2;
		if (typeof(_limit) != "undefined") {
			if (byteCount > _limit) {
				return true;
			}
		}
	}
	return byteCount;
}
function subStr(_str, _bytes, _suffix) {
	/**
	 * 以一个汉字为2个字母截取字母汉字混合字符串（临界字符是汉字的话，不返回这个汉字，所以返回长度可能少一字节）
	 *在utf-8页面编码下，误把一个汉字当3 Byte处理
	 * @_bytes：字节数
	 */
	if (!_str) {
		return "";
	}
	if (!_bytes) {
		return _str;
	}
	var charLen = 0; //预期计数：中文2字节，英文1字节
	var tempStr = ""; //临时字串
	for (var i = 0; i < _str.length; i++) {
		if (_str.charCodeAt(i) > 255) { //按照预期计数增加2
			charLen += 2;
		} else {
			charLen++;
		}
		if (charLen > _bytes) { //如果增加计数后长度大于限定长度，就直接返回临时字符串
			if (_suffix) {
				return tempStr + _suffix;
			}
			return tempStr;
		}
		tempStr += _str.charAt(i); //将当前内容加到临时字符串
	}
	if (_suffix && charLen > _bytes) {
		return _str + _suffix;
	}
	return _str; //如果全部是单字节字符，就直接返回源字符串
}
/*
	将json的对象转换成字符串
*/
function jsonToString(_obj) {
	if (typeof(JSON) == "object" && typeof(JSON.stringify) == "function") {
		return JSON.stringify(_obj);
	}
	var THIS = this;
	switch (typeof(_obj)) {
	case "string":
		return "\"" + _obj.replace(/(["\\])/g, "\\$1") + "\"";
	case "array":
		return "[" + _obj.map(THIS.jsonToString).join(",") + "]";
	case "object":
		if (_obj instanceof Array) {
			var strArr = [];
			var len = _obj.length;
			for (var i = 0; i < len; i++) {
				strArr.push(THIS.jsonToString(_obj[i]));
			}
			return "[" + strArr.join(",") + "]";
		} else if (_obj == null) {
			return "null";
		} else {
			var string = [];
			for (var property in _obj) {
				string.push(THIS.jsonToString(property) + ":" + THIS.jsonToString(_obj[property]));
			}
			return "{" + string.join(",") + "}";
		}
	case "number":
		return _obj;
	default:
		return _obj;
	}
}

function scrollBarClass(_id, _barId, _frame) {
	/**
	 * 显示数据滚动条
	 * @param {string} _id 滚动条外层div的id
	 * @param {string} _barId 滚动条可变部分的id
	 * @param {object} _frame 实例化本类的页面对象
	 */
	_frame = typeof(_frame) == "object" ? _frame : window;
	this.obj = _frame.document.getElementById(_id);
	this.barObj = null;
	if (typeof(_barId) != "undefined") {
		this.barObj = _frame.document.getElementById(_barId);
	}

	this.init = function(_totalNum, _pageSize, _maxBarLength, _startPos, _type) {
		/**
		 * 滚动条对象的初始化
		 * @param {number} _totalNum 所要滑动的总的数据
		 * @param {number} _pageSize 一页所能显示的数据
		 * @param {number} _maxBarLength 滑动条的大小
		 * @param {number} _startPos 滑动条的起始位置
		 * @param {number} _type 是改变top，还是改height的标识，为"undefined"是top，反之为height
		 */
		this.startPos = _startPos;
		var percent = 1;
		if (_totalNum > _pageSize) {
			percent = _pageSize / _totalNum;
		}
		var barLength = percent * _maxBarLength;

		if (typeof(_type) != "undefined") {
			if (this.barObj != null) {
				this.barObj.style.height = Math.round(barLength) + "px";
			} else {
				this.obj.style.height = Math.round(barLength) + "px";
			}
			this.endPos = this.startPos + (_maxBarLength - barLength);
		} else {
			this.endPos = this.startPos + _maxBarLength;
		}

		if (_totalNum > 1) {
			this.footStep = (this.endPos - this.startPos) / (_totalNum - 1);
		} else {
			this.footStep = 0;
		}
	};

	this.scroll = function(_currPos) {
		/**
		 * 滚动条对象的初始化
		 * @param {number} _currPos 当前数据的位置
		 */
		this.obj.style.top = Math.round(this.startPos + this.footStep * _currPos) + "px";
	};
}

function inputClass(_id, _type, _startStr, _cursorImg, _blankImg, _imgHeight, _maxWorld, _frame) {
	/**
	 * 仿真焦点样式字符串输入
	 * @_id：字符串型，焦点DOM的ID
	 * @_type：字符串型，可输入字符的类型，"normal"|"num"|"password"三选一
	 * @_startStr：字符串型，默认就有的字符
	 * @_cursorImg：字符串型，光标gif闪烁图片
	 * @_blankImg：字符串型，空白时显示图片
	 * @_imgHeight：数字型，光标gif闪烁图片的高度
	 * @_maxWorld：数字型，可输入字符串最大长度
	 * @_frame：对象，创建本对象实例的页面对象
	 * 注意：
	 *  1、由于按照部门定义的代码规范执行修改，本类和inputObj基本相同，但不向下兼容
	 *  2、numList，pwdMark可实例化后根据需要进行赋值修改
	 *  3、numList[10]、numList[11]是键盘的功能键符号，可不需要
	 */
	this.id = _id; //输入框对应DOM的id
	this.type = (typeof(_type) == "undefined" ? "normal" : _type); //"normal"|"num"|"password"
	this.startStr = (typeof(_startStr) == "undefined" ? "" : _startStr); //文本框中初始的默认值
	this.cursorImg = (typeof(_cursorImg) == "undefined" ? "input_focus.gif" : _cursorImg); //光标的图片名称，默认为"input_focus.gif"
	this.blankImg = (typeof(_blankImg) == "undefined" ? "global_tm.gif" : _blankImg); //透明图片名称，默认为"global_tm.gif"
	this.imgHeight = (typeof(_imgHeight) == "undefined" ? 20 : _imgHeight); //图片的高度，默认为20
	this.maxWorld = (typeof(_maxWorld) == "undefined" ? 8 : _maxWorld); //定义最多输入的字符数，默认为8
	this.frame = _frame;

	this.numList = [
		["0"],
		[" ", "1"],
		["A", "B", "C", "2", "a", "b", "c"],
		["D", "E", "F", "3", "d", "e", "f"],
		["G", "H", "I", "4", "g", "h", "i"],
		["J", "K", "L", "5", "j", "k", "l"],
		["M", "N", "O", "6", "m", "n", "o"],
		["P", "Q", "R", "S", "7", "p", "q", "r", "s"],
		["T", "U", "V", "8", "t", "u", "v"],
		["W", "X", "Y", "Z", "9", "w", "x", "y", "z"],
		["*"], //10
		["#"] //11
	]; //输入法之间切换的内容
	this.letterList = [
		["a", "A"],
		["b", "B"],
		["c", "C"],
		["d", "D"],
		["e", "E"],
		["f", "F"],
		["g", "G"],
		["h", "H"],
		["i", "I"],
		["j", "J"],
		["k", "K"],
		["l", "L"],
		["m", "M"],
		["n", "N"],
		["o", "O"],
		["p", "P"],
		["q", "Q"],
		["r", "R"],
		["s", "S"],
		["t", "T"],
		["u", "U"],
		["v", "V"],
		["w", "W"],
		["x", "X"],
		["y", "Y"],
		["z", "Z"]
	];
	this.pwdMark = "*"; //输入密码时显示出来的星号

	this.inputStr = this.startStr; //输入的字母
	this.cursorPos = this.inputStr.length; //标记光标的位置

	this.listIndex = -1; //按下的键的位置
	this.inputIndex = 0; //键盘中对应字母的位置
	this.inputTimeout = -1; //输入时的timeout句柄

	/******对光标初始化******/
	this.showCursor = function() {
		this.$(this.id).innerHTML = this.getStr();
	};

	/******对捕获到的键值进行处理，并在输入框中显示******/
	this.getInput = function(_num, _letter) {
		if (this.type == "password" || this.type == "num") { //如果输入的为密码或数字
			if (this.inputStr.length < this.maxWorld) { //当输入字符数不小于maxWorld的时候将不再响应
				this.inputStr = this.inputStr.substr(0, this.cursorPos) + _num + this.inputStr.substr(this.cursorPos);
				this.cursorPos++;
				this.$(this.id).innerHTML = this.getStr();
			}
		} else { //输入的为文字
			var charList = this[_letter ? "letterList" : "numList"];
			if (this.listIndex == _num) { //重复按下同一个键
				if (this.inputStr.length < (this.maxWorld + 1)) { //当输入字符数大于maxWorld的时候将不再响应
					this.inputIndex++;
					if (this.inputIndex >= charList[_num].length) {
						this.inputIndex = 0;
					}
					this.frame.clearTimeout(this.inputTimeout);
					var target = this;
					this.inputTimeout = this.frame.setTimeout(function() {
						target.listIndex = -1;
					}, 800); //超过800毫秒则不认为按的是同一个键
					this.inputStr = this.inputStr.substr(0, (this.cursorPos - 1)) + charList[this.listIndex][this.inputIndex] + this.inputStr.substr(this.cursorPos); //按同一个键的时候只改变inputStr的最后一个字母
					this.$(this.id).innerHTML = this.getStr();
				}
			} else { //否则记录当前键的位置,并把对应的键的字母写入inputStr
				if (this.inputStr.length < this.maxWorld) { //当输入字符数不小于maxWorld的时候将不再响应
					this.listIndex = _num;
					this.frame.clearTimeout(this.inputTimeout);
					var target = this;
					this.inputTimeout = this.frame.setTimeout(function() {
						target.listIndex = -1;
					}, 800); //超过800毫秒则不认为按的是同一个键
					this.inputIndex = 0; //还原inputIndex的值
					this.inputStr = this.inputStr.substr(0, this.cursorPos) + charList[this.listIndex][this.inputIndex] + this.inputStr.substr(this.cursorPos);
					this.cursorPos++;
					this.$(this.id).innerHTML = this.getStr();
				}
			}
		}
	};

	/******删除光标前面的那个文字******/
	this.delInput = function() {
		if (this.inputStr.length > 0 && this.cursorPos > 0) {
			this.cursorPos--;
			this.inputStr = this.inputStr.substr(0, this.cursorPos) + this.inputStr.substr(this.cursorPos + 1);
			this.$(this.id).innerHTML = this.getStr();
		}
	};

	/******移动光标的位置******/
	this.moveInput = function(_num) {
		this.cursorPos += _num;
		if (this.cursorPos < 0) {
			this.cursorPos = 0;
		} else if (this.cursorPos > this.inputStr.length) {
			this.cursorPos = this.inputStr.length;
		}
		this.$(this.id).innerHTML = this.getStr();
	};

	/******为了让光标在左右移动过程中不出现字体晃动的现象，在每个字符之间都加入了一个和光标大小一样的透明图片，下面函数主要是实现这个功能******/
	this.getStr = function() {
		var bImg = '<img src="' + this.blankImg + '" alt="" height="' + this.imgHeight + '" width="2" />';
		var cImg = '<img src="' + this.cursorImg + '" alt="" height="' + this.imgHeight + '" width="2" />';
		var tempStr = ((this.cursorPos > 0) ? bImg : cImg);
		if (this.type == "password") { //如果输入的为密码
			for (var i = 0; i < this.inputStr.length; i++) {
				if (i == (this.cursorPos - 1)) {
					tempStr += this.pwdMark + cImg;
				} else {
					tempStr += this.pwdMark + bImg;
				}
			}
		} else if (this.type == "num") {
			for (var i = 0; i < this.inputStr.length; i++) {
				if (i == (this.cursorPos - 1)) {
					tempStr += this.inputStr.charAt(i) + cImg;
				} else {
					tempStr += this.inputStr.charAt(i) + bImg;
				}
			}
		} else {
			if (this.cursorPos > 0) {
				for (var i = 0; i < (this.cursorPos - 1); i++) {
					tempStr += this.inputStr.substr(i, 1) + bImg;
				}
				tempStr += this.inputStr.substr((this.cursorPos - 1), 1) + cImg;
			}
			for (var j = this.cursorPos; j < this.inputStr.length; j++) {
				tempStr += this.inputStr.substr(j, 1) + bImg;
			}
		}
		return tempStr;
	};

	/******定义失去焦点时的操作******/
	this.loseFocus = function() {
		var bImg = '<img src="' + this.blankImg + '" alt="" height="' + this.imgHeight + '" width="2" />';
		var tempStr = bImg;
		if (this.type == "password") { //如果输入的为密码
			for (var i = 0; i < this.inputStr.length; i++) {
				tempStr += this.pwdMark + bImg;
			}
		} else {
			for (var i = 0; i < this.inputStr.length; i++) {
				tempStr += this.inputStr.charAt(i) + bImg;
			}
		}
		this.$(this.id).innerHTML = tempStr;
	};

	/******简单的定义一个获取id的方法******/
	this.$ = function(_id) {
		if (this.frame) {
			return this.frame.document.getElementById(_id);
		}
		return document.getElementById(_id);
	};
}

function showListClass(_args){
	this.dataLength = _args.dataLength; //数据长度
	this.dataPos = _args.dataPos || 0;  //焦点在那条数据上面
	this.listPos = _args.listPos || 0;  //焦点在那个div上面
	this.frame = _args.frame || window; //对象
	this.isPage = _args.isPage || false; //是否翻页  false为不翻页  true为翻页
	this.isArrow = _args.isArrow || false; //是否带箭头 false为不带  true带  如果是翻页，就带当前页，与总页数
	this.isAutoPage = _args.isAutoPage || false; //是否自动翻页
	this.isMoveEndHandler  = _args.isMoveEndHandler || false;//如果指显示固定几个元素，但移动到最末端是否进行处理
	this.isGetFocus = false; //是否获得焦点
	this.moveEndHandler = _args.moveEndHandler || function(){};
	this.haveData = _args.haveData || function(){};
	this.noData = _args.noData || function(){};
	this.showArrow = _args.showArrow || function(){};
	this.setFocusStyle = _args.setFocusStyle || function(){};//设置样式焦点点
	this.currentNo = _args.currentNo || 1;//当前页数
	this.totalNo =  0;//总页数
	this.listSize = _args.listSize;//每页显示的条数
	this.initData = function(){
		if(this.isPage == true){
			this.totalNo = Math.ceil(this.dataLength / this.listSize); 
			this.currentNo = this.dataPos == 0 ? 1 : Math.ceil((this.dataPos + 1) / this.listSize);
		}
		this.showListData();
	}
	this.showListData = function(){
		var pos = this.dataPos - this.listPos;
		var size = this.dataLength > this.listSize ? this.listSize : this.dataLength;
		if(this.isPage == true){
			if(this.totalNo == this.currentNo){
				size = this.dataLength % this.listSize == 0 ? this.listSize : this.dataLength % this.listSize; 
			}
		}
		var j = 0;
		for(var i = pos;i < pos + size; i++){
			this.haveData({dataPos:i, listPos:j});
			j++;
		}	
		for(var i = j;i < this.listSize; i++){
			this.noData(i);	
		}	
		this.changeShowArrow();
	}
	
	this.changePos = function(_num){ 
		var oldListPos = this.listPos;
		var oldDataPos = this.dataPos;
		this.listPos += _num; 
		if(this.listPos < 0){
			this.listPos = 0; 
		    if(this.isPage == true){ 
				if(this.isAutoPage == true){
					if(this.currentNo == 1){
						return;
					} 						
					this.dataPos = (this.currentNo - 2) * this.listSize;
					this.currentNo--;
				}else{
					this.changeEndHandler(-1);	
				}
			}else{
				this.dataPos += _num;						
				if(this.dataPos < 0){ 
					this.dataPos = 0;
					this.changeEndHandler(-1);
					return;	
				}			
			}
			this.showListData();
			this.setFocusStyle({listPos: this.listPos, dataPos: this.dataPos, oldListPos: oldListPos, oldDataPos: oldDataPos}, this.isGetFocus);
		}else if(this.listPos >= this.listSize){
			this.listPos = this.listSize - 1;
			if(this.isPage == true){
				if(this.isAutoPage == true){
					if(this.currentNo >= this.totalNo){
						return;	
					}
					this.dataPos = (this.currentNo) * this.listSize;
					this.listPos = 0;
					this.currentNo++;
				}else{
					this.changeEndHandler(1);	
				}
			}else{
				this.dataPos += _num;
				if(this.dataPos >= this.dataLength){
					this.dataPos--;
					this.changeEndHandler(1);
					return;
				}
			}
			this.showListData();
			this.setFocusStyle({listPos: this.listPos, dataPos: this.dataPos, oldListPos: oldListPos, oldDataPos: oldDataPos}, this.isGetFocus);
		}else{
			this.dataPos += _num;
			if(this.dataPos >= this.dataLength){
				this.dataPos--;
				this.listPos--;
				this.changeEndHandler(1);
				return;	
			}
			this.setFocusStyle({listPos: this.listPos, dataPos: this.dataPos, oldListPos: oldListPos, oldDataPos: oldDataPos}, this.isGetFocus);
		}			
	}
	this.changePage = function(_num){
		var oldListPos = this.listPos;
		var oldDataPos = this.dataPos;
		this.currentNo += _num;
		if(this.currentNo < 1){
			this.currentNo = 1;
			return;	
		}else if(this.currentNo > this.totalNo){
			this.currentNo = this.totalNo;	
			return;
		}else{
			this.dataPos = (this.currentNo - 1) * this.listSize;
			this.listPos = 0;
			this.showListData();
			this.setFocusStyle({listPos: this.listPos, dataPos: this.dataPos, oldListPos: oldListPos, oldDataPos: oldDataPos}, this.isGetFocus);
		}
	}
	this.changeShowArrow = function(){
		if(this.isArrow == true){
			if(this.isPage == true){
				this.showArrow({current: this.currentNo, totalNo: this.totalNo});	
			}else{
				this.showArrow({listPos: this.listPos, dataPos: this.dataPos});	
			}
		}
	}
	this.changeEndHandler = function(_num){
		if(this.isMoveEndHandler == true){
			this.moveEndHandler(_num, this.getParamsValue());	
		}
	}
	this.changeLoseFocus = function(){
		this.isGetFocus = false;
		this.setFocusStyle(this.getParamsValue(), false);
	}
	this.changeGetFocus = function(){
		this.isGetFocus = true;
		this.setFocusStyle(this.getParamsValue(), true);
	}
	this.getParamsValue = function(){
		if(this.isPage == true){
			return {listPos: this.listPos, dataPos: this.dataPos, current: this.currentNo, totalNo: this.totalNo};
		}else{
			return {listPos: this.listPos, dataPos: this.dataPos};
		}
	}
}

/*
	不停循环滚动数组对象
*/
function cycleMoveClass(_args){
	this.changeArrs = _args.changeArrs; //需要调换位置的数组
	this.haveData = _args.havaData || function(){};
	this.initPos = _args.initPos || 0;
	this.listSize = _args.listSize;
	this.setFocusStyle = _args.setFocusStyle || function(){};
	this.initData = function(){
		this.changePos(this.initPos);	
	}
	this.changePos = function(_num){
		if(_num != 0){
			for(var i = 0; i < Math.abs(_num); i++){
				for(var j = 0;j < this.changeArrs.length; j++){
					if(_num > 0){
						this.changeArrs[j].unshift(this.changeArrs[j][this.listSize - 1]);
						this.changeArrs[j].pop();
					}else{
						this.changeArrs[j].push(this.changeArrs[j][0]);
						this.changeArrs[j].shift(0);
					}
				}
			}
		}
		this.showListData();
	}
	this.showListData = function(){
		for(var i = 0; i < this.listSize; i++){
			this.haveData({listPos: i, dataPos: i});	
		}
	}
	this.changeGetFocus = function(){
		this.setFocusStyle(Math.ceil(this.listSize / 2),true)	
	}
}
/*
@obj: 为图片对象
此方法只试用于绝对定位,等比缩放图片的大小
*/
function fImageSizeToDiv(obj){
	 this.fImageAutoSize = function(_obj, _objParent){
	 		if(_objParent == null)return;
			var nMaxWidth = _objParent.clientWidth;
			var nMaxHeight = _objParent.clientHeight;
			var nImgOldRate = nMaxWidth / nMaxHeight;
			var nImgNewRate = _obj.offsetWidth / _obj.offsetHeight;
			if (nImgNewRate >= nImgOldRate) {
				_obj.style.height = Math.round(nMaxWidth / nImgNewRate) + "px";
				_obj.style.width = nMaxWidth +"px";
				_obj.style.marginTop = Math.round(( nMaxHeight - nMaxWidth / nImgNewRate) / 2) + "px";
			}else{
				_obj.style.width = Math.round(nMaxHeight * nImgNewRate) + "px";
				_obj.style.height = nMaxHeight + "px";
				_obj.style.marginLeft = Math.round((nMaxWidth - nMaxHeight * nImgNewRate) / 2) +"px";
			}   
	   }
	   var objParent = obj.offsetParent;
	  // fImageAutoSize(obj, objParent);
	   this.fImageAutoSize(obj, objParent);
	   obj.style.visibility = "visible";
}


/*
	@_obj:滑动的对象
	@_json:改变滑动的json如:{left:30}
	@_fn: 滑动制定的地方，需要做的事情
*/
function startMove(_obj, _json, _fn){
	_obj.style.webkitTransitionDuration = "200ms";
	for(var attr in _json){
		_obj.style[attr] = _json[attr] + 'px';
	}
	window.clearTimeout(_obj.timeout);
	_obj.timeout = setTimeout(function(){
		_fn();
	},200);
  /* clearInterval(_obj.timer);
   _obj.timer = setInterval(function(){
       var iCur = 0;
	   var bStop = true;
       for(var attr in _json){
		  iCur = parseInt(getStyle(_obj, attr));
		  var iSpeed = (_json[attr] - iCur) / 3;
		  iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
		  if(iCur != _json[attr]){
		     bStop = false;
		  }
		   _obj.style[attr] = iCur + iSpeed + 'px';
	   }
	   if(bStop){
		   clearInterval(_obj.timer);
		   if(_fn){
			   _fn();
			}
		}
   },5);*/
}
/*
	@_obj: 对象
	@_attr: 要获取到style的属性值
*/
function getStyle(_obj, _attr){
   if(_obj.currentStyle){
     return _obj.currentStyle[_attr];
   }else{
	  if(typeof(getComputedStyle) == "function"){
		return getComputedStyle(_obj, false)[_attr]; 
	  }else{
		return _obj.style[_attr];
	  }
   }
}

function marqueeScroll(_value){
	return "<marquee behavior='scorll' scrollamount=3 >" + _value + "</marquee>";
}
/*
	@_objId:字符串型，焦点DOM的ID
	@_str: 显示的长度
	@_size: 超出长度如何显示
	@_suffix: 超出用什么替换
	 注销部分为另外一种方式，缺陷在于不停的div里面插入内容.
*/
function marqueeClass(_objId, _str, _size, _suffix){
	this.id = _objId;
	this.str = _str;
	this.size = _size;
	this.intervalout = -1;
	this.suffix = _suffix || "";
	this.idArr = ["marqueeId0", "marqueeId1"];
	this.isId0Left = 0;
	this.width = 0;
	this.scroll = function(){
		var obj = document.getElementById(this.id);
		if(obj == null){
			return;	
		}
		//if(getCharByte(this.str) > this.size){
			if(obj.style.overflow == "" || obj.style.overflow == null){
				obj.style.overflow = "hidden";
			}
			if(obj.style.whiteSpace == "" || obj.style.whiteSpace == null){
				obj.style.whiteSpace = "nowrap";
			}
			obj.innerHTML = "<div id='marqueeId0' style='width:auto; height:100%; position: absolute; left: 0px; top: 0px;'>"+this.str+"</div>";
			this.width = document.getElementById("marqueeId0").clientWidth;
			obj.innerHTML += "<div id='marqueeId1' style='width:auto; height:100%; position: absolute; left: "+(this.width + 20)+"px; top: 0px;'>"+this.str+"</div>";
			//obj.innerHTML = this.str + "&nbsp;&nbsp;" + this.str;
			var self = this;
	 		this.intervalout = setInterval(function(){
				self.scrollInterval(self.id, self.width, self.idArr, self);	
				//self.scrollInterval(self.id);
			}, 30);
		//}else{
		//	obj.innerText = this.str;	
		//}
	}
	this.removeScroll = function(){
		if(getCharByte(this.str) < this.size){
			return;
		}
		window.clearInterval(this.intervalout);
		if(document.getElementById(this.id) == null){
			return;
		}
		if(typeof(this.size) == "undefined"){
			document.getElementById(this.id).innerHTML = "";	
		}else{
			document.getElementById(this.id).innerHTML = subStr(this.str, this.size, this.suffix);
		}
	}
	this.scrollInterval = function(_id, _width, _ids, _obj){
		if(document.getElementById(_ids[_obj.isId0Left]) == null || typeof(document.getElementById(_ids[_obj.isId0Left])) == "undefined"){
			window.clearInterval(this.intervalout);
			return;	
		}
		var left = parseInt(document.getElementById(_ids[_obj.isId0Left]).style.left, 10);
		left--;
		document.getElementById(_ids[_obj.isId0Left]).style.left =  left + "px";
		if(_obj.isId0Left == 0){
			left = parseInt(document.getElementById(_ids[1]).style.left, 10);
			left--;
			document.getElementById(_ids[1]).style.left = left + "px";	
		}else{
			left = parseInt(document.getElementById(_ids[0]).style.left, 10);
			left--;
			document.getElementById(_ids[0]).style.left = left + "px";		
		}
		if(parseInt(document.getElementById(_ids[_obj.isId0Left]).style.left, 10) < -_width ){
			document.getElementById(_ids[_obj.isId0Left]).style.left = (_width + 20) + "px";
			if(_obj.isId0Left == 0){
				_obj.isId0Left = 1;
			}else{
				_obj.isId0Left = 0;	
			}
		}
		/*var tmp = (obj.scrollLeft)++;
		if (obj.scrollLeft == tmp){		//当滚动条到达右边顶端时
			obj.innerHTML += obj.innerHTML;
		}
		//obj.firstChild.offsetWidth 此不起到作用
		if (obj.scrollLeft >= obj.firstChild.offsetWidth){//当滚动条滚动了初始内容的宽度时滚动条回到最左端
			obj.scrollLeft = 0;
		}*/
	}
}

/*
 * 此对象适用焦点要求滑动，焦点一直在中间显示，支持循环滚动
 * @_ids(array) 必选		总的数据的长度
 * @_dataLength(number) 必选		数据的长度
 * @_showSize(number) 必选 		显示的长度
 * @_posInfo(array) 必选 		整个滑动对象坐标位置
 * @_posInfo(number) 必选		焦点的初始位置
 * @_dataPos(number) 可选		初始数据焦点位置
 * @_showFlag(number) 可选	 	滑动标志,1: 上下滑动，0：左右滑动
 * @_showHalfObjSize(string)	中间距离两边显示内容的个数
 * @_startSpaces(array) 必选	     距离最尾端与前端的 位置 距离置
 * @_haveData(function) 必选		有数据时调用的方法
 * @_moveStartCallback(function)可选   滑动效果结束后的操作
 */
function  loopGlideClass(_args){
	this.ids = _args.ids;
	this.dataLength = _args.dataLength;
	this.showSize = _args.showSize || 3;
	this.posInfo = _args.posInfo;
	this.showFlag = _args.showFlag; //0左右滑动  1上下滑动
	this.showHalfObjSize = (this.showSize - 1) / 2;
	this.startSpaces = _args.startSpaces;
	this.dataPos = _args.dataPos || 0;
	this.havaData = _args.havaData || function(){};
	this.moveStartCallback = _args.moveStartCallbac || function(){}; 
	this.getFocusId = null;
	this.initData = function(){
		/*for(var i = 0; i < this.ids.length; i++){
			document.getElementById(this.ids[i]).style.webkitTransitionDuration = 300 + "ms";	
		}*/
		this.showList();
	}
	this.changePos = function(_num){
		this.dataPos += _num;
		if(this.dataPos < 0){
			this.dataPos = this.dataLength - 1;	
		}else if(this.dataPos >= this.dataLength){
			this.dataPos = 0;	
		}
		if(_num > 0){
			//document.getElementById(this.ids[this.ids.length - 1]).style.webkitTransitionDuration = 0 + "ms";
			document.getElementById(this.ids[0]).style[["left","top"][this.showFlag]] =  this.startSpaces[1] + "px";
			//document.getElementById(this.ids[0]).style.webkitTransitionDuration = 300 + "ms";
			this.ids.push(this.ids[0]);
			this.ids.shift(0);
		}else if(_num < 0){
			//document.getElementById(this.ids[0]).style.webkitTransitionDuration = 0 + "ms";
			document.getElementById(this.ids[this.ids.length - 1]).style[["left","top"][this.showFlag]] =  this.startSpaces[0] + "px";
			//document.getElementById(this.ids[this.ids.length - 1]).style.webkitTransitionDuration = 300 + "ms";
			this.ids.unshift(this.ids[this.ids.length - 1]);
			this.ids.pop();	
			
		}
		this.showList(_num);
	}
	this.showList = function(_num){
		if(typeof(_num) != "undefined"){
			var minusDataPos = this.dataPos + this.showHalfObjSize;
			var plusDataPos = this.dataPos - this.showHalfObjSize;
			for(var i = 0; i < 1; i++){//_num < 0  || > 0 只处理最后一位
				if(_num < 0){
					if(plusDataPos < 0){
						plusDataPos =  this.dataLength  - 1;		
					}
					this.haveData({id: this.ids[0], dataPos: plusDataPos});	
				}else if(_num > 0){
					if(minusDataPos > this.dataLength - 1){
						minusDataPos = minusDataPos - this.dataLength ;
					}
					this.haveData({id:this.ids[this.ids.length - 1], dataPos: minusDataPos});
				}
			}
		}else{
			var minusDataPos = this.dataPos;
			var plusDataPos = this.dataPos;
			for(var i = 0; i < this.showHalfObjSize; i++){
				minusDataPos--;
				if(minusDataPos < 0){
					this.haveData({id: this.ids[this.showHalfObjSize - i - 1], dataPos: this.dataLength + minusDataPos});	
				}else{
					this.haveData({id: this.ids[this.showHalfObjSize - i - 1], dataPos: minusDataPos});	
				}
				plusDataPos++;
				if(plusDataPos > this.dataLength - 1){
					this.haveData({id: this.ids[this.showHalfObjSize + 1 + i], dataPos: plusDataPos - this.dataLength + 1});
				}else{
					this.haveData({id: this.ids[this.showHalfObjSize + 1 + i], dataPos: plusDataPos});	
				}
			}
			this.haveData({id: this.ids[this.showHalfObjSize], dataPos: this.dataPos});
		}
		for(var i = 0; i < this.ids.length; i++){
			//document.getElementById(this.ids[i]).style.webkitTransitionDuration = 300 + "ms";	
			if(this.showFlag == 0){
				if(i == this.ids.length - 1){
					startMove(document.getElementById(this.ids[i]), {"left" : this.posInfo[i]["left"]}, this.moveStartCallback);	
				}else{
					startMove(document.getElementById(this.ids[i]), {"left" : this.posInfo[i]["left"]});		
				}
				/*document.getElementById(this.ids[i]).style.left = this.posInfo[i]["left"] + "px";
				if(i == this.ids.length - 1){
					var self = this;
					setTimeout(function(){
						self.moveStartCallback();
					},300);
				}*/
			}else{
				//document.getElementById(this.ids[i]).style.left = this.posInfo[i]["top"] + "px";
				if(i == this.ids.length - 1){
					startMove(document.getElementById(this.ids[i]), {"top" : this.posInfo[i]["top"]}, this.moveStartCallback);
				}else{
					startMove(document.getElementById(this.ids[i]), {"top" : this.posInfo[i]["top"]});
				}
				/*if(i == this.ids.length - 1){
					var self = this;
					setTimeout(function(){
						self.moveStartCallback();
					},300);
				}*/
			}
		}
		this.getFocusId = this.ids[this.showHalfObjSize];
	}
	this.getCurrFocusId = function(){
		return 	this.ids[this.showHalfObjSize];
	}
	this.getPreFocusId = function(){
		return this.ids[this.showHalfObjSize - 1]
	}
	this.getNextFocusId = function(){
		return this.ids[this.showHalfObjSize + 1]
	}
}

function hashTableClass(_maxLength) {
	/**
	 * 仿写java中的hashmap对象，在eventFrame里进行数据缓存
	 * @_maxLength：整型，缓存条目数量
	 * 注意：
	 * 	1、自行判定条目是否已存在，控制是否覆盖数据（也可在使用put方法时传入第三个布尔参数进行控制），否则将视为更新已存在的数据
	 * 	2、delete系统方法，可能不被一些vane版本中间件支持
	 */
	this.maxLength = typeof(_maxLength) == "undefined" ? 50 : _maxLength;

	this.hash = new Object();
	this.arry = new Array(); //记录条目数量

	this.put = function(_key, _value, _notCover) {
		/**
		 * @_key：字符串型
		 * @_value：不限制类型
		 * @_notCover：布尔型，设定为真后不进行覆盖
		 */
		if (typeof(_key) == "undefined") {
			return false;
		}
		if (this.contains(_key) == true) {
			if (_notCover) {
				return false;
			}
		}
		this.limit();
		if (this.contains(_key) == false) {
			this.arry.push(_key);
		}
		this.hash[_key] = typeof(_value) == "undefined" ? null : _value;
		return true;
	};
	this.get = function(_key) {
		if (typeof(_key) != "undefined") {
			if (this.contains(_key) == true) {
				return this.hash[_key];
			} else {
				return false;
			}
		} else {
			return false;
		}
	};
	this.remove = function(_key) {
		if (this.contains(_key) == true) {
			delete this.hash[_key];
			for (var i = 0, len = this.arry.length; i < len; i++) {
				if (this.arry[i] == _key) {
					this.arry.splice(i, 1);
					break;
				}
			}
			return true;
		} else {
			return false;
		}
	};
	//this.count = function() {var i = 0; for(var key in this.hash) {i++;} return i;};
	this.contains = function(_key) {
		return typeof(this.hash[_key]) != "undefined";
	};
	this.clear = function() {
		this.hash = {};
		this.arry = [];
	};
	this.limit = function() {
		if (this.arry.length >= this.maxLength) { //保存的对象数大于规定的最大数量
			var key = this.arry.shift(); //删除数组第一个数据，并返回数组原来第一个元素的值
			this.remove(key);
		}
	};
}

function ajaxClass(_url, _successCallback, _failureCallback, _urlParameters, _callbackParams, _async, _charset, _timeout, _frequency, _requestTimes, _frame) {
	/**
	 * AJAX通过GET或POST的方式进行异步或同步请求数据
	 * 注意：
	 * 	1、服务器240 No Content是被HTTP标准视为请求成功的
	 * 	2、要使用responseXML就不能设置_charset，需要直接传入null
	 * 	3、_frame，就是实例化本对象的页面对象，请尽量保证准确，避免出现难以解释的异常
	 */
	/**
	 * @param{string} _url: 请求路径
	 * @param{function} _successCallback: 请求成功后执行的回调函数，带一个参数（可扩展一个）：new XMLHttpRequest()的返回值
	 * @param{function} _failureCallback: 请求失败/超时后执行的回调函数，参数同成功回调，常用.status，.statusText
	 * @param{string} _urlParameters: 请求路径所需要传递的url参数/数据
	 * @param{*} _callbackParams: 请求结束时在回调函数中传入的参数，自定义内容
	 * @param{boolean} _async: 是否异步调用，默认为true：异步，false：同步
	 * @param{string} _charset: 请求返回的数据的编码格式，部分iPanel浏览器和IE6不支持，需要返回XML对象时不能使用
	 * @param{number} _timeout: 每次发出请求后多长时间内没有成功返回数据视为请求失败而结束请求（超时）
	 * @param{number} _frequency: 请求失败后隔多长时间重新请求一次
	 * @param{number} _requestTimes: 请求失败后重新请求多少次
	 * @param{object} _frame: 窗体对象，需要严格控制，否则会有可能出现页面已经被销毁，回调还执行的情况
	 */
	this.url = _url || "";
	this.successCallback = _successCallback || function(_xmlHttp, _params) {
		tvsee.debug("[xmlHttp] responseText: " + _xmlHttp.responseText);
	};
	this.failureCallback = _failureCallback || function(_xmlHttp, _params) {
		tvsee.debug("[xmlHttp] status: " + _xmlHttp.status + ", statusText: " + _xmlHttp.statusText);
	};
	this.urlParameters = _urlParameters || "";
	this.callbackParams = _callbackParams || null;
	this.async = typeof(_async) == "undefined" ? true : _async;
	this.charset = _charset || null;
	this.timeout = _timeout || 30000; //30s
	this.frequency = _frequency || 10000; //10s
	this.requestTimes = _requestTimes || 1;
	this.frame = _frame || window;

	this.timer = -1;
	this.counter = 0;

	this.method = "GET";
	this.headers = null;
	this.username = "";
	this.password = "";

	this.createXmlHttpRequest = function() {
		var xmlHttp = null;
		try { //Standard
			xmlHttp = new XMLHttpRequest();
		} catch (exception) { //Internet Explorer
			try {
				xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (exception) {
				try {
					xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (exception) {
					return false;
				}
			}
		}
		return xmlHttp;
	};
	this.xmlHttp = this.createXmlHttpRequest();

	this.requestData = function(_method, _headers, _username, _password) {
		/**
		 * @param{string} _method: 传递数据的方式，POST/GET
		 * @param{string} _headers: 传递数据的头信息，json格式
		 * @param{string} _username: 服务器需要认证时的用户名
		 * @param{string} _password: 服务器需要认证时的用户密码
		 */
		this.frame.clearTimeout(this.timer);
		this.method = typeof(_method) == "undefined" ? "GET" : (_method.toLowerCase() == "post") ? "POST" : "GET";
		this.headers = typeof(_headers) == "undefined" ? null : _headers;
		this.username = typeof(_username) == "undefined" ? "" : _username;
		this.password = typeof(_password) == "undefined" ? "" : _password;

		var target = this;
		this.xmlHttp.onreadystatechange = function() {
			target.stateChanged();
		};
		if (this.method == "POST") { //encodeURIComponent
			var url = encodeURI(this.url);
			var data = this.urlParameters;
		} else {
			var url = encodeURI(this.url + (((this.urlParameters != "" && this.urlParameters.indexOf("?") == -1) && this.url.indexOf("?") == -1) ? ("?" + this.urlParameters) : this.urlParameters));
			var data = null;
		}
		if (this.username != "") {
			this.xmlHttp.open(this.method, url, this.async, this.username, this.password);
		} else {
			this.xmlHttp.open(this.method, url, this.async);
		}
		var contentType = false;
		if (this.headers != null) {
			for (var key in this.headers) {
				if (key.toLowerCase() == "content-type") {
					contentType = true;
				}
				this.xmlHttp.setRequestHeader(key, this.headers[key]);
			}
		}
		if (!contentType) {
			this.xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		}
		if (this.charset != null) { //要使用responseXML就不能设置此属性
			this.xmlHttp.overrideMimeType("text/html; charset=" + this.charset);
		}
		tvsee.debug("[xmlHttp] " + this.method + " url: " + url + ", data: " + data);
		this.xmlHttp.send(data);
	};
	this.stateChanged = function() { //状态处理
		if (this.xmlHttp.readyState < 2) {
			tvsee.debug("[xmlHttp] readyState=" + this.xmlHttp.readyState);
		} else {
			tvsee.debug("[xmlHttp] readyState=" + this.xmlHttp.readyState + ", status=" + this.xmlHttp.status);
		}

		var target = this;
		if (this.xmlHttp.readyState == 2) {
			this.timer = this.frame.setTimeout(function() {
				target.checkStatus();
			}, this.timeout);
		} else if (this.xmlHttp.readyState == 3) {
			if (this.xmlHttp.status == 401) {
				tvsee.debug("[xmlHttp] Authentication, need correct username and pasword");
			}
		} else if (this.xmlHttp.readyState == 4) {
			this.frame.clearTimeout(this.timer);
			if (this.xmlHttp.status == 200 || this.xmlHttp.status == 204) {
				this.success();
			} else {
				this.failed();
			}
		}
	};
	this.success = function() {
		if (this.callbackParams == null) {
			this.successCallback(this.xmlHttp);
		} else {
			this.successCallback(this.xmlHttp, this.callbackParams);
		}
		this.counter = 0;
	};
	this.failed = function() {
		if (this.callbackParams == null) {
			this.failureCallback(this.xmlHttp);
		} else {
			this.failureCallback(this.xmlHttp, this.callbackParams);
		}
		this.counter = 0;
	};
	this.checkStatus = function() { //超时处理，指定时间内没有成功返回信息按照失败处理
		if (this.xmlHttp.readyState != 4) {
			if (this.counter < this.requestTimes) {
				this.requestAgain();
			} else {
				tvsee.debug("[xmlHttp] readyState=" + this.xmlHttp.readyState + ", status=" + this.xmlHttp.status + " timeout");
				this.failed();
				this.requestAbort();
			}
		}
	};
	this.requestAgain = function() {
		this.requestAbort();
		var target = this;
		this.frame.clearTimeout(this.timer);
		this.timer = this.frame.setTimeout(function() {
			tvsee.debug("[xmlHttp] request again");
			target.counter++;
			target.requestData(target.method, target.headers, target.username, target.password);
		}, this.frequency);
	};
	this.requestAbort = function() {
		tvsee.debug("[xmlHttp] call abort");
		this.frame.clearTimeout(this.timer);
		this.xmlHttp.abort();
	};
	this.addParameter = function(_json) {
		/**
		 * @param{object} _json: 传递的参数数据处理，只支持json格式
		 */
		var url = this.url;
		var str = this.urlParameters;
		for (var key in _json) {
			if (url.indexOf("?") != -1) {
				url = "";
				if (str == "") {
					str = "&" + key + "=" + _json[key];
				} else {
					str += "&" + key + "=" + _json[key];
				}
				continue;
			}
			if (str == "") {
				str += "?";
			} else {
				str += "&";
			}
			str += key + "=" + _json[key];
		}
		this.urlParameters = str;
		return str;
	};
}
/*** 获取终端信息 ***/
function getStbInfo(){
	var vMac = "";
	var vStbId = "";
	var vCardNo = "";
	vMac = tvsGlobalVar.get("ca_mac"); 
	if(typeof(vMac) == "undefined" || vMac == "") {
		vMac = "FFFFFFFFFFFF";
	}
	vStbId = tvsGlobalVar.get("ca_stbid"); 
	if(typeof(vStbId) == "undefined" || vStbId == "") {
		vStbId = "010000000000001";
	}
	vCardNo = tvsGlobalVar.get("ca_cardno");
	if(typeof(vCardNo) == "undefined" || vCardNo == "") {
		vCardNo = "888888888888888888";
	}
	return {'stbId': vStbId, 'mac': vMac, 'cardno': vCardNo};
}

function listSlide(_args){
	this.dataLength = _args.dataLength;
	this.listSize = _args.listSize;  //显示的div少 1
	this.slideObjId = _args.slideObjId; //滑动id
	this.haveData = _args.haveData || function(){};
	this.noData = _args.noData || function(){};
	this.listHigh = _args.listHigh; //滑动距离
	this.showFlag = 0; //0:上下移动  1:左右移动
	this.dataPos = _args.dataPos || 0; 
	this.idArr = _args.idArr || []; //滑动div数组
	this.slideDire = ["top", "left"][this.showFlag];
	this.frame = _args.frame || window;
	this.duration = _args.duration || "200ms"; //每次滑动的耗时
	this.idPos = 0;
	this.frame.$ = function(_id){
		return document.getElementById(_id);
	}
	this.initData = function(){
		$(this.slideObjId).style.webkitTransitionDuration = this.duration;
		this.showList();	
	}
	this.showList = function(){
		var showSize = this.listSize + 1;
		if(this.dataLength < showSize){
			showSize = this.dataLength;	
		}
		for(var i = 0; i < showSize; i++){
			this.haveData({dataPos: i, idPos: this.idArr[i]});
		}	
		for(var i = showSize; i < this.listSize + 1; i++){
			this.haveData({idPos: this.idArr[i]});
		}
	}
	this.changeList = function(_num){
		if((this.dataPos == 0 && _num < 0) || (this.dataPos == this.dataLength - 1 && _num > 0)){
			return;	
		}
		if(this.dataPos != 0){
			if(this.dataLength > this.idArr.length){
				if(_num < 0){
					if(this.dataLength - this.dataPos >= this.listSize && this.dataPos != 1){
						$(this.idArr[this.idArr.length - 1]).style[this.slideDire] = (parseInt($(this.idArr[0]).style[this.slideDire], 10) - this.listHigh) + "px";
						this.haveData({dataPos: this.dataPos - 2, idPos: this.idArr[this.idArr.length - 1]});
						this.idArr.unshift(this.idArr[this.idArr.length - 1]);
						this.idArr.pop();
					}
				}else{
					if(this.dataPos + this.listSize < this.dataLength){
						$(this.idArr[0]).style[this.slideDire] = (parseInt($(this.idArr[this.idArr.length - 1]).style[this.slideDire], 10) + this.listHigh) + "px";
						this.haveData({dataPos: this.dataPos + this.listSize, idPos: this.idArr[0]});
						this.idArr.push(this.idArr[0]);	
						this.idArr.shift(0);
					}
				}
				for(var i = 0; i < this.idArr.length; i++){
					$(this.idArr[i]).style[this.slideDire] = (parseInt($(this.idArr[i]).style[this.slideDire], 10)) + "px";
				}
			}	
		}
		this.idPos += _num;
		if(this.idPos < 0){
			this.idPos = this.listSize;	
		}else if(this.idPos > this.listSize){
			this.idPos = 0;	
		}
		this.dataPos += _num;
		$(this.slideObjId).style[this.slideDire] = (- this.dataPos * this.listHigh) + "px";
	}
	this.getFocusPos = function() {
		return {
			idPos: this.idPos,
			dataPos: this.dataPos
		};
	};
}
/*
 * 此对象适用焦点要求滑动，然后到末端又要求执行整个列表滑动的效果
 * @_dataLength(number) 必选		总的数据的长度
 * @_listSize(number) 必选		可见列表的长度
 * @_focusPos(number) 可选       焦点初始位置
 * @_dataPos(number) 可选		初始数据焦点位置
 * @_frame(object) 可选			对象所在窗体
 * @_haveData(function) 必选		有数据时调用的方法
 * @_noData(function) 必选		无数据时调用的方法
 * {dataLength:a, listSize:b, dataPos:c, focusPos:d, duration:e, frame:window, haveData:f, noData:g, showFocus: h}
 */
function showListLoop(_args){
	this.dataLength = _args.dataLength; //数据的长度
	this.listSize = _args.listSize; //需要显示的列表的长度
	this.dataPos = _args.dataPos || 0; //数据焦点的位置
	this.focusPos = _args.focusPos || 0; //焦点初始的位置
	this.frame = _args.frame || window; //当前窗体
	this.haveData = _args.haveData || function() {}; //有数据时调用的方法
	this.noData = _args.noData || function() {};	//无数据时调用的方法
	this.data = _args.data; //数据对象
	this.showFocus = _args.showFocus || function(){}; //初始焦点
	this.initData = function(){
		var size = this.listSize;
		if(size > this.dataLength){
			size = this.dataLength;	
		}
		for(var i = 0; i < size; i++){
			this.haveData(i, this.data[i]);
		}
		for(var j = size; j < this.listSize; j++){
			this.noData(j);	
		}
		this.showFocus(this.dataPos, this.focusPos); 
	}
	this.changeList = function(_num){
		this.focusPos += _num;
		this.dataPos += _num;
		if(this.dataLength > this.listSize){
			if(this.focusPos < 0){
				this.data.unshift(this.data[this.data.length - 1]);
				this.data.pop();
				this.focusPos = 0;
				//this.dataPos = this.dataLength - 1;
			}else if(this.focusPos >= this.listSize){
				this.data.push(this.data[0]);
				this.data.shift(0);	
				this.focusPos = this.listSize - 1;
			}	
			for(var i = 0; i < this.listSize; i++){
				this.haveData(i , this.data[i]);
			}
			if(this.dataPos >= this.dataLength){
				this.dataPos = 0;	
			}else if(this.dataPos < 0){
				this.dataPos = this.dataLength - 1;	
			}
		}else{
			if(this.focusPos >= this.dataLength){
				//this.focusPos--;
				//this.dataPos--;
				//return;	
				this.focusPos = 0;
				this.dataPos = 0;
			}else if(this.focusPos < 0){
				//this.focusPos = 0;	
				//this.dataPos = 0;
				//return;
				this.focusPos = this.dataLength - 1;
				this.dataPos = this.dataLength - 1;
			}
		}
		this.showFocus(this.dataPos, this.focusPos);
	}
}

function drawImage(_id, _width, _height, _frame) {
	/**
	 * 将超过规定大小的图片按比例缩小到指定值
	 */
	if (!_width) {
		_width = 250;
	}
	if (!_height) {
		_height = 350;
	}
	var iId = typeof(_frame) == "object" ? _frame.document.getElementById(_id) : document.getElementById(_id);
	var image = new Image();
	image.src = iId.src;
	if (image.width > 0 && image.height > 0) { //base on width
		if (image.width / image.height >= _width / _height) {
			if (image.width > _width) {
				iId.width = _width;
				iId.height = (image.height * _width) / image.width;
			} else {
				iId.width = image.width;
				iId.height = image.height;
			}
		} else { //base on height
			if (image.height > _height) {
				iId.height = _height;
				iId.width = (image.width * _height) / image.height;
			} else {
				iId.width = image.width;
				iId.height = image.height;
			}
		}
		iId.style.marginLeft = (Math.ceil((_width - iId.width) / 2) + 1)+"px";
		iId.style.marginTop = (Math.ceil((_height - iId.height) / 2) + 1)+"px";
	}
}
//格式00:00:00
function getSecond(time){
	if(time==null || time==""){
		return 0;
	}else{
		var times = time.split(":");
		if(times.length==1){
			return parseInt(Math.floor(times[0])*3600);
		}else if(times.length==2){
			return parseInt(Math.floor(times[0])*3600+Math.floor(times[1])*60);
		}else if(times.length==3){
			return parseInt(Math.floor(times[0])*3600+Math.floor(times[1])*60 +Math.floor(times[2]));
		}else{
			return 0;
		}
	}
}
/**
 * 将秒数格式化为 "HH:mm:SS"
 */
function timesFormat(_seconds) {
	 if(_seconds==86400)_seconds=0;
     if(_seconds <= 0){ 
         return '00:00:00';
     }   
    var hour = Math.floor(_seconds / 3600);
	if(Math.floor(hour)>23)hour=0;
    var minute = Math.floor((_seconds - hour * 3600) / 60);
    var second = Math.floor(_seconds - hour * 3600 - minute * 60);
	if(Math.round(hour) < 10)hour = '0' + hour; 
    if(Math.round(minute) < 10)minute = '0' + minute;
	if(Math.round(second) < 10)second = '0' + second; 
	return hour + ':' + minute + ":" + second;
}
function getRandomLimit(_max, _min){
 	return Math.round(Math.random() * ( _max- _min)) + _min;
}

var RollTextObj = function() {
	this.setRoll = function(_objId,_txt,_count,_suffix){
		rollTextObj.removeRoll();
		if(getCharByte(_txt, _count)  == true){
			globalParams.marqueeObj = new marqueeClass(_objId, _txt, _count,_suffix);
			globalParams.marqueeObj.scroll();
		}else{
			$(_objId).innerHTML = _txt;
		}
	}
	this.removeRoll = function(){
		if(globalParams.marqueeObj != null){
			globalParams.marqueeObj.removeScroll();
			globalParams.marqueeObj=null;
		}
	}
	this.disStr = function(_txt,_count,_fix){
		if(getCharByte(_txt, _count)  == true){
			return subStr(_txt, _count, _fix);	
		}else{
			return _txt;
		}
	}
}
var rollTextObj = new RollTextObj();

function secondsToFormat(_currSeconds){
	var date = new Date();
	date.setTime(_currSeconds);
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	if(parseInt(hours, 10) < 10){
		hours = "0" + hours;
	}
	if(parseInt(minutes, 10) < 10){
		minutes = "0" + minutes;	
	}
	if(parseInt(seconds, 10) < 10){
		seconds = "0" + seconds;
	}
	return hours + ":" + minutes + ":" + seconds;
}
//格式化日期时间
Date.prototype.format = function(format){ 
	var o = { 
		"M+" : this.getMonth()+1, //month 
		"d+" : this.getDate(), //day 
		"h+" : this.getHours(), //hour 
		"m+" : this.getMinutes(), //minute 
		"s+" : this.getSeconds(), //second 
		"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
		"S" : this.getMilliseconds() //millisecond 
	} 

	if(/(y+)/.test(format)) { 
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	} 
	
	for(var k in o) { 
		if(new RegExp("("+ k +")").test(format)) { 
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
		} 
	} 
	return format; 
}

/***日期时间***/ 
var TvseeDate = (function(){ 
	var str_format = "yyyy-MM-dd hh:mm:ss";
    //同步服务器时间到本地
	function getServerTimeToLocalTime(data){
		var serverMillisecond = tvsee.eventFrame.globalParams.globalCache.get("serverMillisecond");
		if(serverMillisecond == false){
			serverMillisecond = data.timestamp * 1000;//服务器毫秒数（1970-1-1至今）
		}
		var preLocalTimes = tvsee.eventFrame.globalParams.globalCache.get("preLocalTimes");//上一次的本地时间
		if(preLocalTimes == false){
			tvsee.eventFrame.globalParams.globalCache.put("preLocalTimes",new Date().getTime());
		}else{
			var times = new Date().getTime() - preLocalTimes;
			var yearMillisecond = 12*30*24*60*60*1000;//一年的毫秒数
			//如果时钟小于1年，认为时钟正常
			if(times < yearMillisecond){
				serverMillisecond += Math.abs(new Date().getTime() - preLocalTimes);
				tvsee.eventFrame.globalParams.globalCache.put("serverMillisecond",serverMillisecond);
				tvsee.eventFrame.globalParams.globalCache.put("preLocalTimes",new Date().getTime());
			}else{
				//时钟大于1年，认为时钟被调整，重新初始化时钟
				tvsee.eventFrame.globalParams.globalCache.put("preLocalTimes",new Date().getTime());
				getServerTimeToLocalTime(data);
			}
		}
		var value = tvsee.eventFrame.globalParams.globalCache.get("serverMillisecond");
		if(value == false){
			//第一次进入Epg时的系统时间秒
			tvsee.eventFrame.globalParams.globalCache.put("firstTimeStamp",serverMillisecond);
		}
		var sys_date = new Date();
		sys_date.setTime(serverMillisecond);
		return sys_date;
	}
	//获取服务时间
	function getServerTime(callback){
		//return callback(new Date());
		var value = tvsee.eventFrame.globalParams.globalCache.get("serverTime_CACHE");
		var sys_date = new Date();
		if(value == false){ 
			var ajax = new ajaxClass();
			ajax.frame = window;
			ajax.async = false;
			ajax.url = getAjaxUrl("getLastWeekDate",7);
			ajax.successCallback = function(_xmlHttp, _params) {
				eval("var data = (" + _xmlHttp.responseText + ").timeInfo");
				tvsee.eventFrame.globalParams.globalCache.put("serverTime_CACHE",data);
				if(typeof(callback) == "function"){
					sys_date = callback(getServerTimeToLocalTime(data));
				}
			};
			ajax.failureCallback = function(_xmlHttp, _params) {
				sys_date =  callback(new Date());
			};
			try{
				ajax.requestData();		
			}catch(e){
			}
		}else{
			if(typeof(callback) == "function"){
				sys_date = callback(getServerTimeToLocalTime(value));
			}
		} 
		return sys_date;
	}
	var Return = {
		getDate: function(str){//返回当前日期,str格式化日期字符串
			return getServerTime(function(date){
				if(typeof(str) != "undefined" && str != null){
					str_format = str;
				}
				return date.format(str_format);
			});
		},
		getTime: function(){//返回1970年1月1日至今的毫秒数
			return getServerTime(function(date){
				return date.getTime();
			});
		},
		getWeek: function(){//返回最近一周日期及星期
			return getServerTime(function(date){
				var weekday = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
				var weekDate = [[],[],[],[],[],[],[]];
				for(var i = 0; i < 7; i++){
					var _date = new Date();
					_date.setTime(date.getTime() - i*24*60*60*1000);
					weekDate[i][0] = _date.format("yyyy-MM-dd");
					weekDate[i][1] = (_date.getMonth()+1) + "月" + _date.getDate() + "日";
					weekDate[i][2] = weekday[_date.getDay()];
				}
				return weekDate;
			});
		}
	}; 
	return Return;
})(); 

/*function getMemberPayStatus(_serviceId){
	var json = {status: false, "expireDate": 0,"effectiveDate": 0,"serviceId": -1,"subscriberId": -1, result: -1};
	var payInfo = tvsee.eventFrame.globalParams.globalCache.get("payInfo_CACHE");
	if(payInfo != false){
		//payInfo = payInfo.result;
		if(typeof(payInfo.result) != "object"){
			json.result = payInfo.result;
		}else{
			payInfo = payInfo.result;
			var len = payInfo.length;
			for(var i = 0; i < len; i++){
				if(_serviceId == payInfo[i].serviceId){
					json.status = true;
					json.expireDate = payInfo[i].expireDate;
					json.effectiveDate = payInfo[i].effectiveDate;
					json.serviceId = payInfo[i].serviceId;
					json.subscriberId = payInfo[i].subscriberId;
					break;
				}	
			}
		}
	}
	return json;	
}*/

function getMemberPayStatus(_serviceId){
	var json = {status: false, "expireDate": 0,"effectiveDate": 0,"serviceId": -1,"subscriberId": -1, result: -1};
	if(typeof(_serviceId) == "undefined"){
		return json;	
	}
	var payInfo = tvsee.eventFrame.globalParams.globalCache.get("payInfo_CACHE");
	if(payInfo != false){
		//payInfo = payInfo.result;
		if(typeof(payInfo.result) != "object"){
			json.result = payInfo.result;
		}else{
			payInfo = payInfo.result;
			var len = payInfo.length;
			var serviceIdArr = _serviceId.split(",");
			var serArrLen = serviceIdArr.length;
			for(var i = 0; i < len; i++){
				for(var j = 0; j < serArrLen; j++){
					if(serviceIdArr[j] == payInfo[i].serviceId){
						json.status = true;
						json.expireDate = payInfo[i].expireDate;
						json.effectiveDate = payInfo[i].effectiveDate;
						json.serviceId = payInfo[i].serviceId;
						json.subscriberId = payInfo[i].subscriberId;
						break;
					}
				}
				if(json.status == true){
					break;	
				}
			}
		}
	}else{
		tvsee.eventFrame.getPayInfoResult();	
	}
	return json;	
}

function isServiceCode(_serviceCode){
	var json = {status: false, "expireDate": 0,"effectiveDate": 0,"serviceId": -1,"subscriberId": -1, result: -1};
	if(typeof(_serviceCode) == "undefined"){
		return json;	
	}
	var payInfo = tvsee.eventFrame.globalParams.globalCache.get("payInfo_CACHE");
	if(payInfo != false){
		if(typeof(payInfo.result) != "object"){
			json.result = payInfo.result;
		}else{
			payInfo = payInfo.result;
			var len = payInfo.length;
			for(var i = 0; i < len; i++){
				if(payInfo[i].service_code == _serviceCode){
					json.status = true;
					json.expireDate = payInfo[i].expireDate;
					json.effectiveDate = payInfo[i].effectiveDate;
					json.serviceId = payInfo[i].serviceId;
					json.subscriberId = payInfo[i].subscriberId;
					break;
				}
			}
		}
	}
	return json;
}

function cookieClass(){
	this.setCookie = function(_key, _value, _time){
		if(typeof(_time) == "undefined"){
			_time = 60 * 60 * 24;	
		}
		var exp = new Date();
		exp.setTime(TvseeDate.getTime() + _time * 1000);
		document.cookie = _key + "=" + escape(_value) + ";expires=" + exp.toGMTString();
	}
	this.getCookie = function(_key){
		if(typeof(document.cookie) == "undefined"){
			return "";	
		}
		if (document.cookie.length > 0) {
			var keyStart = document.cookie.indexOf(_key + "=");
			if (keyStart != -1) {
				keyStart = keyStart + _key.length + 1;
				var keyEnd = document.cookie.indexOf(";", keyStart);
				if (keyEnd == -1){
					keyEnd = document.cookie.length;
				}
				var value = unescape(document.cookie.substring(keyStart, keyEnd));
				return value;
			}
			return "";
		}
	}
	this.delCookie = function(_key){
		var exp = new Date();
		exp.setTime(TvseeDate.getTime() - 1);
		var cval = this.getCookie(_key);
		if (cval != null && cval != ""){
			document.cookie = _key + "=" + cval + ";expires=" + exp.toGMTString();
		}
	}
}