import { ucFirst } from '@shared/utils/collections'

const PARTY_CODE_TO_NAME: Record<string, string> = {
	greens: 'Greens',
	mars_first: 'Mars First',
	kelvinists: 'Kelvinists',
	scientists: 'Scientists',
	reds: 'Reds',
	unity: 'Unity',
}

export const partyToName = (partyCode: string) =>
	PARTY_CODE_TO_NAME[partyCode] ?? ucFirst(partyCode)
