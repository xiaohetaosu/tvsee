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
		price: 1980,
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
		price: 10800,
		periodLength: 6,
		sessionId:1,
		serviceId: 2,
		serviceName: 'VIP影院半年包',
		serviceCode: ''
	},{
		getFocusImg: 'images/order/year_sel.png',
		loseFocusImg: 'images/order/year_nosel.png',
		packpageName: "时长12个月<br/>年包优惠价100元<br/><span style='color:red;font-size:20px'>五一特惠，加赠3个月</span>",
		price: 19800,
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
	},]
}

var positionInfo = {
	"19,20":{
		focus: 0,
		position: [{ 
			left: "280px",
			getFocusImg: 'images/order/jiluVIP_sixMonth_sel.png',
			loseFocusImg: 'images/order/jiluVIP_sixMonth.png'
		},{
			left: "710px",
			getFocusImg: 'images/order/jiluVIP_year_sel.png',
			loseFocusImg: 'images/order/jiluVIP_year_.png'
	}]},
	"1,2,3":{              
		focus: 1,
		position: [{
			left: "60px",
			getFocusImg: 'images/order/month_sel.png',
			loseFocusImg: 'images/order/month_nosel.png'		   
		},{
			left: "476px",
			getFocusImg: 'images/order/six_months_sel.png',
			loseFocusImg: 'images/order/six_months_nosel.png'
		},{
			left: "892px",
			getFocusImg: 'images/order/year_sel.png',
			loseFocusImg: 'images/order/year_nosel.png'
	}]},
	"6,7":{
		focus: 0,
		position: [{ 
			left: "280px",
			getFocusImg: 'images/order/jiluVIP_sixMonth_sel.png',
			loseFocusImg: 'images/order/jiluVIP_sixMonth.png'
		},{
			left: "710px",
			getFocusImg: 'images/order/jiluVIP_year_sel.png',
			loseFocusImg: 'images/order/jiluVIP_year_.png'
	}]}
}

var yinHeVipServiceIds = "1,2,3";
var shengjiServiceId = "34"
var jiluVipSErviceIds = "19,20";
var jiqingVipSErviceIds ="6,7"
var cardServiceId = ",17,18,39";  //通过卡密订购的serviceId
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
var livePayChengduServiceId_2 = ",28,29,30"
var yinheChengduServiceId ="1,2,3,17";
var zuheServiceId ="31,32,33";
var jiluServiceId = "19,20";
var shengjiS=",34,46"
var zanshengji = ",44"
var livePayChengdu =[
{
	title:'直播',
		price: 19800,
		periodLength: 12,
		sessionId:1,
		serviceId: 25,
		serviceCode:4,
		serviceName: '基本标清一年'
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
		serviceName: '增值高清一年'
},{
	title:'直播',
		price: 19800,
		periodLength: 24,
		sessionId:1,
		serviceId: 36,
		serviceCode:5,
		serviceName: '增值高清两年'
},{
	title:'直播',
		price: 19800,
		periodLength: 36,
		sessionId:1,
		serviceId: 37,
		serviceCode:5,
		serviceName: '增值高清三年'
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
		serviceId: 11,
		serviceName: '直播一年'
	},{
		title:'直播',
		price: 29800,
		periodLength: 24,
		sessionId:1,
		serviceId: 12,
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
	serviceId: 11,
	serviceName: 'VIP影院月包'
},{
	title:'直播',
	price: 29800,
	periodLength: 24,
	sessionId:1,
	serviceId: 12,
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
	serviceId: 3,
	serviceName: 'VIP影院月包'
},{
	title:'银河VIP影院',
	price: 29800,
	periodLength: 24,
	sessionId:1,
	serviceId: 9,
	serviceName: 'VIP影院月包'
},{
	title:'银河VIP影院',
	price: 39800,
	periodLength: 36,
	sessionId:1,
	serviceId: 10,
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
//,{
//		getFocusImg: 'images/order/season_sel.png',
//		loseFocusImg: 'images/order/season_nosel.png',
//		packpageName: "时长6个月<br/>半年包优惠价60元<br/><span style='color:red;font-size:20px'>五一特惠，加赠1个月</span>",
//		title:'银河VIP影院包季包',
//		price: 5600,
//		periodLength: 3,
//		sessionId:1,
//		serviceId: 4,
//		serviceName: 'VIP影院季包',
//		serviceCode: ''
//	}
//,{
//			left: "340px",
//			getFocusImg: 'images/order/season_sel.png',
//			loseFocusImg: 'images/order/season_nosel.png'
//		}