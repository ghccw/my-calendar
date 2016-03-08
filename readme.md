# My Calendar V 1.0.0 #
2016/2/29 12:15:17 
### 调用方法 ###

	var myCalendar = new MyCalendar({
		el: document.getElementById('calendar8'), //el为DOM结点
		showAllDate: true, //显示所有日期，包括上月、下月
		minDate: '2015-02-02',
		maxDate: '2018-02-02',
		skin: 'calendar-ui', //皮肤样式名
		left: 0, //距目标元素的左边距离
		top: 20, //距目标元素的上边距离
		callback: function(date, arg) {
			//this == myCalendar;
			//alert(date);
		}
	});