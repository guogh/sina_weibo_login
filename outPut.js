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

    //
    var btn=document.getElementById('save_to_file');
    btn.onclick=save_to_file;
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

//接收消息
chrome.extension.onMessage.addListener(function(data,sender,sendResponse)
{
    var message =data.stat;
    var user_uid=data.user_uid;
    var user_name= unescape(data.user_name.replace(/\u/g, "%u"));//eval("'" + data.user_name + "'");
    user_name= unescape(user_name.replace(/\\/g, "")); 
    document.getElementById("user_name").innerHTML = "微博名字： "+user_name+" 的在线时间统计";


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
    
    

    var start = "";
    if(isChenged == message)
    { //没有改变状态
	     start = "";
    }
    else
    {  //改变了状态
	     isChenged = message;
	     start = "yes";
	
	     var html_sun = "<tr><td>"+message+"</td><td>"+ time +"</td><td>"+start+"</td></tr>";
	     sunallhtml(html_sun);
    }

    var html = "<tr><td>"+message+"</td><td>"+ time +"</td><td>"+start+"</td></tr>";
    addhtml(html);
});


//保存到文件
function save_to_file(){
    alert("敬请期待！");

    // chrome.fileSystem.chooseEntry({type: 'saveFile'}, function(Entry){
    //     console.log(Entry);
    //     //do something with Entry
    // });

}




