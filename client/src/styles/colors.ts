import MainColor from './mainColors'
import { lighten, darken, rgba } from 'polished'
import mainColors from './mainColors'

export default {
	background: rgba(mainColors.application, 0.8),
	border: rgba(lighten(0.1, mainColors.application), 0.8),

	button: {
		disabledBackground: '#eee',
		primary: {
			background: MainColor.primary,
			borderColor: MainColor.primary,
			color: mainColors.text,
			hover: {
				background: lighten(0.1, MainColor.primary),
				borderColor: lighten(0.1, MainColor.primary),
				color: mainColors.text
			}
		},
		secondary: {
			background: MainColor.secondary,
			borderColor: MainColor.secondary,
			color: '#eee',
			hover: {
				background: lighten(0.2, MainColor.primary),
				borderColor: lighten(0.2, MainColor.primary),
				color: '#eee'
			}
		},
		default: {
			background: '#f8f8f8',
			borderColor: '#ddd',
			color: '#555',
			hover: {
				background: '#fff',
				borderColor: '#ccc',
				color: '#333'
			}
		},
		success: {
			background: MainColor.success,
			borderColor: MainColor.success,
			color: '#fff',
			hover: {
				background: darken(0.1, MainColor.success),
				borderColor: darken(0.1, MainColor.success),
				color: '#fff'
			}
		},
		info: {
			background: MainColor.info,
			borderColor: MainColor.info,
			color: '#fff',
			hover: {
				background: lighten(0.1, MainColor.info),
				borderColor: lighten(0.1, MainColor.info),
				color: '#fff'
			}
		},
		danger: {
			background: MainColor.danger,
			borderColor: MainColor.danger,
			color: '#fff',
			hover: {
				background: darken(0.1, MainColor.danger),
				borderColor: darken(0.1, MainColor.danger),
				color: '#fff'
			}
		},
		warn: {
			background: MainColor.warn,
			borderColor: MainColor.warn,
			color: '#fff',
			hover: {
				background: darken(0.2, MainColor.warn),
				borderColor: darken(0.2, MainColor.warn),
				color: '#fff'
			}
		},
		transparent: {
			background: 'none',
			borderColor: 'transparent',
			color: MainColor.text,
			hover: {
				background: 'none',
				borderColor: 'transparent',
				color: darken(0.2, MainColor.text)
			}
		}
	},

	success: {
		light: lighten(0.52, MainColor.success),
		base: MainColor.success
	},

	primary: {
		base: MainColor.primary,
		light: lighten(0.52, MainColor.primary),
		shadowColor: 'rgba(0,123,255,.4)'
	},

	secondary: {
		base: MainColor.secondary,
		light: lighten(0.52, MainColor.secondary),
		shadowColor: 'rgba(0,123,255,.4)'
	},

	warn: {
		base: MainColor.warn,
		light: lighten(0.52, MainColor.warn)
	},

	danger: {
		base: MainColor.danger,
		light: lighten(0.15, MainColor.danger)
	},

	message: {
		info: {
			background: MainColor.info,
			color: '#fff'
		},
		warn: {
			background: MainColor.warn,
			color: '#fff'
		},
		error: {
			background: MainColor.danger,
			color: '#fff'
		},
		success: {
			background: MainColor.success,
			color: '#fff'
		}
	}
}
