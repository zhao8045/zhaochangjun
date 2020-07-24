//加密密码
function enPasswd(password){
	var mytoken = getClientToken();
	return DES3.encrypt(mytoken,password);
}

/*前端uuid*/
function uuid() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for ( var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "";
	var uuid = s.join("");
	return uuid;
}

/*存储token*/
function setClientToken(clientToken) {
	store.session(__clientTokenKey,clientToken);
}

/*获取token firstTime 第一次使用，参数传1*/
function getClientToken(firstTime) {
	if(firstTime == 1 || store.session.get(__clientTokenKey) == null || store.session.get(__clientTokenKey) == '') {
		setClientToken(uuid());
	}
	return store.session.get(__clientTokenKey);
}

//完善接口参数
function getparams(params,transCode,system) {
	params['transCode'] = transCode;
	params['clientToken'] = getClientToken();
	params['userId'] = store.get('userId') || '';
	params['channelNo'] = system;
	params['transTime'] = getNowTime();
	return params;
}

/**
 * 获取接口路径
 * urls:服务端应用路径
 * system:系统编码
 */
function geturl(urls,system){
	return urls + system + "/TransServlet";//拍链区块链测试应用路径xibl
}

//数值小于10时前面加零校验
function inspectionTime(num){
	num = num < 10 ? '0' + num : num;
	return num;
}

//转换时间格式为YYYY-MM-DD hh:mm:ss
function convertTimeFormat(date){
	let Y = inspectionTime(date.getFullYear());
  	let M = inspectionTime(date.getMonth() + 1);
  	let D = inspectionTime(date.getDate());
    let h = inspectionTime(date.getHours());
  	let m = inspectionTime(date.getMinutes());
  	let s = inspectionTime(date.getSeconds());
  	return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
}

//获取YYYY-MM-DD hh:mm:ss格式的当前北京时间
function getNowTime(){
	let timezone = 8; //目标时区时间，东八区
	let offset_GMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
	let nowDate = new Date().getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
	let date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
	return convertTimeFormat(date);
}

//比较两个日期大小
function compare(date1,date2) {
	let dates1 = new Date(date1);
	let dates2 = new Date(date2);
	if (dates1 > dates2) {
		return true
	} else {
		return false
	}
}

//解决小数相乘进制bug
function accMul(arg1, arg2){
	let m = 0,
	s1 = arg1.toString(),
	s2 = arg2.toString();
    try{
    	m += s1.split(".")[1].length
    }catch(e){
    	
    }
    try{
    	m += s2.split(".")[1].length
    }catch(e){
    	
    }
    return Number(s1.replace(".","")) * Number(s2.replace(".","")) / Math.pow(10,m);
}

//获取图片
function getImage(imageId){
	return imageSever + getClientToken() +'&userId='+imageId;
}

//禁止长按图片出现放大镜
window.onload=function(){
    document.documentElement.style.webkitTouchCallout='none';
};

//1.5秒的提示消息
function creatTips(tips){
	var createDiv=document.createElement("div");
	createDiv.style.position="fixed";
	createDiv.style.top='0';
	createDiv.style.bottom='0';
	createDiv.style.left="0"; 
	createDiv.style.right="0"; 
	createDiv.style.zIndex="9999999";
	createDiv.style.background="rgba(0,0,0,0)";
	createDiv.style.textAlign="center"; 
	document.body.appendChild(createDiv);
	var createP=document.createElement("p");
	createP.style.position="absolute"; 
	createP.style.top="50%";
	createP.style.left="50%";  
	createP.style.transform="translate(-50%,-50%)";
	createP.style.fontSize="0.46rem";
	createP.style.color="#fff";
	createP.style.margin="auto";  
	createP.style.padding="0.3rem 0.5rem";  
	createP.style.borderRadius="0.2rem"; 
	createP.style.background="rgba(0,0,0,0.8)";
	createP.innerHTML=tips; 
	createDiv.appendChild(createP);
	var time=setTimeout(function(){
		document.body.removeChild(createDiv);
		clearTimeout(time);
	},1500);	
}
