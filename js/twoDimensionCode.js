/*
 * 设置二维码（参数说明）
 * @imgId 图片divid
 * @imgSize 生成图像大小
 * @code 默认为固定的10001
 */
function setTwoDimensionCode(imgId,imgSize,code){
	if(typeof(imgSize) == "undefined" || imgSize == ""){
		imgSize = 5;
	}
	if(typeof(code) == "undefined" || code == ""){
		code = "100001";
	}
	var caIp = "127.0.0.1";
	var cntvid = "111111111111";//终端唯一标示
	try{
		cntvid = globalVar.get("ca_stbid");
		caIp = globalVar.get("ca_ip") + ":10063";
	}catch(e){}
    var apkUrl = APK_URL+"?"+cntvid;
    var url= VODEPG_SERVER + "/twoDimensionCodeAction.action?ipAdd=" + caIp + "&imgSize="+imgSize+"&cntvid="+apkUrl+"&code="+code;
	if($(imgId)!=undefined){
		$(imgId).setAttribute("src",url);
	}
}