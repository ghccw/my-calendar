(function(window, undefied) {
	"use strict";
	var doc = document,
		doe = doc.documentElement,
		kingwell, kw, KW,
		fn,
		userAgent = navigator.userAgent.toLowerCase(),
		isIE = /msie/.test(userAgent),
		deepCopy = function(source) {
			var result = {};
			for (var key in source) {
				result[key] = typeof source[key] === 'object' ? deepCopy(source[key]) : source[key];
			}
			return result;
		},
		extend = function(tagert, source, deep) {
			var subObj = tagert || {};
			var parentObj = source || {};
			parentObj = deepCopy(parentObj);
			for (var key in parentObj) {
				subObj[key] = parentObj[key];
			}
			return subObj;
		};

	//时间
	function MyDate() {}
	MyDate.prototype = {
		fixZero: function(num) {
			return num < 10 ? '0' + num : num;
		},
		isLeapYear: function(year) {
			return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
		},
		getMaxDates: function(year, month) {
			var m = month + 1,
				result;
			if (m === 4 || m === 6 || m === 9 || m === 11) {
				result = 30;
			} else if (m === 2) {
				result = this.isLeapYear(year) ? 29 : 28;
			} else {
				result = 31;
			}
			return result;
		},
		getDateAll: function(dateObj) {
			var date = dateObj || new Date();
			return {
				year: date.getFullYear(),
				month: date.getMonth(),
				date: date.getDate()
			};
		},
		getDate: function(date) {
			var dateObj = null;
			if (this.isString(date)) {
				dateObj = new Date(date);
			} else if (date) {
				dateObj = date;
			} else {
				dateObj = new Date();
			}
			return dateObj;
		},
		getCurrentDate: function(dateObj, format) {
			var formats = ['yyyy-mm-dd', 'yyyy/mm/dd', 'yyyy.mm.dd'],
				date = dateObj || this.getDate(),
				line = '-',
				status = false;
			for (var i = 0; i < formats.length; i++) {
				if (formats[i].toLowerCase() === format) {
					status = true;
					line = formats[i].slice(4, 5);
				}
			}
			return date.getFullYear() + line + this.fixZero(date.getMonth() + 1) + line + this.fixZero(date.getDate());
		},
		compatibleDateFormat: function(dateString) {
			var date = dateString || '';
			return date.replace(/-/g, '/');
		},
		getDates: function(start, end) {
			var _start, _end,
				argStart, argEnd,
				result = 0;
			if (arguments.length === 1) {
				argStart = new Date();
				argEnd = start;
			} else {
				argStart = this.compatibleDateFormat(start);
				argEnd = this.compatibleDateFormat(end);
			}
			_start = new Date(argStart);
			_end = new Date(argEnd);
			result = Math.floor((_end.getTime() - _start.getTime()) / (1000 * 60 * 60 * 24));
			return isNaN(result) ? 0 : result;
		},
		isValidDate: function(date) {
			return date !== '' && (new Date(date) + '') !== 'Invalid Date';
		}
	};
	//判断是否某种类型
	function MyType() {}
	MyType.prototype = {
		is: function(o, type) {
			var obj = Object.prototype.toString.call(o);
			if (arguments.length === 2) {
				return obj === '[object ' + type + ']';
			} else {
				return obj.slice(7, -1).toLowerCase();
			}
		},
		isArray: function(o) {
			return this.is(o, 'Array');
		},
		isObject: function(o) {
			return this.is(o, 'Object');
		},
		isFunction: function(o) {
			return this.is(o, 'Function');
		},
		isNumber: function(o) {
			return this.is(o, 'Number');
		},
		isString: function(o) {
			return this.is(o, 'String');
		},
		isElement: function(o) {
			return (o && o.nodeName) ? true : false;
		},
		isForm: function(obj) {
			var o = this.MyDom.getId(obj);
			return this.isElement(o) && (o.tagName.toLowerCase() === 'input' || o.tagName.toLowerCase() === 'textarea');
		}
	};
	//MyDom Edit
	function MyDom() {}
	MyDom.prototype = {
		getId: function(id) {
			return this.isString(id) ? doc.getElementById(id) : id;
		},
		swapNode: function(node1, node2) {
			var n1 = this.getId(node1),
				n2 = this.getId(node2),
				next, parent;
			if (this.isElement(n1) && this.isElement(n2)) {
				if (doc.swapNode) {
					n1.swapNode(n2);
				} else {
					next = n1.nextSibling;
					parent = n1.parentNode;
					n2.parentNode.replaceChild(n1, n2);
					parent.insertBefore(n2, next);
				}
				return true;
			}
		},
		createElement: function(elem, obj) {
			var element = doc.createElement(elem);
			for (var pro in obj) {
				if (pro === 'class' || pro === 'className') {
					element.className = obj[pro];
				} else {
					element.setAttribute(pro, obj[pro]);
				}
			}
			return element;
		},
		html: function(node, html) {
			var elem = this.getId(node);
			if (!this.isElement(elem)) {
				return '';
			}
			if (arguments.length > 1) {
				elem.innerHTML = html;
			} else {
				return elem.innerHTML;
			}
			return elem;
		},
		text: function(node, text) {
			var result,
				_text = function(node) {
					var result = [],
						chilrens = node.childNodes,
						len = chilrens.length,
						i, element;
					for (i = 0; i < len; i++) {
						element = chilrens[i];
						if (element.nodeType === 3) {
							result.push(element.nodeValue);
						} else {
							result.push(_text(element));
						}
					}
					return result.join('');
				};
			if (!this.isElement(node)) {
				result = node;
			} else {
				if (arguments.length === 1) {
					result = _text(node);
				} else {
					if (node.textContent) {
						node.textContent = text;
					} else if (node.innerHTML) {
						node.innerHTML = text;
					}
					result = node;
				}
			}
			return result;
		},
		val: function(elem, value) {
			if (this.isForm(elem)) {
				if (arguments.length === 2) {
					elem.value = value;
				} else {
					return elem.value;
				}
			} else {
				return null;
			}
		},
		append: function(child, parent) {
			var sonElem = this.isString(child) ? this.getId(child) : child,
				par = this.isString(parent) ? this.getId(parent) : parent;
			if (!this.isElement(par)) {
				par = doc.body;
			}
			if (!this.isElement(sonElem) || !this.isElement(par)) {
				return;
			}
			par.appendChild(sonElem);
		},
		insertBefore: function(newNode, oldNode) {
			if (this.isElement(newNode) && this.isElement(oldNode) && oldNode.parentNode) {
				oldNode.parentNode.insertBefore(newNode, oldNode);
			}
		},
		insertAfter: function() {},
		nextNode: function(node) {
			var nextNode;
			node = this.isString(node) ? this.getId(node) : node;
			if (!this.isElement(node)) {
				return null;
			}
			nextNode = node.nextSibling;
			if (!nextNode) {
				return null;
			}
			while (true) {
				if (nextNode.nodeType === 1) {
					break;
				} else {
					if (nextNode.nextSibling) {
						nextNode = nextNode.nextSibling;
					} else {
						break;
					}
				}
			}
			return nextNode.nodeType === 1 ? nextNode : null;
		},
		empty: function(node) {
			if (this.isElement(node)) {
				while (node.firstChild) {
					node.removeChild(node.firstChild);
				}
			}
			return node;
		},
		setAttribute: function(o, obj) {
			if (this.isElement(o) && this.isPlainObject(obj)) {
				for (var i in obj) {
					if (i.toLowerCase() === 'class' || i.toLowerCase() === 'for') {
						o.setAttribute(i, obj[i]);
					} else {
						o[i] = obj[i];
					}
				}
			}
		},
		getAttribute: function(o, obj) {
			if (this.isElement(o) && this.isString(obj)) {
				if (obj.toLowerCase() === 'class' || obj.toLowerCase() === 'for') {
					return o.getAttribute(obj);
				} else {
					return o.obj;
				}
			}
		},
		remove: function(o) {
			if (o && o.parentNode) {
				o.parentNode.removeChild(o);
			}
		},
		addClass: function(o, str) {
			if (!this.isElement(o)) {
				return;
			}
			var className = o.className,
				reg = eval("/^" + str + "$ | " + str + "$|^" + str + " | " + str + " /");
			if (reg.test(className)) {
				return;
			}
			if (className !== '') {
				o.className = className + " " + str;
			} else {
				o.className = str;
			}
		},
		removeClass: function(o, str) {
			if (!this.isElement(o)) {
				return;
			}
			var className = o.className;
			if (this.isEmpty(className)) {
				var reg = new RegExp(str, "g"),
					n = className.replace(reg, "");
				o.className = n;
			}
		},
		hasClass: function(o, str) {
			if (!this.isElement(o)) {
				return;
			}
			var className = o.className,
				reg = eval("/^" + str + "$| " + str + "$|^" + str + " | " + str + " /");
			if (reg.test(className)) {
				return true;
			} else {
				return false;
			}
		}
	};
	//MyCss
	function MyCss() {}
	MyCss.prototype = {
		getComputedStyle: function(element, styleName) {
			var style = '';
			if (window.getComputedStyle) {
				style = element.ownerDocument.defaultView.getComputedStyle(element, null).getPropertyValue(styleName);
			} else if (element.currentStyle) {
				style = element.currentStyle[styleName];
			}
			return style;
		},
		setStyle: function(o, obj) {
			if (this.isElement(o) && this.isPlainObject(obj)) {
				for (var i in obj) {
					o.style[i] = obj[i];
				}
			}
		},
		setCss: function(tar, obj) {
			var o = this.getId(tar);
			if (this.isElement(o) && this.isPlainObject(obj)) {
				var str = '';
				for (var i in obj) {
					str += i + ':' + obj[i] + '; ';
				}
				o.style.cssText += (' ;' + str);
			}
			return o;
		},
		setOpacity: function(obj, val) {
			if (!this.isElement(obj)) {
				return;
			}
			var num = (val && val >= 0 && val <= 100) ? val : 100;
			if (d.addEventListener) {
				obj.style.opacity = num / 100;
			} else {
				obj.style.filter = 'alpha(opacity=' + num + ')';
			}
		},
		getMaxZindex: function(o) {
			var maxZindex = 0,
				obj = o ? o : '*',
				divs = d.getElementsByTagName(obj);
			for (var z = 0, len = divs.length; z < len; z++) {
				maxZindex = Math.max(maxZindex, divs[z].style.zIndex);
			}
			return maxZindex;
		}
	};
	//MyBox
	function MyBox() {}
	MyBox.prototype = {
		getBox: function(o) {
			var obj = o;
			return {
				left: parseInt(obj.offsetLeft, 10),
				top: parseInt(obj.offsetTop, 10),
				width: parseInt(obj.offsetWidth, 10),
				height: parseInt(obj.offsetHeight, 10)
			};
		},
		getPosition: function(obj) {
			var o = this.getId(obj);
			if (!this.isElement(o)) {
				return null;
			}
			var t = parseInt(o.offsetTop, 10),
				l = parseInt(o.offsetLeft, 10),
				w = parseInt(o.offsetWidth, 10),
				h = parseInt(o.offsetHeight, 10);
			while (o = o.offsetParent) {
				t += parseInt(o.offsetTop, 10);
				l += parseInt(o.offsetLeft, 10);
			}
			return {
				left: l,
				top: t,
				width: w,
				height: h
			};
		},
		getQueryString: function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),
				r = location.search.substr(1).match(reg);
			if (r !== null)
				return unescape(r[2]);
			return null;
		},
		isPlainObject: function(obj) {
			return (!obj || !this.isObject(obj) || obj.nodeType || obj.setInterval) ? false : true;
		}
	};
	//MyEvent
	function MyEvent() {}
	MyEvent.prototype = {
		on: function() {},
		off: function() {}
	};

	function Kingwell() {}
	Kingwell.prototype = fn = {
		extend: extend,
		trim: function(str) { //Trim String
			var result = '',
				reg = /^\s*(.*?)\s*$/;
			if (this.isString(str)) {
				if (this.isFunction(result.tirm)) {
					result = str.trim();
				} else {
					result = str.replace(reg, '$1');
				}
			} else {
				result = str;
			}
			return result;
		},
		escape: function(str) {
			var result = "";
			if (str.length === 0) {
				return result;
			}
			result = str.replace(/&/g, "&amp;");
			result = resulteplace(/</g, "&lt;");
			result = resulteplace(/>/g, "&gt;");
			result = resulteplace(/ /g, "&nbsp;");
			result = resulteplace(/\'/g, "&#39;");
			result = resulteplace(/\"/g, "&quot;");
			return result;
		}
	};

	KW = {
		extend: extend,
		Type: MyType,
		Dom: MyDom,
		Css: MyCss,
		Event: MyEvent,
		Date: MyDate,
		Box: MyBox,
		Kingwell: Kingwell
	};

	//继承
	for (var key in KW) {
		extend(fn, new KW[key]);
	}
	window.kw = new Kingwell();
	window.KW = KW;

})(this);