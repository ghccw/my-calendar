# My Calendar V 1.0.1 #
2016/2/29 12:15:17 
### 调用方法 ###

	//完整Demo
	var c1 = new MyCalendar({
		skin: 'calendar-ui', //皮肤
		autoClose: false, //自动关闭
		el: $$('calendar1'), //触发的元素
		readOnly: true, //el只读
		parent: $$('box'),
		autoSetPosition: false, //自动设置位置，一般与parent一起用
		left: 0, //距离el left的位置，位置px
		top: 5, //距离el top的位置，位置px
		showAllDate: true, //显示所有日期，包括上个月、下个月
		defaultValue: '2015-01-01', //默认值
		maxDate: '2026-10-12', //日期范围控制-最大日期
		minDate: '2010-01-01', //日期范围控制-最小日期
	});
	//c1.open(); //手动打开
	//c1.close(); //手动关闭

### 预览 ###

![](images/001.png)
![](images/002.png)