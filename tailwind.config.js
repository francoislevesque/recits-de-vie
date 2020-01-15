const { colors } = require("tailwindcss/defaultTheme");

module.exports = {
	theme: {
		container: {
			center: true,
		},
		lineHeight: {
			none: 1,
			tight: 1.15,
			snug: 1.375,
			normal: 1.5,
			relaxed: 1.625,
			loose: 2
		},
		fontFamily: {
			sans: [
				"proxima-nova",
				"Inter",
				"-apple-system",
				"BlinkMacSystemFont",
				"\"Segoe UI\"",
				"Roboto",
				"\"Helvetica Neue\"",
				"Arial",
				"\"Noto Sans\"",
				"sans-serif",
				"\"Apple Color Emoji\"",
				"\"Segoe UI Emoji\"",
				"\"Segoe UI Symbol\"",
				"\"Noto Color Emoji\"",
			],
		},
		extend: {
			colors: {
				blue: {
					...colors.blue,
					100: "#fbfcfe",
					200: "#eef3f9",
					300: "#d9e4f2",
					800: "#1e273b",
					900: "#081024"
				}
			},
			maxWidth: {
				"8xl": "90rem"
			},
			width: {
				"72": "18rem",
				"90": "20rem"
			},
			height: {
				"auto": "auto",
				"1/3": "33.33%",
				"4/10": "40%",
				"6/10": "60%"
			}
		}
	},
	variants: {},
	plugins: []
};
