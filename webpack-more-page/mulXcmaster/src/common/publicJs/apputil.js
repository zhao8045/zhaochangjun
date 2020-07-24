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