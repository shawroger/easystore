module.exports = {
	entry: "src/index.ts",
	output: {
		format: "umd",
		moduleName: "easyStore",
		fileNames: {
			js: "index.js",
		},
		clean: false
	},
	configureWebpack: {
		externals: {
			react: {
				commonjs: "react",
				commonjs2: "react",
				amd: "react",
				root: "React",
			}
		},
	},
};
