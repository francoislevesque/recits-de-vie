function scrollPosition () {
	var doc = document.documentElement;
	var x = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
	var y = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
	return {y: y, x: x};
}

function uuid(n = 12) {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
	for (var i = 0; i < n; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

export { scrollPosition, uuid, debounce };
