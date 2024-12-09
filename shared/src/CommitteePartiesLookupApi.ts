import { turmoilCommitteeParties } from './expansions/turmoil/turmoilCommitteeParties'
import { lookupApi } from './lib/lookup-api'

export const CommitteePartiesLookupApi = lookupApi([...turmoilCommitteeParties])
