function scrollPosition () {
	var doc = document.documentElement;
	var x = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
	var y = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
	return {y: y, x: x};
}

export { scrollPosition };
