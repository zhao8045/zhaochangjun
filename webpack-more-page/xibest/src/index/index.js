import 'common/css/swiper.min.css';
import 'common/css/common.less';
import './index.less';

import $ from 'common/publicJs/jquery.min.js';
import 'common/publicJs/swiper.min.js';

import { header , footer } from 'common/publicJs/common-html.js';

/*引入头部和底部*/
$(function(){
	$(".header").html(header);
	$(".footer").html(footer);
	
	$(".league_list").clone(true).appendTo(".lists");
   	var num=0;
   	var time=setInterval(move,10);
   	var width=$(".league_list").width();
   	function move(){
   		num+=0.5;
   		if(num>width){
   			num=0;
   		}
   		$(".league_list").css("left",-num+"px");
    };
    if(window.innerWidth>991){
    	$(".league_list").mouseover(function(){
	 		clearInterval(time);
	 	});
	 	$(".league_list").mouseout(function(){
	 		time=setInterval(move,10);
	 	});
    }
});

var mySwiper = new Swiper('.banner', {
	autoplay: false,//可选选项，自动滑动
	loop:true,//循环模式
	pagination : '.swiper-pagination',//分页器
	nextButton: ".swiper-button-next", //下一个
    prevButton: ".swiper-button-prev" ,//上一个
	paginationType : 'bullets',
	autoplayDisableOnInteraction : false,
	paginationClickable :true,
});
