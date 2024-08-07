const fs = require('fs')

const targetPackage = JSON.parse(fs.readFileSync('package.json').toString())

const newPackage = {
	...targetPackage,
	devDependencies: {},
}

fs.writeFileSync('package.json', JSON.stringify(newPackage, null, 2))
