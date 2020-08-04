import Vue from 'vue';

import ElementUI from 'element-ui'; // 引入element UI
// import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI); // 使用element UI

import 'common/css/common.less'; // 全局css
import 'common/css/iconfont.css';// 引入icon

import './home.less';// 引入css
import 'common/js/canvas-animation.js';//引入canvas特效

import background from 'common/img/images/background.png'
import loading from 'common/img/images/loading.png'
import pause from 'common/img/images/pause.png'
import play from 'common/img/images/play.png'
import hero from 'common/img/images/hero.png'
import bullet from 'common/img/images/bullet.png'
import enemy1 from 'common/img/images/enemy1.png'
import enemy2 from 'common/img/images/enemy2.png'
import enemy3 from 'common/img/images/enemy3.png'

import explosion1 from 'common/img/images/explosion/explosion1.png'
import explosion2 from 'common/img/images/explosion/explosion2.png'
import explosion3 from 'common/img/images/explosion/explosion3.png'
import explosion4 from 'common/img/images/explosion/explosion4.png'
import explosion5 from 'common/img/images/explosion/explosion5.png'
import explosion6 from 'common/img/images/explosion/explosion6.png'
import explosion7 from 'common/img/images/explosion/explosion7.png'
import explosion8 from 'common/img/images/explosion/explosion8.png'
import explosion9 from 'common/img/images/explosion/explosion9.png'
import explosion10 from 'common/img/images/explosion/explosion10.png'
import explosion11 from 'common/img/images/explosion/explosion11.png'
import explosion12 from 'common/img/images/explosion/explosion12.png'
import explosion13 from 'common/img/images/explosion/explosion13.png'
import explosion14 from 'common/img/images/explosion/explosion14.png'
import explosion15 from 'common/img/images/explosion/explosion15.png'
import explosion16 from 'common/img/images/explosion/explosion16.png'
import explosion17 from 'common/img/images/explosion/explosion17.png'
import explosion18 from 'common/img/images/explosion/explosion18.png'
import explosion19 from 'common/img/images/explosion/explosion19.png'

import Layout from 'common/components/Layout.vue'
new Vue({
	el:'#app',
	components: {Layout},
	data() {
		return {
		  activeIndex: 'home'
		}
	},
	created() {
		
	},
	mounted() {
		var canvas = this.$refs.canvas; //获取当前画布
		var context = canvas.getContext("2d"); //返回一个用于在画布上绘图的环境
		const WIDTH = canvas.width;   //画布宽度
		const HEIGHT = canvas.height; //画布高度
		// 初始化游戏数据
		// 游戏的五个阶段
		const PREPARE = 0; //游戏准备状态
		const LOADING = 1; //加载游戏状态
		const RUNNING = 2; //游戏中状态
		const PAUSE = 3;   //游戏暂停状态
		const OVER = 4;    //游戏结束状态
		var state = PREPARE; //当前游戏所处状态（与五个状态进行比较，判断当前处于哪一阶段)
		var score = 0; // 游戏的分数
		var life = 3; // 英雄飞机的生命值
		var max_enemy=4;// 最大敌机数
		var bg_speed=1; // 背景移动速度
		var enemy_speed=3; // 敌机移动速度
		var bullet_speed=8; // 子弹移动速度
		var bullets = []; // 存储子弹
		var enemies = [];// 储敌方飞机
		
		var bg_img = new Image(); // 创建背景图片的dom对象
		bg_img.src = background;
		
		var logo = '飞机大战'; // 加载LOGO
		
		var loading_img = new Image();// 创建加载图片的dom对象
		loading_img.src = loading;
		
		var pause_img = new Image();// 创建暂停图片的dom对象
		pause_img.src = pause;
		
		var play_img = new Image();// 创建播放图片的dom对象
		play_img.src = play;
		
		var hero_img = new Image(); // 创建英雄飞机图片的dom对象
		hero_img.src = hero;
		
		var bullet_img = new Image();// 创建子弹图片的dom对象
		bullet_img.src = bullet;
		
		var enemy1_img = new Image(); // 创建敌方小飞机的dom对象
		enemy1_img.src = enemy1;
		var enemy2_img = new Image(); // 创建敌方中飞机的dom对象
		enemy2_img.src = enemy2;
		var enemy3_img = new Image(); // 创建敌方大飞机的dom对象
		enemy3_img.src = enemy3;
		
		// 初始化敌方飞机的数据
		var ENEMY1 = {
		    img : enemy1_img,//图片对象
		    width : 100,//图片宽度
		    height : 76,//图片高度
		    type : 1, // 判断是哪一种飞机
		    frame : 1,
		    life : 1,// 敌机生命数
		    score : 1 // 击毁得分数
		};
		var ENEMY2 = {
		    img : enemy2_img,
		    width : 120,
		    height : 79,
		    type : 2, 
		    frame : 1,
		    life : 5,
		    score : 5
		};
		var ENEMY3 = {
		    img : enemy3_img,
		    width : 296,
		    height : 225,
		    type : 3,
		    frame : 2,
		    life : 10,
		    score : 10
		};
		
		var explosion_imgs = [];
		(function(){
		    var num = 19;
		    var img=new Image();
		    for ( var i = 1;i <= num ;i++ ) {
		        img.src = explosion19;
		        explosion_imgs.push(img)
		    }
		})()
		
		// 自定义构造函数，构造背景动画
		function Bg(){
		    this.imgs = bg_img; //背景图片dom对象
		    this.width = 512; //背景图片的宽度
		    this.height = 512; //背景图片的高度
		    this.x1 = 0; // 背景图片1的x坐标
		    this.y1 = 0; // 背景图片1的y坐标
		    this.x2 = 0; // 背景图片2的x坐标
		    this.y2 = -this.height; //背景图片2的y坐标,第2张图放到第1张上面形成循环
		    // 定义绘制方法
		    this.paint = function(){
		        context.drawImage(this.imgs,this.x1,this.y1);
		        context.drawImage(this.imgs,this.x2,this.y2);
		    };
		    //背景图片运动
		    this.step = function(){
		        this.y1+=bg_speed;
		        this.y2+=bg_speed;
		        // 判断图片的临界值，形成循环
		        if(this.y1 >= this.height){
		            this.y1 = -this.height;
		        }
		        if(this.y2 >= this.height){
		            this.y2 = -this.height;
		        }
		    }
		};
		
		// 自定义构造函数，构造加载动画
		function Loading(){
		    this.img = loading_img;
		    this.width = 819;
		    this.height = 561;
		    this.startIndex=0;// 定义索引值，用于加载动画
		    this.paint = function(){
		        context.drawImage(this.img,this.startIndex,HEIGHT - 160,40,40);
		    };
		    this.time = 0; // 定义一个计数器
		    // 运动方法
		    this.step = function(){
		        this.time ++;
		        if(this.time % 5 == 0){
		            this.startIndex +=10;
		        }
		        // 图片加载完成以后，到下一阶段去
		        if(this.startIndex+60 >= WIDTH){
		            this.startIndex =0;
		            this.time =0;
		            state = RUNNING;//变更当前状态
		        }
		    }
		};
		
		// 自定义构造函数，构造英雄飞机
		function Hero(){
		    this.img = hero_img;
		    this.width = 186;
		    this.height = 130;
		    this.frame = 2;//添加一个状态
		    this.x = WIDTH/2 - 30;// 定义飞机的x坐标居中
		    this.y = HEIGHT - 80;// 定义飞机的y坐标底部
		    this.down = false;//表示飞机是否发生了碰撞，false表示没有碰撞
		    this.candel = false;//表示飞机碰撞以后，碰撞的动画是否执行完成
		    this.paint = function(){
		        context.drawImage(this.img,this.x,this.y,60,50);
		    };
		    this.init=function(){
		        this.x = WIDTH/2 - 30;
		        this.y = HEIGHT - 80;
		        this.down = false;
		        this.candel = false;
		    };
		    this.step = function(){
		        // 飞机发生了碰撞
		        if(this.down){
		            life -- ;
		            if(life <= 0){
		                state = OVER;
		            }else{
		                heros = new Hero();
		            }
		        }
		    };
		    this.time = 0;//计数器
		    //射击方法
		    this.shoot = function(){
		        this.time ++;
		        if(this.time % 7 == 0){
		            bullets.push(new Bullet());
		        }
		    };
		    // 碰撞的属性
		    this.bang = function(){
		        this.down = true;
		    }
		};
		
		// 自定义构造函数，构造子弹
		function Bullet(){
		    this.imgs = bullet_img;
		    this.width = 62;
		    this.height = 108;
		    this.x = heros.x + 25; // 子弹x坐标
		    this.y = heros.y - 15; // 子弹y坐标
		    this.paint = function(){
		        context.drawImage(this.imgs,this.x,this.y,10,20);
		    };
		    this.step = function(){
		        this.y -= bullet_speed;
		    };
		    this.candel = false;//标识子弹是否发生碰撞
		    // 碰撞的属性
		    this.bang = function(){
		        this.candel = true;
		    }
		};
		
		// 自定义构造函数，构造敌方飞机
		function Enemy(config){
		    this.img = config.img;
		    this.width = config.width;
		    this.height = config.height;
		    this.type = config.type;
		    this.frame = config.frame;
		    this.life = config.life;
		    this.score = config.score;
		    this.x = Math.random() * (WIDTH - this.width);// 随机x坐标
		    this.y = -this.height;// y坐标
		    this.startIndex = 0;// 索引
		    this.down = false;// 飞机是否发生了碰撞，false表示没有碰撞
		    this.candel = false;// 表示飞机碰撞以后，碰撞的动画是否执行完成
		    this.paint = function(){
		        if(!this.candel){
					context.drawImage(this.img,this.x,this.y);
		        }
		        if( this.down){
		            context.drawImage(explosion_imgs[this.startIndex],this.x+this.width/2-30,this.y+this.height/2,60,60);
		        }
		        
		    };
		    this.step = function(){
		        if(!this.down){
		            this.y +=enemy_speed;
		        }else{
		            this.startIndex++;
		             if(this.startIndex == explosion_imgs.length){
		                 this.candel = true;
		                 this.startIndex = this.length - 1;
		             }
		            this.candel = true;
		        }
		    };
		    this.checkHit = function(obj){   //检测是否发生碰撞（参数是子弹或英雄飞机）
		        return (obj.x + obj.width > this.x+5
		        && obj.x < this.x + this.width-2
		        && obj.y + obj.height > this.y+5
		        && obj.y < this.y + this.height-2)
		    };
		    // 撞击的方法，用于修改飞机是否碰撞的属性
		    this.bang = function(){
		        this.life -- ;
		        if(this.life == 0){
		            this.down = true;
		            score += this.score;
		        }
		    }
		};
		
		var bg = new Bg(); // 创建背景图片动画的对象
		var load = new Loading(); // 创建加载动画效果的对象
		var heros = new Hero();// 创建英雄飞机的对象
		
		// 绘制所有的子弹
		function bulletsPaint(){
		    for(var i = 0;i < bullets.length;i++){
		        bullets[i].paint()
		    }
		};
		// 绘制所有的子弹的运动
		function bulletsStep(){
		    for(var i = 0;i < bullets.length;i++){
		        bullets[i].step()
		    }
		};
		// 子弹移出画布或发生碰撞以后，把子弹从数组中删除
		function bulletsDel(){
		    for(var i = 0;i < bullets.length;i++){
		        if(bullets[i].y < -bullets[i].height || bullets[i].candel){
		            bullets.splice(i,1);
		        }
		    }
		};
		
		// 往数组中去添加飞机
		function pushEnemies(){
		    if(enemies.length<max_enemy){
		        var rand = Math.floor(Math.random() * 100);
		        if(rand < 20){
		            enemies.push(new Enemy(ENEMY1))
		        }else if(rand > 95){
		            enemies.push(new Enemy(ENEMY2))
		        }else if(rand == 50){
		            enemies.push(new Enemy(ENEMY3))
		        }
		    }
		};
		// 敌方飞机的绘制函数
		function paintEnemies(){
		    for(var i = 0;i < enemies.length;i++){
		        enemies[i].paint()
		    }
		};
		// 敌方飞机的运动函数
		function stepEnemies(){
		    for(var i = 0;i < enemies.length;i++){
		        enemies[i].step()
		    }
		};
		// 敌方飞机移出画布或发生碰撞以后，把敌方飞机从数组中删除
		function delEnemies(){
		    for(var i = 0;i < enemies.length;i++){
		        if(enemies[i].y > HEIGHT || enemies[i].candel){
		            enemies.splice(i,1);
		        }
		    }
		};
		
		// 检测是否有碰撞
		function hitEnemies(){
		    for(var i = 0;i < enemies.length;i++){
		        // 与英雄飞机碰撞
		        if(enemies[i].checkHit(heros)){
		            enemies[i].bang();
		            heros.bang();
		        }
		        // 被子弹碰撞
		        for(var j = 0;j < bullets.length;j++){
		            if(enemies[i].checkHit(bullets[j])){
		                enemies[i].bang();
		                bullets[j].bang();
		            }
		        }
		    }
		};
		
		//  显示分数和生命
		function showScore(){
		    context.fillStyle = "#ffffff";
		    context.font = "bold 14px Arial";
		    context.fillText("SCORE:" + score,15,30);
		    context.fillText("LIFE:" + life,(WIDTH-context.measureText('LIFE:').width)-20,30);
		};
		
		// onmouseout鼠标移出事件，鼠标移出游戏暂停
		canvas.onmouseout = function(){
		    if(state == RUNNING){
		        state = PAUSE;
		    }
		};
		// onmousemove鼠标移动事件，飞机跟随鼠标移动
		canvas.onmousemove = function(event){
		    if(state == RUNNING){
		        var disX =event.offsetX - 30
		        var disY = event.offsetY - 30
		        //限定飞机的活动范围限制在屏幕中
		        if ( disX < 0 ){
		          disX = 0
		        }else if ( disX > WIDTH - 60 ){
		          disX = WIDTH - 60
		        }
		        if ( disY <= 0 ){
		          disY = 0
		        }else if ( disY > HEIGHT - 60 ){
		          disY = HEIGHT - 60
		        }
		        //给英雄飞机赋值x和y坐标
		        heros.x = disX;
		        heros.y = disY;
		    }
		};
		
		//onclick点击事件
		canvas.onclick = function(){
		    if(state == PREPARE){
		        state = LOADING;//变更当前状态
		    }
		    if(state==PAUSE){
		        state = RUNNING;
		    }
		    if(state == OVER){
		        score = 0;//清空分数
		        life = 3;//还原英雄生命数
		        enemies=[];//清空敌机
		        bullets=[];//清空子弹
		        heros.init();
		        state = PREPARE;
		    }
		};
		
		//动画循环
		setInterval(function(){
		    context.clearRect(0, 0, WIDTH, HEIGHT) // 清空画布
		    bg.paint();//绘制背景
		    bg.step();//背景运动
		    var rand = Math.floor(Math.random() * 10);//产生随机数
		    switch (state) {
		        case PREPARE://准备状态
		            context.fillStyle = "#ffffff"
		            context.font = "bold 28px Arial";
		            context.fillText(logo,(WIDTH-context.measureText(logo).width)/2,100);
		            context.drawImage(play_img,(WIDTH-80)/2,HEIGHT - 200,80,80);
		            context.font = "14px Arial";
		            context.fillText('点击开始',(WIDTH-context.measureText('点击开始').width)/2,HEIGHT - 100);
		            break;
		        case LOADING://第二阶段 游戏加载阶段
		            load.paint();//绘制加载图
		            load.step();//加载图移动
		            context.fillStyle = "#ffff00";
		            context.font = "14px Arial";
		            context.fillText('加载中...',(WIDTH-context.measureText('加载中...').width)/2,HEIGHT - 60);
		            break;
		        case RUNNING://第三阶段 游戏运行中
		            hitEnemies();//检测碰撞
		            heros.paint();//绘制英雄
		            heros.step();//英雄移动
		            heros.shoot();//子弹射击
		            bulletsPaint();//绘制所有子弹
		            bulletsStep();//所有子弹移动
		            bulletsDel();//删除子弹
		            if(rand>=7){
		                pushEnemies();//生成敌机
		            }
		            paintEnemies();//绘制所有敌机
		            stepEnemies();//所有敌机移动
		            delEnemies();//删除敌机
		            showScore();//显示分数和生命
		            break;
		        case PAUSE://第四阶段 游戏暂停
		            heros.paint();//绘制英雄
		            bulletsPaint();//绘制所有子弹
		            paintEnemies();//绘制所有敌机
		            showScore();//显示分数和生命
		            context.drawImage(pause_img,(WIDTH-80)/2,HEIGHT - 200,80,80);
		            context.font = "14px Arial";
		            context.fillText('点击继续',(WIDTH-context.measureText('点击继续').width)/2,HEIGHT - 100);
		            break;
		        case OVER: //第五阶段 GAME OVER
		            heros.paint();//绘制英雄
		            bulletsPaint();//绘制所有子弹
		            paintEnemies();//绘制所有敌机
		            showScore();//显示分数和生命
		            context.fillStyle = "#ffffff"
		            context.font = "bold 28px Arial";
		            context.fillText('GAME OVER !',(WIDTH-context.measureText('GAME OVER !').width)/2,100);
					context.drawImage(play_img,(WIDTH-80)/2,HEIGHT - 200,80,80);
		            context.font = "14px Arial";
		            context.fillText('点击重玩',(WIDTH-context.measureText('点击重玩').width)/2,HEIGHT - 100);
		            break;
		    }
		},50)
	},
	methods: {
	    
	}
});