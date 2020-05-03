import MainColor from './mainColors'
import { lighten, darken, rgba } from 'polished'
import mainColors from './mainColors'

export default {
	background: rgba(mainColors.application, 0.8),
	border: rgba(lighten(0.1, mainColors.application), 0.8),

	button: {
		disabledBackground: darken(0.1, MainColor.primary),
		disabledBorder: darken(0.1, MainColor.primary),
		disabledColor: darken(0.1, mainColors.text),
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
