import { CommitteePartiesLookupApi } from '@shared/CommitteePartiesLookupApi'
import { argValidator } from './argValidator'

export const committeePartyValidator = argValidator(({ value }) => {
	if (typeof value !== 'string') {
		throw new Error(
			'Invalid committee party argument - expected string, got ' +
				JSON.stringify(value),
		)
	}

	const party = CommitteePartiesLookupApi.getOptional(value)

	if (!party) {
		throw new Error(`Invalid committee party: ${value}`)
	}
})
