import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	root: 'src',
	resolve: {
		alias: [
			{
				find: '@',
				replacement: path.join(path.resolve(__dirname), 'src')
			},
			{
				find: '@shared',
				replacement: path.join(path.resolve(__dirname), '..', 'shared', 'src')
			}
		]
	},
	plugins: [react()],
	server: {
		port: 8080
	},
	build: {
		outDir: '../dist',
		emptyOutDir: true
	},
	publicDir: '../static',
	envDir: '..'
})
