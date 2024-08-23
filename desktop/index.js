require('module-alias/register')
require('module-alias/register')

const { main } = require('@/main')
const opn = require('opn')

main().then(({ port }) => {
	opn(`http://127.0.0.1:${port}`)
})