export { CardsLookupApi } from './lookup'
export * from './types'
export * from './args'
import { coloniesCorporations } from '@shared/expansions/colonies/coloniesCorporations'
import { coloniesCards } from '@shared/expansions/colonies/coloniesCards'
import { baseCards } from './base/cards'
import { baseCorporations } from './base/corporations'
import { Cards } from './list'
import { preludeCards } from './prelude/cards'
import { preludeCorporations } from './prelude/corporations'
import { preludePreludes } from './prelude/prelude'
import { venusCards } from './venus/venusCards'
import { venusCorporations } from './venus/venusCorporations'
import { turmoilCards } from '@shared/expansions/turmoil/turmoilCards'
import { turmoilCorporations } from '@shared/expansions/turmoil/turmoilCorporations'

if (Cards.length === 0) {
	Cards.push(...baseCorporations)
	Cards.push(...preludeCorporations)
	Cards.push(...baseCards)
	Cards.push(...preludeCards)
	Cards.push(...preludePreludes)
	Cards.push(...venusCards)
	Cards.push(...venusCorporations)
	Cards.push(...coloniesCards)
	Cards.push(...coloniesCorporations)
	Cards.push(...turmoilCards)
	Cards.push(...turmoilCorporations)
}
