module.exports = {
	plugins: {
		tailwindcss: {},
		"vue-cli-plugin-tailwind/purgecss": {
			whitelist: ["bg-red-400", "bg-blue-400", "bg-green-400", "bg-purple-400", "bg-teal-400", "bg-blue-900", "bg-blue-800", "bg-blue-200", "bg-blue-100", "fill-current", "text-xs", "text-sm"],
			whitelistPatterns: [/scrollama/, /text-blue/, /text-teal/, /text-purple/, /text-green/, /text-red/]
		},
	}
};
