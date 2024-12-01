import { GlobalEventsLookupApi } from '@shared/GlobalEventsLookupApi'

export const getGlobalEvent = (eventCode: string) =>
	GlobalEventsLookupApi.get(eventCode)
