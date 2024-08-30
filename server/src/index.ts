import moduleAlias from 'module-alias'

moduleAlias.addAliases({
	'@': __dirname + '../../../../dist/server/src',
	'@shared': __dirname + '../../../../dist/shared/src',
})

import 'source-map-support/register'

import { main } from './main'

main().catch((e) => {
	console.error('Fatal error:', e)
})
