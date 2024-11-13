import { lookupApi } from '@shared/lib/lookup-api'
import { coloniesColonies } from './expansions/colonies/coloniesColonies'

export const COLONIES_LIST = [...coloniesColonies]

export const ColoniesLookupApi = lookupApi(COLONIES_LIST)
