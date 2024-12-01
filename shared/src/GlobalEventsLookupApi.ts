import { turmoilGlobalEvents } from './expansions/turmoil/turmoilGlobalEvents'
import { lookupApi } from './lib/lookup-api'

export const GlobalEventsLookupApi = lookupApi([...turmoilGlobalEvents])
