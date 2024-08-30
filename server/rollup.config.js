/* eslint-disable @typescript-eslint/no-require-imports */
const esbuild = require('rollup-plugin-esbuild').default

const typescriptPaths =
	require('rollup-plugin-typescript-paths').typescriptPaths

const nodeResolve = require('@rollup/plugin-node-resolve').default
const commonjs = require('@rollup/plugin-commonjs').default
const json = require('@rollup/plugin-json').default

module.exports = {
	input: 'src/index.ts',
	output: {
		file: 'bundle.js',
		format: 'cjs',
	},
	plugins: [
		esbuild({ minify: true }),
		typescriptPaths({ preserveExtensions: true }),
		nodeResolve(),
		commonjs(),
		json(),
	],
}
