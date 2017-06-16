/*
部分通用js库导入
*/
document.write("<script language='javascript' src='js/jquery-1.8.3.js'></script>"); 
document.write("<script language='javascript' src='js/utile.js'></script>"); 
document.write("<script language='javascript' src='common/keyEvent.js'></script>"); 
document.write("<script language='javascript' src='common/common.js'></script>"); 
document.write("<script language='javascript' src='common/config.js'></script>"); 
document.write("<script language='javascript' src='js/ajaxClass.js'></script>"); 
document.write("<script language='javascript' src='common/focusMoveObj.js'></script>"); 
document.write("<script language='javascript' src='js/simpleCommon.js'></script>");
document.write("<script language='javascript' src='common/liveData.js'></script>");
document.write("<script type='text/javascript' src='js/home.js'></script>");

/* Add by bobo on 2014-02-28 */
var themeCss = "style/theme_gitv.css";
addCssLink("style/index.css");
addCssLink(themeCss);

function addCssLink(url) {
	var link = document.createElement("link");
	link.rel = "stylesheet";
	link.type = "text/css";
	link.href = url;
	document.getElementsByTagName("head")[0].appendChild(link);
};

