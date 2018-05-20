window.onload=function(){
	// 区域滚动
	// 实现区域滚动的条件：一个容器装着另一个容器的html结构
	// 所以先找到大容器
	// 子容器要大于父容器
	new IScroll(document.querySelector(".jd_cateLeft"),{
		scrollX:false,
		scrollY:true
	});

	new IScroll(document.querySelector(".jd_cateRight"),{
		scrollX:false,
		scrollY:true
	});
}