import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'

//axios配置

//全局的 axios 默认值:指定将被用在各个请求的配置默认值
axios.defaults.timeout = 20000;//设置超时时间
//axios.defaults.baseURL = process.env.API_ROOT;
//axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';//此处是增加的代码，设置请求头的类型
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    return config
}, function (error) {
    return Promise.reject(error)
});
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.reject(error);
});

var cancelArr=[];
export { cancelArr }

//ATM后台请求
export function axiosPostATM(params, transCode){
	//配置ATM后台请求地址
	let axiosTemp = axios.create({
		baseURL: process.env.API_ROOT_ATM,
		cancelToken : new axios.CancelToken(cancel => {
		    cancelArr.push({cancel})
		})
	});
	let finalUrl = 'TransServlet';//请求地址默认拼接TransServlet
	let finalData = getparams(params, transCode, 'service');//配置上行报文公共包头
	return new Promise(function(resolve, reject){
		axiosTemp.post(finalUrl, finalData).then(response => {
			let data = response.data;
			if(data.returnCode == successCode){
				resolve(data);
			}else{
				reject(data);
			}
		}).catch(error => {
			let err;
			if(error.message.indexOf('timeout') != -1){
				err = {
					returnMsg:'请求超时'
				};
			}else{
				err = {
					returnMsg:'通讯异常'
				};
			}
			reject(err);
		});
	});	
}
//ATM文件上传
export function axiosPostATMFile(params, transCode){
	let axiosTemp = axios.create({
		baseURL: process.env.API_ROOT_ATM,
		cancelToken : new axios.CancelToken(cancel => {
		    cancelArr.push({cancel})
		}),
		timeout: 30000,
  		headers: { "Content-Type": "multipart/form-data" }
	});
	let finalUrl = 'TransServlet';//请求地址默认拼接TransServlet
	params.append("transCode", transCode);
	params.append("clientToken", getClientToken());
	params.append("userId", store.get('userId') || '');
	params.append("channelNo", 'service');
	params.append("transTime", getNowTime());
	let finalData = params;//配置上行报文公共包头
	return new Promise(function(resolve, reject){
		axiosTemp.post(finalUrl, finalData).then(response => {
			let data = response.data;
			if(data.returnCode == successCode){
				resolve(data);
			}else{
				reject(data);
			}
		}).catch(error => {
			let err;
			if(error.message.indexOf('timeout') != -1){
				err = {
					returnMsg:'请求超时'
				};
			}else{
				err = {
					returnMsg:'通讯异常'
				};
			}
			reject(err);
		});
	});
}
//ONB钱包相关请求
export function axiosPostONB(params, url){
	//配置ONB钱包登录请求地址
	let axiosTemp = axios.create({
		baseURL: process.env.API_ROOT_ONB,
		cancelToken : new axios.CancelToken(cancel => {
		    cancelArr.push({cancel})
		})
	});
	return new Promise(function(resolve, reject){
		axiosTemp.get(url, {
			params: params
		}).then(response => {
			let data = response.data;
			if(data.status == '1'){
				resolve(data);
			}else{
				reject(data);
			}
		}).catch(error => {
			let err;
			if(error.message.indexOf('timeout') != -1){
				err = {
					msg:'请求超时'
				};
			}else{
				err = {
					msg:'通讯异常'
				};
			}
			reject(err);
		});
	});
}
//区块链请求
export function axiosPostBC(params, transCode){
	let randomNum = store.get('randomNum') || 0;
	//配置区块链请求地址
	let axiosTemp = axios.create({
		baseURL: chainApi[randomNum],
		cancelToken : new axios.CancelToken(cancel => {
		    cancelArr.push({cancel})
		})
	});
	let finalData = getparams(params, transCode, 'xionb');//配置上行报文公共包头
	return new Promise(function(resolve, reject){
		axiosTemp.post('xionb/TransServlet', qs.stringify(finalData)).then(response => {
			let data = response.data;
			if(data.returnCode == successCode){
				resolve(data);
			}else{
				reject(data);
			}
		}).catch(error => {
			let err;
			if(error.message.indexOf('timeout') != -1){
				err = {
					returnMsg:'请求超时'
				};
			}else{
				err = {
					returnMsg:'通讯异常'
				};
				//存储ONB钱包区块链请求地址的随机数
				if(randomNum < chainApi.length - 1){
					randomNum++;
				}else{
					randomNum = 0;
				}
				store.set('randomNum',randomNum);
			}
			reject(err);
		});
	});
}

//基于hammer.js 触摸屏事件
function vueTouch(el,type,binding){  
    this.el = el;  
    this.type = type;  
    this.binding = binding;  
    //直接调用  hammer.js方法
    var hammertime = new Hammer(this.el);  
    hammertime.on(this.type,this.binding.value);  
};  

//触摸点击事件
export const tap = Vue.directive("tap",{  
    bind:function(el,binding){  
        new vueTouch(el,"tap",binding);  
    }  
});  
//左滑事件
export const swipeleft = Vue.directive("swipeleft",{  
    bind:function(el,binding){  
        new vueTouch(el,"swipeleft",binding);  
    }  
});  
//右滑事件 
export const swiperight = Vue.directive("swiperight",{  
    bind:function(el,binding){  
        new vueTouch(el,"swiperight",binding);  
    }  
});  
//长按事件  
export const press = Vue.directive("press",{  
    bind:function(el,binding){  
        new vueTouch(el,"press",binding);  
    }  
});



//加密密码
export function enPasswd(password){
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
export function getparams(params,transCode,system) {
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
export function getNowTime(){
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
export function accMul(arg1, arg2){
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
export function getImage(imageId){
	return imageSever + getClientToken() +'&userId='+imageId;
}

//禁止长按图片出现放大镜
//window.onload=function(){
//  document.documentElement.style.webkitTouchCallout='none';
//};


//账号规则验证
export function telReg(accountNum){
	if(accountNum){
		let RegExp = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
		if(RegExp.test(accountNum)){
			return true
		}else{
			return "手机号格式错误";
		}
	}else{
		return "手机号不能为空";
	}
}
//验证码验证
export function codeReg(verificationCode){
	if(verificationCode){
		let RegExp = /^[0-9]{6}$/;
  		if(RegExp.test(verificationCode)){
  			return true
  		}else{
  			return "验证码格式错误";
  		}
	}else{
		return "验证码不能为空";
	}
}
//密码规则验证
export function pwdReg(password){
	if(password){
		let week = /^[a-zA-Z]{8,16}$/;//弱:8位 纯字母
		let weeks = /^[0-9]{8,16}$/;//弱:8位 纯数字
	    let middle = /^(?!\d+$)(?![a-zA-Z]+$)[\dA-Za-z]{8,16}$/;//中:8-16位 数字+字母
	    let strongest = /^(?=.*((?=[\x21-\x7e]+)[^A-Za-z0-9]))(?=.*[a-zA-Z])(?=.*[0-9])[^\u4e00-\u9fa5]{8,16}$/;//强:8-16位 数字+字母+字符
  		if(week.test(password) || weeks.test(password) || middle.test(password) || strongest.test(password)){
  			return true
  		}else{
  			return "密码不符合要求";
  		}
	}else{
		return "密码不能为空";
	}
}
//二次密码规则验证
export function secondpswReg(password1,password2){
	if(password2){
  		if(password1 == password2){
  			return true
  		}else{
  			return "密码不一致";
  		}
  	}else{
  		return "密码不能为空";
  	}
}
//余额转赠、积分转赠规则验证
export function transferNumReg(transferNum,currentBalance,type){
	if(transferNum){
		let RegExp = /^[0-9]+(\.[0-9]{1,2})?$/;
  		if(RegExp.test(transferNum)){
  			if(transferNum.valueOf() >= 0.01){
  				if(transferNum <= currentBalance){
					return true
				}else{
					if(type = 'balance'){
						return "当前余额不足";
					}else{
						return "当前积分不足";
					}
				}
  			}else{
				return "转赠数量不能小于0.01";
  			}
  		}else{
  			return "转赠数量格式错误";
  		}
	}else{
		return "转赠数量不能为空";
	}
}
//钱包地址规则验证
export function AddressReg(walletAddress){
	if(walletAddress){
		let RegExp = /^[a-zA-Z0-9]{23}$/;
  		if(RegExp.test(walletAddress)){
  			return true
  		}else{
  			return '钱包地址不符合要求';
  		}
	}else{
		return "钱包地址不能为空";
	}
}
//转账金额规则验证
export function NumberReg(transferNumber, transferAccountsMax){
	if(transferNumber){
		let RegExp = /^[0-9]+(\.[0-9]{1,6})?$/;
  		if(RegExp.test(transferNumber) && transferNumber.valueOf() > 0){
  			if(transferNumber.valueOf() >= 0.001){
  				if(Number(transferNumber) <= Number(transferAccountsMax)){
					return true
				}else{
					return '余额不足';
				}
  			}else{
  				return "金额不能小于0.001";
  			}
  		}else{
  			return "金额格式不正确";
  		}
	}else{
		return "金额不能为空";
	}
}