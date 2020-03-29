/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'preload-webpack-plugin' {
	class PreloadWebpackPlugin {
		constructor(opts?: { rel: 'prefetch' | 'preload' })
		apply(c: any): void
	}

	export default PreloadWebpackPlugin
}
