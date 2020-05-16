const path = require('path')

const root = (...p) => path.join(__dirname, ...p)

module.exports = {
	mode: "development",
	target: "node",
	entry: root("../server/src/index.ts"),
	output: {
		path: root('../server/dist/desktop')
	},
	externals: {
		'express': 'commonjs express',
		'ws': 'commonjs ws',
		'yargs': 'commonjs yargs',
		'got': 'commonjs got'
	},
	module: {
		rules: [{
			test: /\.ts$/,
			loader: "ts-loader",
			options: {
				configFile: root('../server/tsconfig.json')
			}
		}]
	},
	resolve: {
		extensions: [".js", ".ts"],
		modules: [root('../server/node_modules')],
		alias: {
			'@shared': root('../shared/src'),
			'@': root('../server/src'),
			'module-alias': root('src/module-alias')
		}
	}
}