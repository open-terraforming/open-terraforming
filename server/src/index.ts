import 'module-alias/register'
import 'source-map-support/register'
import { main } from './main'

main().catch(e => {
	console.error('Fatal error:', e)
})
