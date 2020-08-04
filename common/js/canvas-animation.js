(function(){
	//查找属性
	function o(w,v,i){
		return w.getAttribute(v)||i
	}
	//查找对应的标签
	function j(i){
		return document.getElementsByTagName(i)
	}
	//行内样式设定
	function l(){
		var i=j("script"),w=i.length,v=i[w-1];
		return{
			l:w,
			z:o(v,"zIndex",-1),//线条显示层级
			o:o(v,"opacity",0.5),//线条透明度
			c:o(v,"color","64,218,252"),//线条颜色
			n:o(v,"count",200)//线条数量
		}
	}
	//获取窗口宽高
	function k(){
		r=u.width=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;//获取窗口的宽度
		n=u.height=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight//获取窗口的高度
	}
	//canvas实现
	function b(){
		e.clearRect(0,0,r,n);
		var w=[f].concat(t);
		var x,v,A,B,z,y;
		t.forEach(function(i){
			i.x+=i.xa,
			i.y+=i.ya,
			i.xa*=i.x>r||i.x<0?-1:1,
			i.ya*=i.y>n||i.y<0?-1:1,
			e.fillRect(i.x-0.5,i.y-0.5,1,1);
			for(v=0;v<w.length;v++){
				x=w[v];
				if(i!==x&&null!==x.x&&null!==x.y){
					B=i.x-x.x,
					z=i.y-x.y,
					y=B*B+z*z;
					y<x.max&&(
						x===f&&y>=x.max/2&&(i.x-=0.03*B,i.y-=0.03*z),
						A=(x.max-y)/x.max,
						e.beginPath(),
						e.lineWidth=A/1,//线条粗细
						e.strokeStyle="rgba("+s.c+","+(A+0.2)+")",//线条颜色
						e.moveTo(i.x,i.y),//起点
						e.lineTo(x.x,x.y),//终点
						e.stroke()
					)
				}
			}
			w.splice(w.indexOf(i),1)
		}),
		m(b)
	}

	var u=document.createElement("canvas"),//创建canvas画布
	s=l(),
	c="c_n"+s.l,
	e=u.getContext("2d"),
	r,n,m=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(i){
		window.setTimeout(i,1000/450)
	},
	a=Math.random,
	f={
		x:null,
		y:null,
		max:2000000//鼠标影响的范围
	};
	u.id=c;
	u.style.cssText="position:fixed;top:0;left:0;z-index:"+s.z+";opacity:"+s.o;
	j("body")[0].appendChild(u);//将canvas加到body中
	k(),window.onresize=k;
	
	//鼠标移动事件
	window.onmousemove=function(i){
		i=i||window.event,
		f.x=i.clientX,
		f.y=i.clientY
	},
	//鼠标移出事件
	window.onmouseout=function(){
		f.x=null,
		f.y=null
	};
	for(var t=[],p=0;s.n>p;p++){
		var h=a()*r,g=a()*n,q=2*a()-1,d=2*a()-1;
		t.push({
			x:h,
			y:g,
			xa:q,
			ya:d,
			max:600//线条最大长度
		})
	}
	//延时调用
	setTimeout(function(){
		b()
	},100)
})();