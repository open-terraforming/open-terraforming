export const captureEnter = (callback: (e: React.KeyboardEvent) => void) => (
	e: React.KeyboardEvent
) => {
	if (e.key === 'Enter') {
		e.preventDefault()
		e.stopPropagation()

		callback(e)
	}
}

export const stopEvent = <T extends React.SyntheticEvent>(
	callback: (e: T) => void
) => (e: T) => {
	e.stopPropagation()
	e.preventDefault()

	callback(e)
}
