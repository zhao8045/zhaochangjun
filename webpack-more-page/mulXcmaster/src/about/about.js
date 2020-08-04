import Vue from 'vue';

import ElementUI from 'element-ui'; // 引入element UI
// import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI); // 使用element UI

import 'common/css/common.less'; // 全局css
import 'common/css/iconfont.css';// 引入icon

import './about.less';// 引入css

import Layout from 'common/components/Layout.vue'

new Vue({
	el:'#app',
	components: {Layout},
	data() {
		return {
		  activeIndex: 'about',
		  message:'这是about页面!'
		}
	},
	created() {
	},
	methods: {
	    
	}
});
