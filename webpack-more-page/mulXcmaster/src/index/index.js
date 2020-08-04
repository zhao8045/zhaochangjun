import Vue from 'vue';

import ElementUI from 'element-ui'; // 引入element UI
// import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI); // 使用element UI

import 'common/css/common.less'; // 全局css
import 'common/css/iconfont.css';// 引入icon

import './index.less';// 引入css
import mm from 'common/media/mm.mp4';// 引入video资源

import Layout from 'common/components/Layout.vue'
new Vue({
	el:'#app',
	components: { Layout },
	data() {
		return {
		  activeIndex: 'index',
		  mm:mm,
		  videoDom:''
		}
	},
	created(){
		
	},
	mounted() {
		this.videoDom=this.$refs.video
	},
	methods: {
		//播放
	    play(){
			this.videoDom.play()
		},
		//暂停
		pause(){
			this.videoDom.pause()
		},
		//倍速
		speed(num){
			this.videoDom.playbackRate=num
		},
	}
});
