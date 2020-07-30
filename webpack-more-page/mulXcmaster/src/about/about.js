import ElementUI from 'element-ui'; // 引入element UI
// import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI); // 使用element UI

import 'common/css/common.less'; // 全局css
import 'common/css/iconfont.css';// 引入icon

import './about.less';// 引入css

// import $ from 'common/publicJs/jquery.min.js';// 引入JQ

import Layout from 'common/components/Layout.vue'

import Vue from 'vue';
new Vue({
	el:'#app',
	components: {Layout},
	data:{
		activeIndex: 'about',
		message:'this is about page!',
		tip:'这是我的多页测试页面'
	},
	created() {
		this.tip="这是about页面"
	},
	methods: {
	    
	}
});
