module.exports = {
	plugins: {
		tailwindcss: {},
		"vue-cli-plugin-tailwind/purgecss": {
			whitelist: ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-teal-500", "bg-blue-900", "bg-blue-800", "bg-blue-200", "bg-blue-100", "fill-current", "text-xs", "text-sm"],
			whitelistPatterns: [/scrollama/, /text-blue/, /text-teal/, /text-purple/, /text-green/, /text-red/]
		},
	}
};
