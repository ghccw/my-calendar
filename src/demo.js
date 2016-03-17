(function(window) {
	var $$ = function(id) {
		return document.getElementById(id);
	};
	var h2 = document.getElementsByTagName('h2');
	var len = h2.length;
	var arr = [];
	arr.push('<ol>');
	for (var i = 0; i < len; i++) {
		var a = kw.createElement('a');
		var id = 'id' + i;
		a.name = id;
		a.id = id;
		//a.href = "#" + id;
		kw.insertBefore(a, h2[i]);
		arr.push('<li><a href="#' + id + '" target="_self">' + kw.text(h2[i]) + '</a></li>');
	}
	arr.push('</ol>');
	$$('demoMenubox').innerHTML = arr.join('');
})(this);