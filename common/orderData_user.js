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
		price: 1200,
		monthLength: 1,
		sessionId:1,
		serviceId: 1,
		serviceName: 'VIP影院月包',
		serviceCode: ''
	},{
		getFocusImg: 'images/order/six_months_sel.png',
		loseFocusImg: 'images/order/six_months_nosel.png',
		packpageName: '时长6个月<br/>半年包优惠价60元',
		title:'银河VIP影院包半年',
		price: 6000,
		monthLength: 6,
		sessionId:1,
		serviceId: 1,
		serviceName: 'VIP影院半年包',
		serviceCode: ''
	},{
		getFocusImg: 'images/order/year_sel.png',
		loseFocusImg: 'images/order/year_nosel.png',
		packpageName: '时长12个月<br/>年包优惠价100元',
		price: 10000,
		title:'VIP影院年包',
		monthLength: 12,
		sessionId:1,
		serviceId: 1,
		serviceName: 'VIP影院年包',
		serviceCode: ''
	}]
}

var orderDefrayMode = {
	title: '请选择您支付的方式',
	defrayModesInfo: [{
		getFocusImg: ['images/order/defray2Img0.png', 'images/order/defray3Img0.png'],
		loseFocusImg: ['images/order/defray2Img1.png', 'images/order/defray2Img1.png'],
		getFocusTitleBg: 'images/order/defrayBg0.png',
		loseFocusTitleBg: 'images/order/defrayBg1.png',
		title: '手机扫描，完成支付',
		payMethod: 'weixin',
		payLogo: 'images/global_tm.gif'
	},{
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