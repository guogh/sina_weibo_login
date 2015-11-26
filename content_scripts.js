/*

注入到页面的 js 查找用户在线状态

*/


var dataDoc =  window.document.getElementsByTagName("pre")[0].innerHTML;
console.log(dataDoc);

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
console.log("stat:"+stat);


var user_uid="";
var user_name="";

//uid=1304194202&amp;nick=\u5218\u8bd7\u8bd7\"&gt;&lt;span&gt;&lt;i

var falg = dataDoc.search(/uid=.*\"&gt;&lt;span&gt;&lt;i/);
if(falg>0)
{
	var info=dataDoc.match(/uid=.*\"&gt;&lt;span&gt;&lt;i/)[0];
	if (info.search(/[0-9]{5,20}/) >=0) {
		user_uid=info.match(/[0-9]{5,20}/)[0];
	}
	else{
		user_uid="no_find";
	}


	if (info.search(/\\.*\\/)>=0) {
		user_name=info.match(/\\.*\\/)[0];
	}
	else{
		user_name="no_find";
	}
}

var user_data={};
user_data.stat=stat;
user_data.user_uid=user_uid;
user_data.user_name=user_name;


//发送消息
chrome.extension.sendMessage(null,user_data,cellBack);

//
function cellBack(data){
	console.log("cellBack data:"+data);
}

