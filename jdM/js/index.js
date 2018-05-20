window.onload=function(){
	/*1.顶部搜索栏*/
	search();
	/*2.轮播图*/
	banner();
	/*3.倒计时*/
	downTime();
}


/*顶部搜索条*/
var search=function(){
	// 1.默认固定顶部透明背景
	var searchBox=document.querySelector(".search_box");
	var banner=document.querySelector(".jd_banner");
	var height=banner.offsetHeight;

	/*
		如果考虑兼容性问题，那么获取页面高度的三种方式：
		doucment.body.scrollTop
		document.doucmentElement.scrollTop
		document.pageY
	 */
	
	//监听页面滚动事件
	window.onscroll=function(){
		var scrollTop=document.body.scrollTop||document.documentElement.scrollTop;
		console.log(height);
		//默认的透明度
		var opacity=0;
		if(scrollTop<height){
			// 2.当页面滑动的时候——随着页面高度卷去的高度变大而透明度变大
			opacity=scrollTop/height*0.85;
		}else{
			// 3.当页面滑动的时候——超过某一个高度是透明度不再变化
			opacity=0.85;
		}
		searchBox.style.background="rgba(201,21,35,"+opacity+")";
	}
};


/*轮播图*/
var banner=function(){
	/*1.自动轮播且无缝 定时器+过渡实现*/
	/*2.点要随着图片的轮播而改变状态 根据索引实现*/
	/*3.滑动效果 利用touch实现*/
	/*4.滑动结束时 如果滑动的距离不超过屏幕距离的1/3，吸附回去 过渡实现*/
	/*5.滑动结束时 如果滑动的距离超过1/3，切换（上一张、下一张） 根据滑动方向+过渡实现*/

	/*轮播图容器*/
	var banner=document.querySelector(".jd_banner");
	/*屏幕宽度*/
	var width=banner.offsetWidth;
	/*图片容器*/
	var imageBox=banner.querySelector("ul:first-child");
	/*点容器*/
	var pointBox=banner.querySelector("ul:last-child");
	/*所有的点*/
	var points=pointBox.querySelectorAll("li");



	/*轮播图程序的核心 index*/
	var index=1;	/*因为一开始就是显示第二张图片*/

	//定义一个加过渡的函数
	var addTransition=function(){
		imageBox.style.transition="all 0.2s";
		imageBox.style.webkitTransition="all 0.2s";
	}
	//定义一个清除过渡的函数
	var removeTransition=function(){
		imageBox.style.transition="none";
		imageBox.style.webkitTransition="none";
	}
	//定义一个做位移的函数
	var setTranslatex=function(translateX){
		imageBox.style.transform="translateX("+translateX+"px)";
		imageBox.style.webkitTransform="translateX("+translateX+"px)";
	}


	var timer=setInterval(function(){
		index++;	//每向左滑动一张图，索引加1
		/*加过渡*/
		addTransition();
		/*做位移*/
		setTranslatex(-index*width);
	},2000);



	/*需要等最后一张图片结束时去判断，然后瞬间定位到第一张*/
	imageBox.addEventListener("transitionend",function(){
		//自动滚动的轮播
		if(index>=9){
			index=1;
			/*瞬间定位*/
			/*清过渡*/
			removeTransition();
			/*做位移*/
			setTranslatex(-index*width);
		}else if(index<=0){		//滑动的时候也需要无缝
			index=8;
			/*瞬间定位*/
			/*清过渡*/
			removeTransition();
			/*做位移*/
			setTranslatex(-index*width);
		}

		/*
			调用设置点的方法，根据索引来设置，图片的索引原来为0-9
			点的索引为0-7,那么怎样让两者的索引对应呢?
			当上面的transitonend事件代码执行完后，有以下关系
		 */
		//此时此刻 index 的取值范围为1-8（0,8-1,9）
		//所以点的索引 index-1
		setPoint();
	});

	//定义一个设置点的方法
	var setPoint=function(){
		//index 1-8
		//清除所有点的当前状态样式
		for(var i=0; i<points.length; i++){
			var obj=points[i];
			obj.classList.remove("now");
		}
		//给当前的点加上当前状态样式
		points[index-1].classList.add("now");
	}



	//实现滑动效果
	//绑定事件
	var startX=0;	//使touchmove中能够访问touchstart中的start
	var distanceX=0;
	var isMove=false;	//加一个用于判断是点击还是滑动的开关

	imageBox.addEventListener("touchstart",function(e){
		//手指接触轮播图区域时 清除定时器
		clearInterval(timer);
		//记录手指触摸开始时的x坐标
		startX=e.touches[0].clientX;	//将var startx局部变量改为start
	});
	imageBox.addEventListener("touchmove",function(e){
		//记录手指滑动过程中的x坐标
		var moveX=e.touches[0].clientX;
		//计算手指移动的位移 有正负方向
		distanceX=moveX-startX;
		//计算目标元素的位移 不用管正负
		//元素将要运动到的目标位置=元素当前位置+手指移动的距离
		var translateX=-index*width+distanceX;
		//滑动-->即元素随着手指的滑动做位置的改变
		removeTransition();		//滑动时，要清过渡，避免划不动的感觉
		setTranslatex(translateX);	//调用做位移的函数，把要移动的距离传进去

		isMove=true;	//只有是滑动了，才改变开关状态
	});
	imageBox.addEventListener("touchend",function(e){
		/*第4、5点需求实现*/
		if(isMove){			//触摸结束后，先判断isMove开关的状态再决定是否执行切换
			//要使用移动的距离
			if(Math.abs(distanceX)<width/3){
				//吸附回去
				addTransition();	//吸附回去过程也要过渡
				setTranslatex(-index*width);	//回到该图片在原来的位置
			}else{
				//切换
				if(distanceX>0){	//右滑 上一张
					index--;			//用index来控制上一张和下一张
				}else{	//左滑 下一张
					index++;
				}

				//根据index去控制图片的移动
				addTransition();
				setTranslatex(-index*width);
			}
		}
		
		//最好做一下参数的重置，防止影响下一次代码的执行
		startX=0;
		distanceX=0;
		isMove=false;

		//用户每次滑动完成，图片轮播移动结束后，又要把定时器加回来
		clearInterval(timer);	//开定时器前先清除一下定时器
		timer=setInterval(function(){	//开定时器
			index++;
			addTransition();
			setTranslatex(-index*width);
		},2000);
	});

};


/*倒计时*/
var downTime=function(){
	//倒计时的目标时间
	var time=2*60*60;
	//时间盒子,拿到8个span 0-7
	var spans=document.querySelector(".time").querySelectorAll("span");
	//然后每一秒去更新显示时间
	var timer=setInterval(function(){
		time--;
		//因为格式还是秒 要转换格式
		var h=Math.floor(time/3600);
		var m=Math.floor(time%3600/60);
		var s=time%60;	//达不到1分钟的都是秒

		spans[0].innerHTML=Math.floor(h/10);
		spans[1].innerHTML=h%10;

		spans[3].innerHTML=Math.floor(m/10);
		spans[4].innerHTML=m%10;

		spans[6].innerHTML=Math.floor(s/10);
		spans[7].innerHTML=s%10;

		//判断时间是否结束
		if(time<=0){
			clearInterval(timer);	//时间到则清除定时器
		}
		
	},1000);
};









