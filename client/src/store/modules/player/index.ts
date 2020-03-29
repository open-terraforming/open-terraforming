type State = Readonly<typeof initialState>

const initialState = {
	error: null,
}

export default (state = initialState, action: any): State => {
	return state
}
