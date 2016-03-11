//输出页的 js
var isChenged = 0;

var html_head = "<table class='tb' id='td'>";
var html_body = "<tr><td>状态</td><td>时间</td><td>是否改变</td></tr>" ;
var html_foot = "</table>";

//
var html_head_sum = "<table class='tb'>";
var html_body_sum = "<tr><td>统计</td><td>时间</td><td>状态改变</td></tr>";

window.onload = function()
{
    var html =  "";
    addhtml(html);
    sunallhtml(html);

    //加载本地初始化数据
	getLocalData();
    
    //
    var btn=document.getElementById('save_to_file');
    btn.onclick=save_to_file;

    var clean_btn=document.getElementById('clean_to_file');
    clean_btn.onclick=clean_to_file;
}

//实时刷新
function addhtml(html)
{
    console.log(html);
    html_body = html_body + html;

    if (html_body.length > 60000)
    {
        html_body = "<tr><td>状态</td><td>时间</td><td>是否改变</td></tr>" + html;
    }

    document.getElementById("area").innerHTML = html_head + html_body + html_foot;
}

//状态改变刷新
function sunallhtml(html)
{
    console.log(html);
    html_body_sum = html_body_sum +html;

    if (html_body_sum.length > 60000)
    {
        html_body_sum = "<tr><td>统计</td><td>时间</td><td>状态改变</td></tr>" + html;
    }

    document.getElementById("allarea").innerHTML = html_head_sum + html_body_sum + html_foot;
}

//更新视图
function upDateView(viewData){

    if(viewData.state == "yes"){ //改变状态
         var html_sun = "<tr><td>"+viewData.message+"</td><td>"+ viewData.OnTime +"</td><td>"+viewData.state+"</td></tr>";
         sunallhtml(html_sun);
    }

    var html = "<tr><td>"+viewData.message+"</td><td>"+ viewData.OnTime +"</td><td>"+viewData.state+"</td></tr>";
    addhtml(html);
}

//接收消息
chrome.extension.onMessage.addListener(function(data,sender,sendResponse){
	getMesageData(data);
});

//消息状态封装
var user_name = null;
function getMesageData(data){

    //设置微博名字
    if (user_name == null) {
        var user_uid=data.user_uid;
        user_name= unescape(data.user_name.replace(/\u/g, "%u"));//eval("'" + data.user_name + "'");
        user_name= unescape(user_name.replace(/\\/g, "")); 
        document.getElementById("user_name").innerHTML = "微博名字： "+user_name+" 的在线时间统计";
    };

    var message =data.stat;
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

   
    var state = "";
    if(isChenged == message){ //没有改变状态
	     state = "";
    }else{  //改变了状态
	     isChenged = message;
	     state = "yes";
    }

    var saveData = {};
    saveData.OnTime = time;
    saveData.state = state;
    saveData.message = message;

    //存储到本地
    save_local(saveData);

    //更新视图
    upDateView(saveData);
}


//获取本地持久的化数据
function getLocalData(){
	chrome.storage.local.get("local_mesage_list",function(items){
			var array = items.local_mesage_list;
            if (array == null || array.length == 0)
                return ;

			for (var i=0;i<array.length;i++) {
				var mesage = array[i];
				upDateView(mesage);
			}
		});
}



//本地持久化
function save_local(saveData){
        console.log("chrome.Storage.locale:"+chrome.storage.local.QUOTA_BYTES);
//      QUOTA_BYTES: 5242880
//      clear: ()
//      get: ()
//      getBytesInUse: ()
//      remove: ()
//      set: ()
        chrome.storage.local.get("local_mesage_list",function(items){
            var array = items.local_mesage_list;
            
            if(array==null || array.length ==0 || array[0] == null || array[0].length ==0){
                array = new Array();
            }

            console.log(array.join());
            console.log(JSON.stringify(saveData));
            
            array.push(saveData)
            
            var data = new Object;
            data.local_mesage_list = array;
            chrome.storage.local.set(data,function(){
                for (var i=0;i<array.length;i++) {
                    var mesage = array[i];
                    console.log(JSON.stringify(mesage));
                }
            });
        });
}


//保存到文件
function save_to_file(){
    alert("敬请期待！");
}

//清除本地数据
function clean_to_file(){

    chrome.storage.local.clear(function(){
        var clean_mesage = {};
        clean_mesage.type = "clean_loca_data";

        //发送消息
        chrome.extension.sendMessage(null,clean_mesage,function cellBack(data){
            console.log("cellBack data:"+data);
        });
    });

}



