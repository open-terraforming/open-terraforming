const { compile } = require('nexe')
const { exec } = require('child_process')
const { copy, remove } = require('fs-extra')
const { join } = require('path')
const { promises: fs } = require('fs')

const SERVER_ROOT = join(__dirname, '../../server')
const DST = join(__dirname, '..', 'dist')
async function main() {
	console.log('Cleaning destination')

	await remove(DST)

	console.log('Building exe')
	
	await compile({
		input: './index.js',
		build: true, //required to use patches,
		ico: './icon.ico',
		name: join(DST, 'open-terraforming.exe')
	})

	// console.log('Loading package info')
	// const requireModules = Object.keys(JSON.parse(await fs.readFile(join(SERVER_ROOT, 'package.json'))).dependencies)
	// await Promise.all(requireModules.map(modName => copy(join(SERVER_ROOT, 'node_modules', modName), join(DST, 'node_modules', modName))))

	console.log('Packing server')

	await copy(join(SERVER_ROOT, 'dist'), join(DST, 'dist'))
	await copy(join(SERVER_ROOT, 'node_modules'), join(DST, 'node_modules'))
	await copy(join(SERVER_ROOT, 'package.json'), join(DST, 'package.json'))
}

main().catch(console.error)