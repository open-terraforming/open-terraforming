const { main } = require('../dist/main')
const opn = require('opn')

console.log(main)

main().then(({ port }) => {
	opn(`http://127.0.0.1:${port}`)
})