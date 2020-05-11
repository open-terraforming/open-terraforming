// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./preload-webpack-plugin.d.ts" />

import webpack from 'webpack'
import path, { join } from 'path'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import ForkTsCheckerNotifierWebpackPlugin from 'fork-ts-checker-notifier-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { argv } from 'yargs'
import { getEnvValues, loadEnv, ENV } from './lib/env'
import { srcPath } from './lib/paths'
import CircularDependencyPlugin from 'circular-dependency-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import PreloadWebpackPlugin from 'preload-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require(path.join(__dirname, '..', 'package.json'))

const config = (env: ENV): webpack.Configuration => {
	const bundleAnalysis = !!argv.bundleSize

	// Loads .env files
	loadEnv()

	const babelOptions = {
		presets: [
			[
				'@babel/env',
				{
					modules: false,
					targets:
						'last 2 Chrome versions, last 2 firefox versions, last 2 safari versions'
				}
			],
			'@babel/react'
		],
		plugins: [
			...(env === 'development' ? ['react-hot-loader/babel'] : []),
			'@babel/transform-runtime',
			'babel-plugin-styled-components'
		],
		cacheDirectory: true
	}

	return {
		mode: env,

		stats: {
			all: false,
			colors: true,
			errors: true,
			errorDetails: true,
			timings: true,
			warnings: true
		},

		entry: [
			...(env === 'development' ? ['react-hot-loader/patch'] : []),
			srcPath('index.tsx')
		],

		devtool:
			env === 'development'
				? 'cheap-module-eval-source-map'
				: 'nosources-source-map',

		optimization: {
			minimizer: [
				new TerserPlugin({
					cache: true,
					parallel: true,
					sourceMap: true,
					terserOptions: {
						ie8: false
					}
				})
			],
			splitChunks: {
				chunks: 'all'
			}
		},

		output: {
			path: path.join(__dirname, '..', 'dist'),
			filename: 'js/[name].[hash].bundle.js',
			chunkFilename:
				env === 'production'
					? 'js/[name].[contenthash:8].chunk.js'
					: 'js/[name].chunk.js'
		},

		module: {
			rules: [
				{
					test: /\.ts(x?)$/,
					exclude: /node_modules/,
					use: [
						{
							loader: 'babel-loader',
							options: babelOptions
						},
						{
							loader: 'ts-loader',
							options: {
								transpileOnly: true,
								compilerOptions: {
									target: 'es2016',
									module: 'esnext'
								}
							}
						}
					]
				},
				{
					test: /\.(jpg|png)$/,
					loader: 'file-loader',
					options: {
						name: 'images/[path][name].[ext]'
					}
				}
			]
		},

		plugins: [
			...(env === 'development'
				? [new webpack.HotModuleReplacementPlugin()]
				: [new CleanWebpackPlugin()]),

			new webpack.DefinePlugin(getEnvValues(env, pkg.version)),

			new HtmlWebpackPlugin({
				template: srcPath('index.html'),
				favicon: srcPath('assets/favicon.ico')
			}),

			new PreloadWebpackPlugin({
				rel: 'prefetch'
			}),

			// Speed up build time by ignoring type checking and circular dependency checking
			...(env === 'development'
				? [
						new ForkTsCheckerWebpackPlugin({
							reportFiles: ['src/**/*.{ts,tsx}']
						}),
						new ForkTsCheckerNotifierWebpackPlugin(),

						new CircularDependencyPlugin({
							exclude: /node_modules/
						})
				  ]
				: []),

			...(bundleAnalysis ? [new BundleAnalyzerPlugin()] : []),

			// Copy static assets to dist path
			...(env === 'production'
				? [new CopyWebpackPlugin([srcPath('../static')])]
				: [])
		],

		resolve: {
			extensions: ['.js', '.ts', '.tsx'],

			// Allow importing modules from shared library
			modules: [path.resolve(__dirname, '..', 'node_modules'), 'node_modules'],

			alias: {
				...(env === 'development'
					? { 'react-dom': '@hot-loader/react-dom' }
					: {}),
				'@shared': srcPath('../../shared/src'),
				'@': srcPath()
			}
		},

		devServer: {
			hot: true,
			contentBase: join(__dirname, '..', 'static')
		}
	}
}

export default config
