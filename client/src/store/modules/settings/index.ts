type State = Readonly<typeof initialState>
type Actions = ReturnType<typeof setSettings> | ReturnType<typeof loadSettings>

const initialData = {
	hiddenHelp: {} as Record<string, boolean>,
	theme: 'default' as undefined | 'default' | 'green' | 'red',
	enableBrowserNotifications: true,
	enableAudio: true,
	audioVolume: 1,
	enableAnimations: true,
	cardImagesUrl: undefined as string | undefined,
}

const initialState = {
	version: '1.0',
	data: initialData,
}

const STORAGE_KEY = 'open-tr-settings'

const SET_SETTINGS = 'SET_SETTINGS'
const LOAD_SETTINGS = 'LOAD_SETTINGS'

export const setSettings = (data: Partial<State['data']>) =>
	({
		type: SET_SETTINGS,
		data,
	}) as const

export const loadSettings = () =>
	({
		type: LOAD_SETTINGS,
	}) as const

export default (state = initialState, action: Actions): State => {
	switch (action.type) {
		case SET_SETTINGS: {
			localStorage[STORAGE_KEY] = JSON.stringify({
				version: state.version,
				data: action.data,
			})

			return {
				...state,
				data: {
					...state.data,
					...action.data,
				},
			}
		}

		case LOAD_SETTINGS: {
			let data = initialData

			try {
				const newData = JSON.parse(localStorage[STORAGE_KEY])

				if (newData.version === state.version) {
					data = {
						...data,
						...newData.data,
					}
				}
			} catch (e) {
				console.warn('Failed to load settings', e)
			}

			return {
				...state,
				data,
			}
		}

		default:
			return state
	}
}
