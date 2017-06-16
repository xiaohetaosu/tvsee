/*
 * 此对象适用焦点要求滑动，然后到末端又要求执行整个列表滑动的效果
 * @_dataLength(number) 必选		总的数据的长度
 * @_listSize(number) 必选		可见列表的长度
 * @_focusDiv(string) 必选 		焦点的id
 * @_listHigh(number) 必选 		滑动的距离
 * @_startPlace(number) 必选		焦点的初始位置
 * @_dataPos(number) 可选		初始数据焦点位置
 * @_showFlag(number) 可选	 	滑动标志,1: 上下滑动，0：左右滑动
 * @_duration(string) 可选		每次滑动的耗时
 * @_frame(object) 可选			对象所在窗体
 * @_arrayList(array) 必选		滑动列表的id集
 * @_posInfo(object) 必选		中转滑动列表的设定位置
 * @_haveData(function) 必选		有数据时调用的方法
 * @_noData(function) 必选		无数据时调用的方法
 * {dataLength:a, listSize:b, focusDiv:c, listHigh:d, startPlace:e, dataPos:f, showFlag:1, duration:g, frame:window, arrayList:h, posInfo:i, haveData:j, noData:k}
 */
function showList2D(_args) {
	this.dataLength = _args.dataLength; //数据的长度
	this.listSize = _args.listSize; //需要显示的列表的长度
	this.focusDiv = _args.focusDiv; //焦点div的id
	this.listHigh = _args.listHigh; //焦点每次移动的距离
	this.startPlace = _args.startPlace || 0; //焦点的初始位置偏移
	this.dataPos = _args.dataPos || 0; //数据焦点的位置
	this.showFlag = _args.showFlag || 0; //标记列表是上下（1）移动还是左右（0）移动
	this.duration = _args.duration || "200ms"; //每次滑动的耗时
	this.enableDuration = parseInt(this.duration, 10) != 0 ? true : false;
	this.frame = _args.frame || window; //当前窗体
	this.arrayList = _args.arrayList || []; //列表中每一列的id
	this.posInfo = _args.posInfo || {
		firstPos: {
			top: "",
			left: ""
		}, //第一个位置
		lastPos: {
			top: "",
			left: ""
		}, //最后一个位置
		firstStatus: {
			top: "",
			left: ""
		}, //第一个之前的位置
		endStatus: {
			top: "",
			left: ""
		} //最后一个之后的位置
	};
	this.haveData = _args.haveData || function() {};
	this.noData = _args.noData || function() {};

	this.listDom = []; //列表id的DOM表现
	this.focusDivObj = null; //焦点div的DOM表现
	this.viewSize = this.listSize + 1; //可见列表的长度， 一般比this.listSize大于1
	this.tempSize = this.dataLength < this.listSize ? this.dataLength : this.listSize;
	//this.focusPos = this.dataLength - this.dataPos < this.tempSize ? this.tempSize - (this.dataLength - this.dataPos) : 0; //焦点的位置
	//计算焦点位置的函数
	this.focusPosition = function() {
		if (isNaN(_args.focusPos)) {
			if (this.dataPos + 1 > this.dataLength) {
				return this.tempSize - 1;
			}
			if (this.dataPos + 1 < this.listSize) {
				return this.dataPos;
			}
		} else {
			for (var i = 0; i < this.listSize - this.focusPos; i++) {
				changePos(-1);
			}
			return this.focusPos;
		}
		return this.dataPos + 1 > this.tempSize ? this.tempSize - 1 : this.dataPos;
	};
	this.focusPos = this.focusPosition(); //焦点的位置
	this.listPos = this.focusPos; //循环id的位置

	//重新使用对象
	this.changeData = function(_dataLength, _dataPos) {
		this.noData({
			idPos: this.listPos,
			dataPos: 0
		});
		this.dataLength = _dataLength;
		this.dataPos = _dataPos;
		this.tempSize = this.dataLength < this.listSize ? this.dataLength : this.listSize;
		//this.focusPos = this.dataLength - this.dataPos < this.tempSize ? this.tempSize - (this.dataLength - this.dataPos) : 0; //焦点的位置
		this.focusPos = this.focusPosition();
		this.listPos = this.focusPos; //循环id的位置
		this.showNewFocusPlace();
		this.showList();
	};

	//开始显示
	this.startShow = function() {
		this.setDocumentGlobal();
		this.showFocusPlace();
		this.showList();
		var obj = this;
		setTimeout(function() {
			obj.setDocumentStyle();
		}, 500); //延时处理避免内容显示不正常
	};

	//简写
	this.$ = function(_id) {
		if (typeof(_id) == "object") {
			return _id;
		}
		return this.frame.document.getElementById(_id);
	};

	//新位置是否需要限制
	this.limitNewFocusPlace = function(_idPos, _returnType) {
		var returnValue = [false, 0];
		var newFocusPos = ((_idPos - (this.listPos - this.focusPos)) % this.viewSize + this.viewSize) % this.viewSize;
		var newDataPos = this.dataPos + (newFocusPos - this.focusPos);
		if (newDataPos >= this.dataLength) {
			returnValue[0] = true;
		}
		returnValue[1] = newDataPos;
		return returnValue[_returnType || 0];
	};

	//计算新位置数据
	this.calcNewFocusPlace = function(_idPos) {
		var focusPos_backup = this.focusPos;
		this.focusPos = ((_idPos - (this.listPos - this.focusPos)) % this.viewSize + this.viewSize) % this.viewSize;
		this.listPos = _idPos;
		this.dataPos += this.focusPos - focusPos_backup;
	};

	this.showNewFocusPlace = function() {
		this.focusDivObj.style[["left", "top"][this.showFlag]] = this.focusPos * this.listHigh + this.startPlace + "px";
	};

	this.getFocusPos = function() {
		return {
			idPos: this.listPos,
			dataPos: this.dataPos,
			focusPos: this.focusPos
		};
	};

	this.changePage = function(_num) {
	};

	//设置全局的DOM对象
	this.setDocumentGlobal = function() {
		for (var i = 0; i < this.viewSize; i++) {
			this.listDom[i] = this.$(this.arrayList[i]);
		}
		this.focusDivObj = this.$(this.focusDiv);
	};

	//设置全局的DOM对象样式
	this.setDocumentStyle = function() {
		if (this.enableDuration == true) {
			for (var i = 0; i < this.viewSize; i++) {
				this.listDom[i].style.webkitTransitionDuration = this.duration;
			}
		}
	};

	//设置焦点div的初始位置
	this.showFocusPlace = function() {
		if (this.enableDuration == true) {
			this.focusDivObj.style.webkitTransitionDuration = 0;
		}
		this.showNewFocusPlace();
		if (this.enableDuration == true) {
			this.focusDivObj.style.webkitTransitionDuration = this.duration;
		}
	};

	//显示列表
	this.showList = function() {
		var tempPos = this.dataPos - this.focusPos;
		for (var i = tempPos; i < tempPos + this.viewSize; i++) {
			if (i < this.dataLength) {
				this.haveData({
					idPos: i - tempPos,
					dataPos: i
				});
			} else {
				this.noData({
					idPos: i - tempPos,
					dataPos: i
				});
			}
		}
	};

	//移动焦点
	this.changeList = function(_num) {
		if (this.dataPos + _num < 0 || this.dataPos + _num == this.dataLength) {
			return;
		}
		if (this.focusPos == 0 && _num < 0) { //列表向下或向右移动
			this.showDownOrRightEffect();
		} else if (this.focusPos == this.listSize - 1 && _num > 0) { //列表向上或向左移动
			this.showUpOrLeftEffect();
		} else { //焦点在列表中，焦点滑动
			this.focusDivObj.style[["left", "top"][this.showFlag]] = _num * this.listHigh + parseInt(this.focusDivObj.style[["left", "top"][this.showFlag]], 10) + "px";
		}
		this.changePos(_num); //位置的运算
	};

	//向下或是向右移动
	this.showDownOrRightEffect = function() {
		//用两变量记住将要滑进来的数据的位置
		var tempPos = (this.listPos - 1 + this.viewSize) % this.viewSize;
		var tempDataPos = (this.dataPos - 1 + this.dataLength) % this.dataLength;
		//改变滑进来的list的状态值-----start
		this.haveData({
			idPos: tempPos,
			dataPos: tempDataPos
		}); //填数据
		if (this.enableDuration == true) {
			this.listDom[tempPos].style.webkitTransitionDuration = 0;
		}
		if (this.showFlag == 1) {
			this.listDom[tempPos].style.top = this.posInfo.firstStatus.top;
		} else {
			this.listDom[tempPos].style.left = this.posInfo.firstStatus.left;
		}
		if (this.enableDuration == true) {
			this.listDom[tempPos].style.webkitTransitionDuration = this.duration;
		}
		if (this.showFlag == 1) {
			this.listDom[tempPos].style.top = this.posInfo.firstPos.top;
		} else {
			this.listDom[tempPos].style.left = this.posInfo.firstPos.left;
		}
		//改变滑进来的list的状态值-----end
		for (var i = this.listPos; i < this.listPos + this.listSize - 1; i++) { //将上一个状态值附给下一个
			if (this.showFlag == 1) {
				this.listDom[i % this.viewSize].style.top = this.listDom[(i + 1) % this.viewSize].style.top;
			} else {
				this.listDom[i % this.viewSize].style.left = this.listDom[(i + 1) % this.viewSize].style.left;
			}
		}
		//做切出的动作
		if (this.showFlag == 1) {
			this.listDom[(this.listPos + this.listSize - 1) % this.viewSize].style.top = this.posInfo.endStatus.top;
		} else {
			this.listDom[(this.listPos + this.listSize - 1) % this.viewSize].style.left = this.posInfo.endStatus.left;
		}
	};

	//向上或向左移动
	this.showUpOrLeftEffect = function() {
		//用两变量记住将要滑进来的数据的位置
		var tempPos = (this.listPos + 1) % this.viewSize;
		var tempDataPos = (this.dataPos + 1) % this.dataLength;
		//改变滑进来的list的状态值-----start
		this.haveData({
			idPos: tempPos,
			dataPos: tempDataPos
		}); //填数据
		if (this.enableDuration == true) {
			this.listDom[tempPos].style.webkitTransitionDuration = 0;
		}
		if (this.showFlag == 1) {
			this.listDom[tempPos].style.top = this.posInfo.endStatus.top;
		} else {
			this.listDom[tempPos].style.left = this.posInfo.endStatus.left;
		}
		if (this.enableDuration == true) {
			this.listDom[tempPos].style.webkitTransitionDuration = this.duration;
		}
		if (this.showFlag == 1) {
			this.listDom[tempPos].style.top = this.posInfo.lastPos.top;
		} else {
			this.listDom[tempPos].style.left = this.posInfo.lastPos.left;
		}
		//改变滑进来的list的状态值-----end
		for (var i = this.listPos; i > this.listPos - this.listSize + 1; i--) { //将下一个状态值附给上一个
			if (this.showFlag == 1) {
				this.listDom[(i + this.viewSize) % this.viewSize].style.top = this.listDom[(i - 1 + this.viewSize) % this.viewSize].style.top;
			} else {
				this.listDom[(i + this.viewSize) % this.viewSize].style.left = this.listDom[(i - 1 + this.viewSize) % this.viewSize].style.left;
			}
		}
		//做切出动作
		if (this.showFlag == 1) {
			this.listDom[(this.listPos - this.listSize + 1 + this.viewSize) % this.viewSize].style.top = this.posInfo.firstStatus.top;
		} else {
			this.listDom[(this.listPos - this.listSize + 1 + this.viewSize) % this.viewSize].style.left = this.posInfo.firstStatus.left;
		}
	};

	//设定位置
	this.changePos = function(_num) {
		this.dataPos = ((this.dataPos + _num) % this.dataLength + this.dataLength) % this.dataLength;
		this.listPos = ((this.listPos + _num) % this.viewSize + this.viewSize) % this.viewSize;
		this.focusPos = this.focusPos + _num;
		if (this.focusPos < 0) {
			this.focusPos = 0;
		} else if (this.focusPos == this.listSize) {
			this.focusPos = this.listSize - 1;
		}
	};
}
