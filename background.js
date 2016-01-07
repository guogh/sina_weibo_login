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
var save_server_url="http://127.0.0.1:8080";

function start(){
    //新建outTab
    chrome.tabs.create({url:"outPut.html",index:0,selected:false},function(tab){
        outTabsId = tab.id;
        console.debug("outTabsId:"+outTabsId);
    })

    //新建 存储结果的 tab
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

    });//tabs
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


//接收 搜索脚本 的 搜索结果 消息
chrome.extension.onMessage.addListener(function(message,sender,sendResponse){
    if (message.type== "get_user_info") {
        //获取 检测账号的 用户信息
        userId=message.uid;
        console.debug("uid:"+message.uid);
        console.debug("name:"+message.name);
        sendResponse({reponse:"get user info yes"});


        urlstring = "http://weibo.com/aj/user/newcard?id="+userId+"&usercardkey=weibo_mpj&type=1";
        start();
        return;
    };

    save_data(message);   
    console.debug("message::"+message);
    sendResponse({reponse:"get data yes"});
});


//远程存储到 本地文件或数据库
function save_data(data)
{
   var sate =data.stat;
   var user_uid=data.user_uid;
   var user_name=data.user_name;


    var myDate = new Date();
    var moth = myDate.getMonth()+1;
    var day = myDate.getDate();
    var hh = myDate.getHours();
    var mm = myDate.getMinutes();
    var ss = myDate.getSeconds();
    
    var time = "";
    if(moth<10){
    	time += "0";
    }
    time += moth+"_";
    
    if(day<10){
    	time += "0";
    }
    time += day+"_";
    
    if(hh <10){
    	time+="0";
    }
    time += hh+"_";
    
    if(mm<10){
    	time+="0";
    }
    time+= mm+"_";
    
    if(ss<10){
    	time+= "0";
    }
    time += ss;
    
//  moth + "_" + myDate.getDate() + "_" + myDate.getHours() + "_" + myDate.getMinutes() + "_" + myDate.getSeconds();
	
	console.log(myDate.toLocaleTimeString());

   var Chenged = 0;
    if(isChenged == sate)
    { //没有改变状态
         Chenged = 0;
    }
    else
    {  //改变了状态
         isChenged = sate;
         Chenged = 1;
    }

    var saveUrlString = "http://127.0.0.1:8080/";
    saveUrlString = saveUrlString + sate + "_" +time + "_" + Chenged + "_" + user_uid + "_" + user_name;

    chrome.tabs.update(saveDataTabsId,{url:saveUrlString,selected:false},
        function(tab){
            console.debug(tab);
        }); 
}

function initAll()
{
    chrome.tabs.getSelected(null,function (tab){
    		if(tab.id == null || tab.id.length == 0 || tab.title == "扩展程序" || tab.url == "chrome://extensions/"){
    			alert("chrome.tabs.getSelected error");
    			return;
    		}
    		
        console.log(tab.id);
        chrome.tabs.executeScript(tab.id,{file:"get_user_info.js"});
    });


//	start();



    // console.log(chrome.fileSystem);


    // chrome.fileSystem.chooseEntry({type: 'saveFile'}, function(Entry){
    //     console.log(Entry);
    //     //do something with Entry
    // });
}

//点击程序图标，运行程序
chrome.browserAction.onClicked.addListener(initAll);














