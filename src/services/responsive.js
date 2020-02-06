
const isMobile = function() {
	return window.innerWidth < 1024;
};

const isDesktop = function() {
	return window.innerWidth > 1365;
};

export { isMobile, isDesktop };
