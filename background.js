//创建新的 页面
var winid = 0;
var tabsid = 0;
var outTabsId = 0;
var saveDataTabsId = 0;
var isChenged = 0;

var userId = "1304194202";
var userName = "刘诗诗";
var weiboName = "刘诗诗";


//刘诗诗
var urlstring = "http://weibo.com/aj/user/newcard?id=1304194202&usercardkey=weibo_mpj&type=1&callback=STK_14416147840273";


//存储服务器 的 URL
var save_server_url="http://127.0.0.1:8888";

function start(){
    //新建outTab
    chrome.tabs.create({url:"outPut.html",index:0,selected:false},function(tab){
        outTabsId = tab.id;
        console.debug("outTabsId:"+outTabsId);
    })

    //新建 get请求 tab
    chrome.tabs.create({url:save_server_url,index:0,selected:false},function(tab)
    {
        saveDataTabsId = tab.id;
        console.debug("saveDataTabsId:"+saveDataTabsId);
    })

    //新建 获取数据 的tabs
    chrome.tabs.create({url:urlstring, index:0,selected:false},function(tab)
    {
        tabsid = tab.id;
        console.debug(tabsid);
        chrome.tabs.executeScript(tabsid,{file:"content_scripts.js"});
        var t1 = window.setInterval(foo,60000); 
    });
}

//循环刷新
function foo()
{
    chrome.tabs.update(tabsid,{url:urlstring,selected:false},function(tab){
	   console.debug(tab);
	
	   //注入搜索脚本
	   chrome.tabs.executeScript(tabsid,{file:"content_scripts.js"});
    }); 
}


//发送get 请求
function save_data(data)
{
   var sate =data.stat;
   var user_uid=data.user_uid;
   var user_name=data.user_name;
   
   var myDate = new Date();
   var timeJson = {};
   timeJson.month = myDate.getMonth()+1;
   timeJson.day = myDate.getDate();
   timeJson.hour = myDate.getHours();
   timeJson.minute = myDate.getMinutes();
   timeJson.second = myDate.getSeconds();
    

    var Chenged = 0;
    if(isChenged == sate){ 
        //没有改变状态
         Chenged = 0;
    }else{
         //改变了状态
         isChenged = sate;
         Chenged = 1;
    }

    var sendJson = {};
    sendJson.timeJson = timeJson;
    sendJson.state = sate;
    sendJson.Chenged = Chenged;
    sendJson.user_uid = user_uid;
    sendJson.user_name = user_name;

    //转成json字符串
    var stringJson = JSON.stringify(sendJson);
    var get_resqurt_url = save_server_url + "/saveData?parameter=" + stringJson;


    console.log("get_resqurt_url:"+get_resqurt_url);
    chrome.tabs.update(saveDataTabsId,{url:get_resqurt_url,selected:false},function(tab){
            console.debug(tab);
    }); 
}

//接收 消息
chrome.extension.onMessage.addListener(function(message,sender,sendResponse){
    if (message.type== "get_user_info") {
        //获取用户信息脚本 返回的消息
        userId=message.uid;
        console.debug("uid:"+message.uid);
        console.debug("name:"+message.name);
        sendResponse({reponse:"get user info yes"});

        urlstring = "http://weibo.com/aj/user/newcard?id="+userId+"&usercardkey=weibo_mpj&type=1";
        start();
    }else if(message.type == "content_scripts"){
        //搜索用户在线信息脚本 返回的消息
        save_data(message);
        console.debug("message::"+JSON.stringify(message));
        sendResponse({reponse:"get data yes"});
    } else if(message.type == "clean_loca_data"){
        //清除数据，刷新outPut页面。
        chrome.tabs.update(outTabsId,{url:"outPut.html"},function(tab){
            console.debug("清楚数据，刷新页面");
        }); 

        console.debug("message::"+JSON.stringify(message));
        sendResponse({reponse:"get message for clean_loca_data"});
    }
});

//初始化
function initAll()
{
    chrome.tabs.getSelected(null,function (tab){
    		if(tab.id == null || tab.id.length == 0 || tab.title == "扩展程序" || tab.url == "chrome://extensions/"){
    			alert("获取微博用户信息失败，请打开，并选中需要监听的微博主页：messgae:"+tab.url);
    			return;
    		}
    		
        console.log(tab.id);
        chrome.tabs.executeScript(tab.id,{file:"get_user_info.js"});
    });
}

//点击程序图标，运行程序
chrome.browserAction.onClicked.addListener(initAll);













