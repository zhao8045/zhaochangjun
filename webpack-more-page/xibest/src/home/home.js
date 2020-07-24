import 'common/css/common.less';
import 'common/css/iconfont.css';
import './home.less';

document.getElementById('home').innerHTML = 'this is home page!';
console.log('home');

import {axiosPostONB,axiosPostATM} from 'common/publicJs/apputil.js';

var param = {
	type:'2'//业务类型（1. 商城，2. 发现）
};
axiosPostATM(param,'C00001').then(function(data){
	console.log(data);
}).catch(function(data){
	console.log(data);
});

var param = {
	action:'get_trade_info'
};
axiosPostONB(param, 'tools/ajax.ashx').then(function(data){
	console.log(data);
}).catch(function(err){
	console.log(err);
});

