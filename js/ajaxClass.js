function doAjax(url, params, callbackMethod){
	getJSONP(url, params, callbackMethod);
}
function  getJSONP(url,params,callbackMethod){	
	jQuery.ajax({	     
	     url:url,
	     dataType:"jsonp",
	     success:function(data){
	     	callbackMethod.call(this,data,"success");
	     },
	     error:function(XMLHttpRequest, textStatus, errorThrown){
	     	//alertMsgBox("@@@ error:"+XMLHttpRequest+"#"+textStatus+"#"+errorThrown);
	     },
	     timeout:function(){
	     	//alertMsgBox("TTTTT");
	     }
	});
}

