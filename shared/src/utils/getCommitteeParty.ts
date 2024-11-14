import { CommitteePartiesLookupApi } from '@shared/CommitteePartiesLookupApi'

export const getCommitteeParty = (partyCode: string) =>
	CommitteePartiesLookupApi.get(partyCode)
