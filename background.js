
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


function start()
{
    //新建outTab
    chrome.tabs.create({url:"outPut.html",index:0,selected:false},function(tab)
    {
        outTabsId = tab.id;
        tab
        console.debug("outTabsId:"+outTabsId);
    })

    //新建 存储结果的 tab
    chrome.tabs.create({url:"http://127.0.0.1:8080",index:0,selected:false},function(tab)
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


chrome.browserAction.onClicked.addListener(start);

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
   // console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension"); 

    save_data(message);   
    console.debug("message::"+message);
    sendResponse({reponse:"goodyes"});
});


//远程存储到 本地文件或数据库
function save_data(sate)
{
    var myDate = new Date();
    var moth = myDate.getMonth()+1;
    var time = moth + "_" + myDate.getDate() + "_" + myDate.getHours() + "_" + myDate.getMinutes() + "_" + myDate.getSeconds();


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
    saveUrlString = saveUrlString + sate + "_" +time + "_" + Chenged + "_" + userId + "_" + userName;

    chrome.tabs.update(saveDataTabsId,{url:saveUrlString,selected:false},
        function(tab){
            console.debug(tab);
        }); 
}


















