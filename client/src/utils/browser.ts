const IS_CHROME =
	/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)

export const getAutocompleteOffString = () => (IS_CHROME ? 'off' : 'no')
