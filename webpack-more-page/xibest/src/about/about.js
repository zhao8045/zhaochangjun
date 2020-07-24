import 'common/css/common.less';
import 'common/css/iconfont.css';
import './about.less';

import Vue from 'vue';
new Vue({
	el:'#app',
	data:{
		message:'this is about page!',
		tip:'这是我的多页测试页面'
	}
});
console.log('about');
