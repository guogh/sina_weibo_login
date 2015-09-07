/*

注入到页面的 js

*/


var dataDoc =  window.document.getElementsByTagName("pre")[0].innerHTML;
//console.log(dataDoc);

//查找在线状态  关键字
var offline = dataDoc.search(/W_chat_stat_offline/);
var online = dataDoc.search(/W_chat_stat_online/);

//赋值 
var stat = "un_stat";
if(offline == -1 && online>-1)
{
    stat = "online";
}
else if(offline > -1 && online==-1)
{
    stat = "offline";
}
console.log(stat);

//发送消息
chrome.extension.sendMessage(null,
			     stat,
			     function(data){
				 	console.log(data);
			     });

