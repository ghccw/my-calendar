/**
 **	AUTHOR : kingwell Leng;
 **	VESRION: 0.0.3;
 ** DATE   : 2016-05-20;
 **/
(function(window, undefined) {
	'use strict';
	var fn, extend = KW.extend;

	function MyCalendarDefault() {}
	MyCalendarDefault.prototype = {
		weekStart: 0,
		error: function(err) {
			this.log(err);
		}, //出错回调
		callback: function() {}, //回调，this为实例，第一个参数为date string，第二个参数为一个对象
		selected: function() {},
		top: 5, //左边距离
		left: 0, //上边距离 
		skin: '', //皮肤样式
		minDate: '', //最小日期
		maxDate: '', //最大日期
		readOnly: true, //插件只读
		showAllDate: false, //显示所有日期，包括上月，下月的日期
		showWeek: false,
		showTime: false,
		autoSetPosition: true, //自动设置位置
		parent: '',
		autoOpen: true,
		holidays: [],
		weekText: ['日', '一', '二', '三', '四', '五', '六'],
		headerUnit: ['年', '月', '日'],
		monthUnit: ['月']
	};

	function MyCalendar(options) {
		var _this = this;
		var ops = options || {};
		this.el = ops.el;
		if (!MyCalendar.openID) {
			MyCalendar.openID = 1;
		} else {
			MyCalendar.openID++;
		}
		for (var key in options) {
			this[key] = options[key];
		}
		if (!MyCalendar.array) {
			MyCalendar.array = [];
		}
		if (!this.hiddenInput) {
			this.hiddenInput = this.createElement('input', {
				type: 'hidden'
			});
			this.hiddenInput.value = '';
			this.append(this.hiddenInput);
		}
		if (!this.el) {
			this.el = this.hiddenInput;
		}
		this.__maxDate = function() {
			var result = '';
			if (typeof _this.maxDate === 'string') {
				result = _this.maxDate;
			} else {
				result = _this.maxDate();
			}
			return this.compatibleDateFormat(result);
		};
		this.__minDate = function() {
			var result = '';
			if (typeof _this.minDate === 'string') {
				result = _this.minDate;
			} else {
				result = _this.minDate();
			}
			return this.compatibleDateFormat(result);
		};
		this.getTop = function() {
			var top = this.top;
			if (typeof this.top === 'function') {
				top = this.top();
			}
			return top;
		};

		function bind(ev) {
			//如果不是自己，则关闭
			if (_this.getTarget(ev) !== _this.el) {
				_this.closeAll();
				_this.removeEvent(document, 'click', bind);
			}
		}

		this.__open = function() {
			_this.__max = _this.__maxDate();
			_this.__min = _this.__minDate();
			_this.random = this.name + '-' + new Date().getTime() + Math.round(Math.random() * 10000);
			MyCalendar[this.random] = function() {
				if (_this.autoClose) {
					_this.close();
				}
				_this.removeEvent(document, 'click', MyCalendar[_this.random]);
			};
			MyCalendar.array.push(MyCalendar[this.random]);
			_this.open();
			//_this.addEvent(document, 'click', MyCalendar[_this.random]);
			_this.addEvent(document, 'click', bind);
		};
		this.init();
		//this.lock = false;
	}

	MyCalendar.prototype = fn = {
		name: 'calendar',
		zIndex: 1000,
		autoClose: true,
		setValue: function() { //设置值
			var _this = this;
			if (!_this.defaultValue) {
				_this.defaultValue = _this.el.value;
			}
			if (_this.readOnly) {
				_this.el.readOnly = true;
			}
		},
		setPostion: function() { //设置位置
			var _this = this,
				pos = _this.getPosition(_this.el);
			if (_this.autoSetPosition) {
				_this.setCss(_this.box, {
					top: pos.top + pos.height + _this.getTop() + 'px',
					left: pos.left + _this.left + 'px',
					'z-index': _this.zIndex
				});
			} else {
				_this.setCss(_this.box, {
					position: 'static'
				});
			}

		},
		initDate: function(dateObj) {
			var date = null,
				value = this.el.value || this.defaultValue;
			if (dateObj) {
				date = dateObj;
			} else if (this.isValidDate(value)) {
				this.el.value = value;
				this.text(this.el, value);
				date = this.compatibleDateFormat(value);
			}
			if (!date) {
				var max = this.__maxDate(),
					min = this.__minDate(),
					getMaxDates = this.getDates(this.__maxDate()),
					getMinDates = this.getDates(this.__minDate());

				if (max && getMaxDates < 0) {
					date = max;
				}
				if (min && getMinDates > 0) {
					date = min;
				}
			}
			this.DATE = this.getDate(date); /*new Date('2016-03-25');*/
			this.Y = this.DATE.getFullYear();
			this.M = this.DATE.getMonth();
			this.D = this.DATE.getDate();
		},
		getTarget: function(ev) {
			var e = ev || window.event;
			var target = e.srcElement || e.target;
			return target;
		},
		init: function() {
			this.el.tabIndex = 0;
			this.initDate();
			this.create();
			this.__events();
			this.addClass(this.box, this.skin);
		},
		__events: function() {
			var _this = this;
			_this.el.onclick = function(ev) {
				//_this.stopPropagation(ev);
			};
			_this.el.onfocus = function() {
				_this.closeAll();
				_this.__open();
			};
			_this.box.onclick = function(ev) {
				_this.stopPropagation(ev);
			};
			_this.prevMoreYear.onclick = function() {
				_this.yearNum -= 10;
				_this.updateYear({
					year: _this.yearNum
				});
			};
			_this.nextMoreYear.onclick = function() {
				_this.yearNum += 10;
				_this.updateYear({
					year: _this.yearNum
				});
			};
		},
		open: function() {
			if (this.lock) {
				//return;
			}
			//this.lock = true;
			this.update();
			this.append(this.box, this.parent);
			this.initDate();
			this.setValue();
			this.setPostion();
			this.dateError = this.getDateStatus();
			this.yearNum = 0;
			if (!this.dateError) {
				this.error.call(this, '最小日期不能大于最大日期');
			}
		},
		close: function() {
			var _this = this;
			//_this.lock = false;
			_this.remove(_this.box);
		},
		closeAll: function() {
			var arr = MyCalendar.array;
			for (var i = 0; i < arr.length; i++) {
				arr[i]();
			}
			MyCalendar.array = [];
		},
		setStatus: function() {

		},
		setPrevYear: function() {

			if (this.getEnableStatus(this.Y - 1, 'year')) {
				this.Y--;
				this.DATE.setYear(this.Y);
				//this.updateAll();
				if (this.Y >= this.currentMinYear && this.Y <= this.currentMaxYear) {
					console.log(1);
				} else {
					console.log(0);
				}
				this.updateMonth();
				this.updateDate();
				this.__select({
					type: 'year'
				});
			} else {
				this.error.call(this, '最小年为：' + this.__min);
				this.initDate(this.getDate(this.__min));
				this.updateAll();
			}
		},
		setNextYear: function() {
			if (this.getEnableStatus(this.Y + 1, 'year')) {
				this.Y++;
				this.DATE.setYear(this.Y);
				this.updateAll();
				this.__select({
					type: 'year'
				});
			} else {
				this.error.call(this, '最小年为：' + this.__max);
				this.initDate(this.getDate(this.__max));
				this.updateAll();
			}
		},
		getDateStatus: function() { //判断最小日期是否大于最大日历
			var status = true;
			if (this.__min && this.__max) {
				if (this.getDates(this.__min, this.__max) < 0) {
					status = false;
				}
			}
			return status;
		},
		__select: function() {
			var _this = this,
				args = arguments[0],
				date = this.getNewDate(this.Y, this.M, this.D),
				dateString = _this.getCurrentDate(date);
			try {
				_this.el.value = dateString;
				_this.text(_this.el, dateString);
				_this.callback.call(_this, dateString, args);
				_this.log(data, args);
			} catch (e) {}
			if (args.type === 'date' && _this.autoClose) {
				_this.close();
			}
		},
		log: function() {
			try {
				console.log.apply(console, arguments);
			} catch (e) {}
			return this;
		},
		__createYear: function() {
			var _this = this;
			_this.box = _this.createElement('div', {
				className: _this.name + '-box'
			});
			//年份
			_this.yearHeader = _this.createElement('div', {
				className: _this.name + '-year-header'
			});
			_this.yearBox = _this.createElement('div', {
				className: _this.name + '-year-box'
			});
			_this.yearTableBox = _this.createElement('div', {
				className: _this.name + '-year-table-box'
			});
			_this.yearTable = _this.createElement('table', {
				className: _this.name + '-year-table'
			});
			_this.yearThead = _this.createElement('thead', {
				className: _this.name + '-year-thead'
			});
			_this.yearTbody = _this.createElement('tbody', {
				className: _this.name + '-year-body'
			});
			_this.yearPage = _this.createElement('div', {
				className: _this.name + '-year-page'
			});
			_this.prevMoreYear = _this.createElement('div', {
				className: _this.name + '-year-prev'
			});
			_this.nextMoreYear = _this.createElement('div', {
				className: _this.name + '-year-next'
			});
			_this.append(_this.yearThead, _this.yearTable);
			_this.append(_this.yearTbody, _this.yearTable);
			_this.append(_this.yearHeader, _this.yearBox);
			_this.append(_this.yearTable, _this.yearTableBox);
			_this.append(_this.yearTableBox, _this.yearBox);
			_this.prevMoreYear.innerHTML = '<span>＜</span>';
			_this.nextMoreYear.innerHTML = '<span>＞</span>';
			_this.append(_this.prevMoreYear, _this.yearPage);
			_this.append(_this.nextMoreYear, _this.yearPage);
			_this.append(_this.yearPage, _this.yearBox);
			_this.append(_this.yearBox, _this.box);
		},
		__createMonth: function() {
			var _this = this;
			//月份
			this.monthBox = _this.createElement('div', {
				className: _this.name + '-month-box'
			});
			this.monthHeader = _this.createElement('div', {
				className: _this.name + '-month-header'
			});
			this.monthTableBox = _this.createElement('div', {
				className: _this.name + '-month-table-box'
			});
			this.monthTable = _this.createElement('table');
			this.monthThead = _this.createElement('thead');
			this.monthTbody = _this.createElement('tbody');
			this.monthTfoot = _this.createElement('tfoot');
			_this.append(_this.monthThead, _this.monthTable);
			_this.append(_this.monthTfoot, _this.monthTable);
			_this.append(_this.monthTbody, _this.monthTable);
			_this.append(_this.monthHeader, _this.monthBox);
			_this.append(_this.monthTable, _this.monthTableBox);
			_this.append(_this.monthTableBox, _this.monthBox);
			_this.append(_this.monthBox, _this.box);
		},
		__createDate: function() {
			var _this = this;
			//天数
			_this.dateBox = _this.createElement('div', {
				className: _this.name + '-date-box'
			});
			_this.dateHeader = _this.createElement('div', {
				className: _this.name + '-date-header'
			});
			_this.dateTableBox = _this.createElement('div', {
				className: _this.name + '-date-table-box'
			});
			_this.dateTable = _this.createElement('table', {
				className: _this.name
			});
			_this.dateThead = _this.createElement('thead', {
				className: _this.name
			});
			_this.dateTbody = _this.createElement('tbody', {
				className: _this.name
			});
			_this.dateTfoot = _this.createElement('tfoot', {
				className: _this.name
			});
			_this.append(_this.dateThead, _this.dateTable);
			_this.append(_this.dateTfoot, _this.dateTable);
			_this.append(_this.dateTbody, _this.dateTable);
			_this.append(_this.dateHeader, _this.dateBox);
			_this.append(_this.dateTable, _this.dateTableBox);
			_this.append(_this.dateTableBox, _this.dateBox);
			_this.append(_this.dateBox, _this.box);
		},
		__createHour: function() {
			var _this = this,
				create = _this.createElement;
			_this.timeBox = create('div', {
				className: _this.name + '-time-box'
			});
			_this.hourBox = create('div', {
				className: _this.name + '-hour-box'
			});
			_this.hourTableBox = create('div', {
				className: _this.name + '-hour-table-box'
			});
			_this.hour = create('table', {});
			_this.append(_this.hour, _this.hourTableBox);
			_this.append(_this.hourTableBox, _this.hourBox);
			_this.append(_this.hourBox, _this.timeBox);
		},
		__createMinute: function() {
			var _this = this,
				create = _this.createElement;
			_this.minuteBox = create('div', {
				className: _this.name + '-minute-box'
			});
			_this.minuteTableBox = create('div', {
				className: _this.name + '-minute-table-box'
			});
			_this.minute = create('table', {});
			_this.append(_this.minute, _this.minuteTableBox);
			_this.append(_this.minuteTableBox, _this.minuteBox);
			_this.append(_this.minuteBox, _this.timeBox);
		},
		__createSecond: function() {
			var _this = this,
				create = _this.createElement;
			_this.secondBox = create('div', {
				className: _this.name + '-second-box'
			});
			_this.secondTableBox = create('div', {
				className: _this.name + '-second-table-box'
			});
			_this.second = create('table', {});
			_this.append(_this.second, _this.secondTableBox);
			_this.append(_this.secondTableBox, _this.secondBox);
			_this.append(_this.secondBox, _this.timeBox);
			_this.append(_this.timeBox, _this.box);
		},
		__createYearHtml: function() {
			var _this = this,
				create = _this.createElement;
			this.nextYear = create('span');
			this.prevYear = create('span');
			this.nextYear.innerHTML = '下一年';
			this.prevYear.innerHTML = '上一年';
			_this.append(_this.prevYear, _this.box);
			_this.append(_this.nextYear, _this.box);
		},
		create: function() {

			this.__createYear();
			this.__createMonth();
			this.__createDate();
			if (this.showTime) {
				this.__createHour();
				this.__createMinute();
				this.__createSecond();
			}
			//this.__createYearHtml();
		},
		updateAll: function() {
			this.updateYear();
			this.updateMonth();
			this.updateDate();
		},
		update: function() {
			this.updateAll();
			if (this.showTime) {
				this.updateHour();
				this.updateMinute();
				this.updateSecond();
			}
		},
		getEnableStatus: function(value, type) { //获取日期范围
			var _this = this,
				status = true,
				minStatus, maxStatus,
				date,
				minDate = new Date(_this.__min),
				maxDate = new Date(_this.__max);
			switch (type) {
				case 'year':
					minStatus = value < minDate.getFullYear();
					maxStatus = value > maxDate.getFullYear();
					break;
				case 'month':
					date = new Date();
					date.setYear(_this.Y);
					date.setMonth(value);
					if (_this.__min) {
						date.setDate(_this.getMaxDates(_this.Y, value));
						minStatus = _this.getDates(_this.__min, _this.getCurrentDate(date)) < 0;
					}
					if (_this.__max) {
						date.setDate(1);
						maxStatus = _this.getDates(_this.__max, _this.getCurrentDate(date)) > 0;
					}
					break;
				case 'date':

					if (_this.__min) {
						minStatus = _this.getDates(_this.__min, _this.getCurrentDate(value)) < 0;
					}
					if (_this.__max) {
						maxStatus = _this.getDates(_this.__max, _this.getCurrentDate(value)) > 0;
					}
					break;
			}
			//最小日期
			if (_this.__min) {
				if (minStatus) {
					status = false;
				} else {
					status = true;
				}
			}
			//最大日期
			if (_this.__max) {
				if (maxStatus) {
					status = false;
				} else {
					status = true;
				}
			}
			//两个都存在
			if (_this.__min && _this.__max) {
				if (minStatus || maxStatus) {
					status = false;
				} else {
					status = true;
				}
			}
			if (status) {
				status = _this.getDateStatus();
			}
			return status;
		},
		getNewDate: function(year, month, date) {
			var _date = new Date();
			_date.setYear(year);
			_date.setMonth(month);
			_date.setDate(date);
			return _date;
		},
		updateYear: function(options) {
			var _this = this,
				ops = options || {},
				dateObj = ops.date || _this.DATE,
				year = ops.year || 0,
				grid = ops.grid || 2,
				_year = dateObj.getFullYear() + year,
				fra = document.createDocumentFragment(),
				theadTr, th,
				tbodyTr, td, i = 0;
			_this.empty(_this.yearTbody);
			_this.yearHeader.innerHTML = _this.Y + _this.headerUnit[0];
			_this.currentMinYear = _year - 5;
			_this.currentMaxYear = _year + 5;
			for (var y = _year - 5; y < _year + 5; y++) {
				var status = true;
				if (i % grid === 0) {
					tbodyTr = _this.createElement('tr');
				}
				td = _this.createElement('td');
				td.innerHTML = y;
				if (y === _this.Y) {
					_this.addClass(td, _this.name + '-this-year');
				}
				status = _this.getEnableStatus(y, 'year');
				if (status) {
					_this.__loop({
						element: td,
						value: y,
						callback: function(year) {
							_this.Y = year;
							_this.updateYear({
								year: _this.yearNum
							});
							_this.updateMonth();
							_this.updateDate();
							_this.__select({
								type: 'year'
							});
						}
					});
					_this.addClass(td, _this.name + '-enabled');
				} else {
					_this.addClass(td, _this.name + '-disabled');
				}
				_this.append(td, tbodyTr);
				_this.append(tbodyTr, fra);
				i++;
			}
			_this.append(fra, _this.yearTbody);
		},
		updateMonth: function(options) {
			var _this = this,
				ops = options || {},
				month = ops.month,
				frg = document.createDocumentFragment(),
				tBodyTr, th, i = 0;
			_this.monthHeader.innerHTML = _this.M + 1 + _this.headerUnit[1];
			_this.empty(_this.monthTbody);
			for (var m = 0; m < 12; m++) {
				var status = true,
					td = _this.createElement('td');
				td.innerHTML = m + 1 + _this.monthUnit[0];
				if (i % 2 === 0) {
					tBodyTr = _this.createElement('tr');
				}
				i++;
				if (m === _this.M) {
					_this.addClass(td, _this.name + '-this-month');
				}
				status = _this.getEnableStatus(m, 'month');
				if (status) {
					_this.__loop({
						element: td,
						value: m,
						callback: function(month) {
							var date = new Date();
							_this.M = month;
							_this.updateMonth();
							date.setYear(_this.Y);
							date.setMonth(_this.M);
							_this.updateDate({
								date: date
							});
							_this.__select({
								type: 'month'
							});
						}
					});
				}
				if (!status) {
					_this.addClass(td, _this.name + '-disabled');
				} else {
					_this.addClass(td, _this.name + '-enabled');
				}
				_this.append(td, tBodyTr);
				_this.append(tBodyTr, frg);
			}
			_this.append(frg, _this.monthTbody);
		},
		updateDate: function(options) {
			var _this = this,
				ops = options || {},
				dateObj = ops.date || _this.DATE,
				_year, _month, _date,
				days, firstDay,
				nowMonthDate, prevMonthDate, nextMonthDate = 1,
				currentDate,
				maxDateStatus = true,
				showMonth,
				dateObj, frg = document.createDocumentFragment();

			_year = _this.Y || dateObj.getFullYear();
			_month = _this.M || dateObj.getMonth();
			_date = _this.D || dateObj.getDate();
			days = _this.getMaxDates(_year, _month);

			firstDay = new Date(_year, _month, 1).getDay(), showMonth = _month + 1;
			_this.dateHeader.innerHTML = _this.D + _this.headerUnit[2];

			if (_this.showWeek) { //Clear Table
				_this.empty(_this.dateThead);
			}

			_this.empty(_this.dateTbody);

			for (var i = 0; i < 6; i++) {
				var tr = _this.createElement('tr'); //this.dateTbody.insertRow(i);				
				for (var j = 0; j < 7; j++) {
					var th,
						td = _this.createElement('td'), //td = this.dateTbody.rows[i].insertCell(j),
						num = i * 7 + j,
						status = true,
						current, month = 0,
						showAllDate = true;

					nowMonthDate = num - firstDay + 1;
					prevMonthDate = Math.abs(firstDay - j - _this.getMaxDates(_year, _month - 1) - 1);
					if (_this.showWeek) {
						if (!i && !j) { //插件头部-星期
							this.dateThead.insertRow(i);
						}
						if (!i) {
							th = this.dateThead.rows[i].insertCell(j);
							th.innerHTML = _this.weekText[j];
							//设置样式
							if (j === 5 || j === 6) { //周末
								_this.addClass(th, _this.name + '-weekend');
							}
						}
					}

					//设置文本内容
					if (num < firstDay) { //上个月
						current = prevMonthDate;
						month = -1;
						currentDate = _this.getNewDate(_year, _month - 1, prevMonthDate);
						showAllDate = _this.showAllDate;
						if (showAllDate) {
							td.innerHTML = prevMonthDate;
						}
					} else if (num >= days + firstDay) { //下个月
						current = nextMonthDate;
						currentDate = _this.getNewDate(_year, _month, nowMonthDate);
						showAllDate = _this.showAllDate;
						if (showAllDate) {
							td.innerHTML = nextMonthDate;
						}
						nextMonthDate++;
					} else { //本月
						td.innerHTML = nowMonthDate;
						current = nowMonthDate;
						month = 1;
						currentDate = _this.getNewDate(_year, _month, nowMonthDate);
					}
					status = _this.getEnableStatus(currentDate, 'date');

					if (status) {
						// _this.__loop({
						// 	element: td,
						// 	date: current,
						// 	month: month,
						// 	currentDate: currentDate,
						// 	showAllDate: showAllDate,
						// 	callback: function(ops) {

						// 	}
						// });
						//_this.log();
						maxDateStatus = _this.getMaxDates(_year, _month) >= _this.D;

						(function(date, month, currentDate, showAllDate) {
							td.title = _this.getCurrentDate(currentDate);
							if (!showAllDate) {
								return;
							}
							_this.addEvent(td, 'click', function() {
								var result;
								result = _this.getDateAll(currentDate);
								_this.Y = result.year;
								_this.M = result.month;
								_this.D = result.date;
								_this.updateYear({
									year: _this.yearNum
								});
								_this.updateMonth({
									date: currentDate
								});
								_this.updateDate({
									date: currentDate
								});
								_this.__select({
									type: 'date'
								});
							});
						})(current, month, currentDate, showAllDate);
					}

					//设置样式
					if (j === 0 || j === 6) { //周末
						_this.addClass(td, _this.name + '-weekend');
					}
					if (nowMonthDate === _date && maxDateStatus) {
						_this.addClass(td, _this.name + '-today');
					}
					if (num < firstDay || num >= days + firstDay) {
						_this.addClass(td, _this.name + '-non-current');
					} else {
						_this.addClass(td, _this.name + '-current');
					}
					if (!status) {
						_this.addClass(td, _this.name + '-disabled');
					} else {
						if (showAllDate) {
							_this.addClass(td, _this.name + '-enabled');
						}
					}
					_this.append(td, tr);
				}
				_this.append(tr, frg);
			}
			_this.append(frg, _this.dateTbody);
		},
		updateHour: function(options) {
			var _this = this,
				frg = document.createDocumentFragment(),
				tr, td, create = _this.createElement;

			_this.empty(_this.hour);
			for (var i = 0; i < 24; i++) {
				if (i % 6 === 0) {
					tr = create('tr');
				}
				td = create('td');
				_this.__loop({
					element: td,
					value: i,
					callback: function(i) {
						alert(i);
					}
				});
				td.innerHTML = i;
				_this.append(td, tr);
				_this.append(tr, frg);
			}
			_this.append(frg, _this.hour);
		},
		updateMinute: function(options) {
			var _this = this,
				frg = document.createDocumentFragment(),
				tr, td, create = _this.createElement;

			_this.empty(_this.minute);
			for (var i = 0; i < 60; i += 5) {
				if (i % 6 === 0) {
					tr = create('tr');
				}
				td = create('td');
				_this.__loop({
					element: td,
					value: i,
					callback: function(i) {
						alert(i);
					}
				});
				td.innerHTML = _this.fixZero(i);
				_this.append(td, tr);
				_this.append(tr, frg);
			}
			_this.append(frg, _this.minute);
		},
		updateSecond: function(options) {
			var _this = this,
				frg = document.createDocumentFragment(),
				tr, td, create = _this.createElement;

			_this.empty(_this.second);
			for (var i = 0; i < 60; i += 5) {
				if (i % 6 === 0) {
					tr = create('tr');
				}
				td = create('td');
				_this.__loop({
					element: td,
					value: i,
					callback: function(i) {
						alert(i);
					}
				});
				td.innerHTML = _this.fixZero(i);
				_this.append(td, tr);
				_this.append(tr, frg);
			}
			_this.append(frg, _this.second);
		},
		__loop: function(options) {
			var _this = this,
				ops = options || {};
			(function(_value) {
				_this.addEvent(ops.element, 'click', function() {
					if (ops.callback) {
						ops.callback(_value, ops);
					}
				});
			})(ops.value);
		}
	};

	extend(fn, new KW.Type());
	extend(fn, new KW.Dom());
	extend(fn, new KW.Css());
	extend(fn, new KW.Date());
	extend(fn, new KW.Event());
	extend(fn, new KW.Box());
	extend(fn, new KW.Kingwell());
	extend(fn, new MyCalendarDefault());


	var pro = {
		version: '1.0.1',
		closeAll: function() {
			var arr = MyCalendar.array || [];
			for (var i = 0; i < arr.length; i++) {
				arr[i]();
			}
			MyCalendar.array = [];
		},
		toString: function() {
			return '日历插件';
		}
	};
	for (var key in pro) {
		MyCalendar[key] = pro[key];
	}
	window.MyCalendar = MyCalendar;
})(this);