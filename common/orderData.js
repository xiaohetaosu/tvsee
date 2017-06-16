var orderPayDesc = {
	title: "银河VIP,您的私人院影",
	desc: "囊括数千部国内外优质院线影片，足不出户零距离新体验院线最热大片，第一时间更新，每周更新10小时以上，特惠包月计划，立刻订购每月仅需20元",
	picurl: "images/order/month_sel.png",
	orderName: "<span style='font-size: 30px;'>20</span>元/月  超清画质  院线同步更新"
}

var orderListPackages = {
	title: '请选择您购买的时长',
	packagesInfo:[{
		getFocusImg: 'images/order/month_sel.png',
		loseFocusImg: 'images/order/month_nosel.png',
		packpageName: '时长1个月<br/>月包优惠价格12元',
		title:'银河VIP影院包月',
		price: 1580,
		periodLength: 1,
		sessionId:1,
		serviceId: 1,
		serviceName: 'VIP影院月包',
		serviceCode: ''
	},{
		
		//"serviceId":3,"price":19800,"serviceName":"vip包年","periodLength":12,"serviceCode":"1","serviceDesc":"vip包年198元"
		getFocusImg: 'images/order/six_months_sel.png',
		loseFocusImg: 'images/order/six_months_nosel.png',
		packpageName: "时长6个月<br/>半年包优惠价60元<br/><span style='color:red;font-size:20px'>五一特惠，加赠1个月</span>",
		title:'银河VIP影院包半年',
		price: 7560,
		periodLength: 6,
		sessionId:1,
		serviceId: 2,
		serviceName: 'VIP影院半年包',
		serviceCode: ''
	},{
		getFocusImg: 'images/order/year_sel.png',
		loseFocusImg: 'images/order/year_nosel.png',
		packpageName: "时长12个月<br/>年包优惠价100元<br/><span style='color:red;font-size:20px'>五一特惠，加赠3个月</span>",
		price: 13800,
		title:'VIP影院年包',
		periodLength: 12,
		sessionId:1,
		serviceId: 3,
		serviceName: 'VIP影院年包',
		serviceCode: ''
	},{
		getFocusImg: 'images/order/year_sel.png',
		loseFocusImg: 'images/order/year_nosel.png',
		packpageName: "时长12个月<br/>年包优惠价100元<br/><span style='color:red;font-size:20px'>五一特惠，加赠3个月</span>",
		price: 16800,
		title:'VIP纪录片半年包',
		periodLength: 6,
		sessionId:1,
		serviceId: 19,
		serviceName: 'VIP纪录片半年包',
		serviceCode: ''
	},{
		getFocusImg: 'images/order/year_sel.png',
		loseFocusImg: 'images/order/year_nosel.png',
		packpageName: "时长12个月<br/>年包优惠价100元<br/><span style='color:red;font-size:20px'>五一特惠，加赠3个月</span>",
		price: 19800,
		title:'VIP纪录片年包',
		periodLength: 12,
		sessionId:1,
		serviceId: 20,
		serviceName: 'VIP纪录片年包',
		serviceCode: ''
	},{
		getFocusImg: 'images/order/year_sel.png',
		loseFocusImg: 'images/order/year_nosel.png',
		packpageName: "时长12个月<br/>年包优惠价100元<br/><span style='color:red;font-size:20px'>五一特惠，加赠3个月</span>",
		price: 16800,
		title:'极清影院半年包',
		periodLength: 6,
		sessionId:1,
		serviceId: 6,
		serviceName: '极清影院半年包',
		serviceCode: ''
	},{
		getFocusImg: 'images/order/year_sel.png',
		loseFocusImg: 'images/order/year_nosel.png',
		packpageName: "时长12个月<br/>年包优惠价100元<br/><span style='color:red;font-size:20px'>五一特惠，加赠3个月</span>",
		price: 16800,
		title:'极清影院年包',
		periodLength: 6,
		sessionId:1,
		serviceId: 7,
		serviceName: '极清影院年包',
		serviceCode: ''
	},{
		getFocusImg: 'images/order/ttMonth_sel.png',
		loseFocusImg: 'images/order/ttMonth_nosel.png',
		packpageName: '时长1个月<br/>月包优惠价格12元',
		title:'银河VIP影院包月',
		price: 1980,
		periodLength: 1,
		sessionId:1,
		serviceId: 51,
		serviceName: 'VIP影院月包',
		serviceCode: ''
	},{
		
		//"serviceId":3,"price":19800,"serviceName":"vip包年","periodLength":12,"serviceCode":"1","serviceDesc":"vip包年198元"
		getFocusImg: 'images/order/ttsix_months_sel.png',
		loseFocusImg: 'images/order/ttsix_months_nosel.png',
		packpageName: "时长6个月<br/>半年包优惠价60元<br/><span style='color:red;font-size:20px'>五一特惠，加赠1个月</span>",
		title:'银河VIP影院包半年',
		price: 10800,
		periodLength: 6,
		sessionId:1,
		serviceId: 52,
		serviceName: 'VIP影院半年包',
		serviceCode: ''
	},{
		getFocusImg: 'images/order/ttyear_sel.png',
		loseFocusImg: 'images/order/ttyear_nosel.png',
		packpageName: "时长12个月<br/>年包优惠价100元<br/><span style='color:red;font-size:20px'>五一特惠，加赠3个月</span>",
		price: 19800,
		title:'VIP影院年包',
		periodLength: 12,
		sessionId:1,
		serviceId: 53,
		serviceName: 'VIP影院年包',
		serviceCode: ''
	}]
}

var positionInfo = {
	"19,20":{
		focus: 0,
		color: "blue",
		listDivTop: "433px",
		productNamePosition:{
			left: "29px",
			top: "148px"
		},
		position: [{ 
			left: "280px",
			top: "180px",
			getFocusImg: 'images/order/jiluVIP_sixMonth_sel.png',
			loseFocusImg: 'images/order/jiluVIP_sixMonth.png'
		},{
			left: "710px",
			top: "180px",
			getFocusImg: 'images/order/jiluVIP_year_sel.png',
			loseFocusImg: 'images/order/jiluVIP_year_.png'
	}]},
	"65,1,2,3":{              
		focus: 0,
		color: "blue",
		listDivTop: "433px",
		productNamePosition:{
			left: "29px",
			top: "158px"
		},
		position: [{
			left: "30px",
			top: "180px",
			getFocusImg: 'images/order/vip_meiju_sel.png',
			loseFocusImg: 'images/order/vip_meiju_nosel.png'
		},{
			left: "306px",
			top: "180px",
			getFocusImg: 'images/order/month_sel.png',
			loseFocusImg: 'images/order/month_nosel.png'		   
		},{
			left: "582px",
			top: "180px",
			getFocusImg: 'images/order/six_months_sel.png',
			loseFocusImg: 'images/order/six_months_nosel.png'
		},{
			left: "858px",
			top: "180px",
			getFocusImg: 'images/order/year_sel.png',
			loseFocusImg: 'images/order/year_nosel.png'
		}]},
	"6,7":{
		focus: 0,
		color: "blue",
		listDivTop: "433px",
		productNamePosition:{
			left: "29px",
			top: "148px"
		},
		position: [{ 
			left: "280px",
			top: "180px",
			getFocusImg: 'images/order/jiluVIP_sixMonth_sel.png',
			loseFocusImg: 'images/order/jiluVIP_sixMonth.png'
		},{
			left: "710px",
			top: "180px",
			getFocusImg: 'images/order/jiluVIP_year_sel.png',
			loseFocusImg: 'images/order/jiluVIP_year_.png'
	}]},
	"65,51,52,53":{              
		focus: 0,
		color: "#FFF",
		listDivTop: "370px",
		productNamePosition:{
			left: "20px",
			top: "143px"
		},
		position: [{
			left: "30px",
			top: "180px",
			getFocusImg: 'images/order/meiju_vip_sel.png',
			loseFocusImg: 'images/order/meiju_vip_nosel.png'
		},{
			left: "306px",
			top: "150px",
			getFocusImg: 'images/order/ttMonth_sel.png',
			loseFocusImg: 'images/order/ttMonth_nosel.png'		   
		},{
			left: "582px",
			top: "150px",
			getFocusImg: 'images/order/ttsix_months_sel.png',
			loseFocusImg: 'images/order/ttsix_months_nosel.png'
		},{
			left: "858px",
			top: "150px",
			getFocusImg: 'images/order/ttyear_sel.png',
			loseFocusImg: 'images/order/ttyear_nosel.png'
	}]},
	"55,56":{
		focus: 0,
		color: "blue",
		listDivTop: "433px",
		productNamePosition:{
			left: "29px",
			top: "148px"
		},
		position: [{ 
			left: "280px",
			top: "180px",
			getFocusImg: 'images/order/tttbsix_months_sel.png',
			loseFocusImg: 'images/order/tttbsix_months_nosel.png'
		},{
			left: "710px",
			top: "180px",
			getFocusImg: 'images/order/tttbyear_sel.png',
			loseFocusImg: 'images/order/tttbyear_nosel.png'
	}]}
}
var vipServiceId = "1,2,3,17"
var yinHeVipServiceIds = "65,1,2,3";
var shengjiServiceId = "34"
var jiluVipSErviceIds = "19,20";
var jiqingVipSErviceIds ="6,7"
var cardServiceId = ",17,18,39,64,10";  //通过卡密订购的serviceId
var tttbVipServiceIds = "55,56"; //天天童伴 serviceId
var orderDefrayMode = {
	title: '请选择您支付的方式',
	defrayModesInfo: [{
		getFocusImg: 'images/order/defray0Img0.png',
		loseFocusImg: 'images/order/defray0Img1.png',
		getFocusTitleBg: 'images/order/defrayBg0.png',
		loseFocusTitleBg: 'images/order/defrayBg1.png',
		title: '手机扫描，完成支付',
		payMethod: 'weixin',
		payLogo: 'images/order/weixin.png'
	},{
		getFocusImg: 'images/order/defray1Img0.png',
		loseFocusImg: 'images/order/defray1Img1.png',
		getFocusTitleBg: 'images/order/defrayBg0.png',
		loseFocusTitleBg: 'images/order/defrayBg1.png',
		title: '手机扫描，完成支付',
		payMethod: 'alipay',
		payLogo: 'images/order/zhifubao.png'
	}]
	
}
//只有成都使用
var livePayChengduServiceId_0 = "25,26,27";
var livePayChengduServiceId_1 = "35,36,37";
var livePayChengduServiceId_2 = ",4,28,29,30"
var yinheChengduServiceId ="1,2,3,17";
var zuheServiceId ="31,32,33";
var jiluServiceId = "19,20";
var shengjiS=",34,46"
var zanshengji = ",44"
var halfServiceId_70 =",5,48,44,57"
var halfServiceId_100 =",8,50"
//var ttmeiju = "65,51,52,53,68,69,66";
var ttmeiju = "65,51,52,53";
var ttban = "55,56"
var rebateServiceId = "34,35,36,37";
var ttmeijuServiceId =[
{
	title:'银河VIP',
		price: 19800,
		originalPrice: 19800,
		periodLength: 1,
		sessionId:1,
		serviceId: 51,
		serviceCode:1,
		serviceName: '银河VIP月包'
},{
	title:'银河VIP',
		price: 19800,
		originalPrice: 19800,
		periodLength: 6,
		sessionId:1,
		serviceId: 52,
		serviceCode:1,
		serviceName: '银河VIP半年包'
},{
	title:'银河VIP',
		price: 19800,
		originalPrice: 19800,
		periodLength: 12,
		sessionId:1,
		serviceId: 53,
		serviceCode:1,
		serviceName: '银河VIP年包'
},{
	title:'银河VIP',
		price: 19800,
		originalPrice: 19800,
		periodLength: 12,
		sessionId:1,
		serviceId: 65,
		serviceCode:1,
		serviceName: '银河VIP年包'
}]
var livePayChengdu =[
{
	title:'直播',
		price: 19800,
		periodLength: 12,
		sessionId:1,
		serviceId: 25,
		serviceCode:4,
		serviceName: '基本标清一年',
		
},{
	title:'直播',
		price: 19800,
		periodLength: 24,
		sessionId:1,
		serviceId: 26,
		serviceCode:4,
		serviceName: '基本标清两年'
},{
	title:'直播',
		price: 19800,
		periodLength: 36,
		sessionId:1,
		serviceId: 27,
		serviceCode:4,
		serviceName: '基本标清三年'
},{
	title:'直播',
		price: 19800,
		periodLength: 12,
		sessionId:1,
		serviceId: 35,
		serviceCode:5,
		serviceName: '增值高清一年',
		monthOrImg: ["1", "images/order/oneMonth.png", "<div style='position:absolute;  left: 255px;  top: 575px;'><img  src='images/order/border0.png'/></div><div id='title_word' style='left: 262px;top: 582px;position: absolute;'><span style='font-size: 28px;color: #FFCE00;font-weight: 500;'>高清特权:</span><span class='spanfont'>赠送</span><span id='span_num' class='spanfont' style='color: red;font-size: 35px;'>1</span><span class='spanfont'>个月VIP,</span><span style='font-size: 28px;color: #FFCE00;font-weight: 500;'>有效期内购买</span><span id='span_1' style='font-size: 35px;color: white;font-style: oblique;font-weight: 500;'>VIP半年/年包</span><span id='span_2' style='font-size: 38px;color: red;font-style: oblique;font-weight: 500;'>7</span><span id='span_3' style='font-size: 35px;color: white;font-style: oblique;font-weight: 500;'>折</span></div>"]
},{
	title:'直播',
		price: 19800,
		periodLength: 24,
		sessionId:1,
		serviceId: 36,
		serviceCode:5,
		serviceName: '增值高清两年',
		monthOrImg: ["1", "images/order/oneMonth.png",  "<div style='position:absolute;  left: 255px;  top: 575px;'><img  src='images/order/border0.png'/></div><div id='title_word' style='left: 262px;top: 582px;position: absolute;'><span style='font-size: 28px;color: #FFCE00;font-weight: 500;'>高清特权:</span><span class='spanfont'>赠送</span><span id='span_num' class='spanfont' style='color: red;font-size: 35px;'>1</span><span class='spanfont'>个月VIP,</span><span style='font-size: 28px;color: #FFCE00;font-weight: 500;'>有效期内购买</span><span id='span_1' style='font-size: 35px;color: white;font-style: oblique;font-weight: 500;'>VIP半年/年包</span><span id='span_2' style='font-size: 38px;color: red;font-style: oblique;font-weight: 500;'>6</span><span id='span_3' style='font-size: 35px;color: white;font-style: oblique;font-weight: 500;'>折</span></div>"]
},{
	title:'直播',
	price: 19800,
	periodLength: 36,
	sessionId:1,
	serviceId: 37,
	serviceCode:5,
	serviceName: '增值高清三年',
	monthOrImg: ["1", "images/order/oneMonth.png", "<div style='position:absolute;  left: 255px;  top: 575px;'><img  src='images/order/border0.png'/></div><div id='title_word' style='left: 262px;top: 582px;position: absolute;'><span style='font-size: 28px;color: #FFCE00;font-weight: 500;'>高清特权:</span><span class='spanfont'>赠送</span><span id='span_num' class='spanfont' style='color: red;font-size: 35px;'>1</span><span class='spanfont'>个月VIP,</span><span style='font-size: 28px;color: #FFCE00;font-weight: 500;'>有效期内购买</span><span id='span_1' style='font-size: 35px;color: white;font-style: oblique;font-weight: 500;'>VIP半年/年包</span><span id='span_2' style='font-size: 38px;color: red;font-style: oblique;font-weight: 500;'>5</span><span id='span_3' style='font-size: 35px;color: white;font-style: oblique;font-weight: 500;'>折</span></div>"]
}]

var yinheChengdu =[
{
	title:'银河VIP',
		price: 19800,
		periodLength: 1,
		sessionId:1,
		serviceId: 1,
		serviceCode:1,
		serviceName: '银河VIP月包'
},{
	title:'银河VIP',
		price: 19800,
		periodLength: 6,
		sessionId:1,
		serviceId: 2,
		serviceCode:1,
		serviceName: '银河VIP半年包'
},{
	title:'银河VIP',
		price: 19800,
		periodLength: 12,
		sessionId:1,
		serviceId: 3,
		serviceCode:1,
		serviceName: '银河VIP年包'
},{
	title:'银河VIP',
		price: 19800,
		periodLength: 12,
		sessionId:1,
		serviceId: 65,
		serviceCode:1,
		serviceName: '银河VIP年包'
}]


var shengji =[
{
	title:'组合包',
		price: 19800,
		periodLength: 12,
		sessionId:1,
		serviceId: 34,
		serviceCode:7,
		serviceName: '组合包一年'
}]

var jiluChengdu =[
{
	title:'纪录片',
		price: 3000,
		periodLength: 6,
		sessionId:1,
		serviceId: 19,
		serviceCode:5,
		serviceName: '纪录片半年'
},{
	title:'纪录片',
		price: 5000,
		periodLength: 12,
		sessionId:1,
		serviceId: 20,
		serviceCode:5,
		serviceName: '纪录片年年'
}]

var livePay = [
	{
		title:'直播',
		price: 19800,
		periodLength: 12,
		sessionId:1,
		serviceId: 68,
		serviceName: '直播一年'
	},{
		title:'直播',
		price: 29800,
		periodLength: 24,
		sessionId:1,
		serviceId: 69,
		serviceName: '直播两年'
	},{
		title:'直播',
		price: 39800,
		periodLength: 36,
		sessionId:1,
		serviceId: 13,
		serviceName: '直播三年'
	},{
		title:'直播+银河VIP影院',
		price: 36000,
		periodLength: 12,
		sessionId:1,
		serviceId: 14,
		serviceName: '直播+银河VIP影院一年'
	},{
		title:'直播+银河VIP影院',
		price: 54000,
		periodLength: 24,
		sessionId:1,
		serviceId: 15,
		serviceName: '直播+银河VIP影院两年'
	},{
		title:'直播+银河VIP影院',
		price: 72000,
		periodLength: 36,
		sessionId:1,
		serviceId: 16,
		serviceName: '直播+银河VIP影院三年'
	}
]
	
var liveOrVodPay = [{
	title:'直播',
	price: 19800,
	periodLength: 12,
	sessionId:1,
	serviceId: 68,
	serviceName: 'VIP影院月包'
},{
	title:'直播',
	price: 29800,
	periodLength: 24,
	sessionId:1,
	serviceId: 69,
	serviceName: 'VIP影院月包'
},{
	title:'直播',
	price: 39800,
	periodLength: 36,
	sessionId:1,
	serviceId: 13,
	serviceName: 'VIP影院月包'
},{
	title:'银河VIP影院',
	price: 19800,
	periodLength: 12,
	sessionId:1,
	serviceId: 1,
	serviceName: 'VIP影院月包'
},{
	title:'银河VIP影院',
	price: 29800,
	periodLength: 24,
	sessionId:1,
	serviceId: 2,
	serviceName: 'VIP影院月包'
},{
	title:'银河VIP影院',
	price: 39800,
	periodLength: 36,
	sessionId:1,
	serviceId: 3,
	serviceName: 'VIP影院月包'
},{
	title:'直播+银河VIP影院',
	price: 36000,
	periodLength: 12,
	sessionId:1,
	serviceId: 14,
	serviceName: 'VIP影院月包'
},{
	title:'直播+银河VIP影院',
	price: 54000,
	periodLength: 24,
	sessionId:1,
	serviceId: 15,
	serviceName: 'VIP影院月包'
},{
	title:'直播+银河VIP影院',
	price: 72000,
	periodLength: 36,
	sessionId:1,
	serviceId: 16,
	serviceName: 'VIP影院月包'
}]
var TTTB_VIP_DATA = [
{
	title:'纪录片',
	price: 3000,
	periodLength: 6,
	sessionId:1,
	serviceId: 55,
	serviceCode:5,
	serviceName: '纪录片半年'
},{
	title:'纪录片',
	price: 5000,
	periodLength: 12,
	sessionId:1,
	serviceId: 56,
	serviceCode:5,
	serviceName: '纪录片年年'
}]
var PAY_LIST = [{
		menuName: "直播",
		isShowMonth: true,
		isTimeLimit: false,
		data: livePayChengdu,
		tipInnerHTML:  "<div style='top: 470px;left: 295px;position: absolute;'><span  class='word_0' >直播</span><span class='word_1' >70+:</span><span class='word_1' ></span><span class='word_0'></span><span class='word_1'>70</span><span class='word_0'>个标清频道+</span><span class='word_1'>CCTV1高清+CCTV4高清</span><span class='word_0'></span></div><div style='top: 508px;left: 285px;position: absolute;'><span class='word_0' >直播</span><span class='word_1' >100+:</span><span class='word_1' ></span><span class='word_0'></span><span class='word_1'>70</span><span class='word_0'>个标清+</span><span class='word_1'>19个高清+7个成都本地+8个四川本地</span><span class='word_0'></span></div><div style='top: 544px;left: 359px;position: absolute;'><span class='word_1'>购买直播100，</span><span class='word_0'>可</span><span class='word_1'>享受高清特权</span><span class='word_0'>噢~！</span></div>"
	},{
		menuName: "银河VIP",
		isShowMonth: true,
		isTimeLimit: false,
		data: yinheChengdu,
		tipInnerHTML: "<div style='position: absolute;top: 467px; width: 900px; left: 275px;'><span class='word_1'>银河VIP</span><span class='word_0'>内容包含最新最热</span><span class='word_1'>院线大片</span><span class='word_0'>，为您提供</span><span class='word_1'>更多更优质</span><span class='word_0'>的观看内容，让您享受</span><span class='word_1'>更清晰、流畅</span><span class='word_0'>的观看体验。内容每周更新超过</span><span class='word_1'>40部/集。</span><br/><span class='word_1'>银河VIP+天天美剧</span><span class='word_0'>包月同捆，原价25.8元+17.8元=</span><span class = 'word_1'>43.6元</span><span class='word_0'>，现限时特惠</span><span class = 'word_1'>29.8元</span></div>"
	},{
		menuName: "精选记录",
		isShowMonth: true,
		isTimeLimit: false,
		data: jiluChengdu,
		tipInnerHTML: "<div style='position: absolute;top: 447px; width: 900px; left: 275px;'><span class='word_1'>精选纪录专区</span><span class='word_0'>提供各种经典纪录片,包括</span><span class='word_1'>KBS、BBC、央视等</span><span class='word_0'>优秀的国内外纪录片，是广大纪录片爱好者的乐园。内容每周更新超过</span><span class='word_1'>10部/集！</span></div>"
	},{
		menuName: "天天美剧",
		isShowMonth: true,
		isTimeLimit: false,
		data: ttmeijuServiceId,
		tipInnerHTML: "<div style='position: absolute;top: 467px; width: 900px; left: 275px;'><span class='word_1'>美剧专属套餐，</span><span class='word_0'>美剧迷的福音。套餐独揽</span><span class='word_1'>HBO王牌高清</span><span class='word_0'>美剧，实现HBO最新美剧</span><span class='word_1'>“中美同步”</span><span class='word_0'>播出，为观众带来全方位的</span><span class='word_1'>好莱坞式娱乐享受。</span><br/><span class='word_1'>银河VIP+天天美剧</span><span class='word_0'>包月同捆，原价25.8元+17.8元=</span><span class = 'word_1'>43.6元</span><span class='word_0'>，现限时特惠</span><span class = 'word_1'>29.8元</span></div>"
	},{
		menuName: "天天童伴",
		isShowMonth: true,
		isTimeLimit: false,
		data: TTTB_VIP_DATA,
		tipInnerHTML: "<div style='position: absolute;top: 447px; width: 900px; left: 275px;'><span class='word_1'>天天童伴套餐，</span><span class='word_0'>面向3-12岁儿童开设，提供小朋友最爱的动画片、课外兴趣培养节目、儿童英语教育和德育节目，送给小朋友们最科学的精神食粮。</span><span class='word_1'></span><span class='word_0'></span><span class='word_1'></span><span class='word_0'></span><span class='word_1'>每月更新40小时以上。</span></div>"
	}
]

var PAY_WUHAN = {
	menuName: "直播",
		isShowMonth: true,
		isTimeLimit: false,
		data: [{
				   title:'直播',
				   price: 19800,
				   periodLength: 12,
				   sessionId:1,
				   serviceId: 60,
				   serviceCode:4,
				   serviceName: '基本标清一年',
			   },{
				   title:'直播',
				   price: 19800,
				   periodLength: 24,
				   sessionId:1,
				   serviceId: 61,
				   serviceCode:4,
		           serviceName: '基本标清两年'
			  },{
				   title:'直播',
				   price: 19800,
				   periodLength: 36,
				   sessionId:1,
		           serviceId: 62,
		           serviceCode:4,
		           serviceName: '基本标清三年'
              }],
		      tipInnerHTML: ""
}
var PAY_CHONGQING = {
	menuName: "直播",
		isShowMonth: true,
		isTimeLimit: false,
		data: [{
				   title:'直播',
				   price: 19800,
				   periodLength: 12,
				   sessionId:1,
				   serviceId: 70,
				   serviceCode:16,
				   serviceName: '基本标清一年',
			   },{
				   title:'直播',
				   price: 19800,
				   periodLength: 24,
				   sessionId:1,
				   serviceId: 71,
				   serviceCode:16,
		           serviceName: '基本标清两年'
			  }],
		      tipInnerHTML: ""
}
var PAY_CHANGSHA = {
	menuName: "直播",
		isShowMonth: true,
		isTimeLimit: false,
		data: [{
				   title:'直播',
				   price: 19800,
				   periodLength: 12,
				   sessionId:1,
				   serviceId: 73,
				   serviceCode:17,
				   serviceName: '基本标清一年',
			   },{
				   title:'直播',
				   price: 19800,
				   periodLength: 24,
				   sessionId:1,
				   serviceId: 74,
				   serviceCode:17,
		           serviceName: '基本标清两年'
			  }],
		      tipInnerHTML: ""
}
var PAY_GUIYANG = {
	menuName: "直播",
		isShowMonth: true,
		isTimeLimit: false,
		data: [{
				   title:'直播',
				   price: 19800,
				   periodLength: 12,
				   sessionId:1,
				   serviceId: 76,
				   serviceCode:18,
				   serviceName: '基本标清一年',
			   },{
				   title:'直播',
				   price: 19800,
				   periodLength: 24,
				   sessionId:1,
				   serviceId: 77,
				   serviceCode:18,
		           serviceName: '基本标清两年'
			  }],
		      tipInnerHTML: ""
}
var LIVE_UPDATE_PAY = {
	menuName: "直播升级",
	isShowMonth: true,
	isTimeLimit: false,
	data: shengji,
	tipInnerHTML: "<div style='top: 447px;left: 275px;position: absolute; width: 900px;'><span class='word_0' style='font-size: 28px;'>补齐差价即可将已购买的<span class='word_1' style='font-size: 32px;'>直播70+</span>产品升级至<span  class='word_1' style='font-size: 32px;'>直播100+</span>产品哦~</span><span  class='word_0'></span><span class='word_1'></span><span class='word_0'></span></div><div style='top: 487px;left: 275px;position: absolute;'><span class='word_0' style='font-size: 28px;'>升级后的产品到期时间与原购买的直播70+产品到期时间相同。</span><span class='word_1'></span><span class='word_0'></span></div>"
}

