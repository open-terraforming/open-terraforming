import { CardType } from '@shared/cards'
import { lighten, darken, rgba } from 'polished'

const application = '#182541'
const text = '#BDCBEE'
const primary = lighten(0.1, application)
const secondary = '#265560'
const info = '#265560'
const success = '#37B479'
const danger = '#DB433A'
const warn = '#FAA94B'

export default {
	application,
	text,

	background: rgba(application, 0.8),
	border: rgba(lighten(0.1, application), 0.8),

	button: {
		disabledBackground: darken(0.1, primary),
		disabledBorder: darken(0.1, primary),
		disabledColor: darken(0.1, text),
		primary: {
			background: primary,
			borderColor: primary,
			color: text,
			hover: {
				background: lighten(0.1, primary),
				borderColor: lighten(0.1, primary),
				color: text
			}
		},
		transparent: {
			background: 'none',
			borderColor: 'transparent',
			color: text,
			hover: {
				background: 'none',
				borderColor: 'transparent',
				color: darken(0.2, text)
			}
		}
	},

	success: {
		light: lighten(0.52, success),
		base: success
	},

	primary: {
		base: primary,
		light: lighten(0.52, primary),
		shadowColor: 'rgba(0,123,255,.4)'
	},

	secondary: {
		base: secondary,
		light: lighten(0.52, secondary),
		shadowColor: 'rgba(0,123,255,.4)'
	},

	warn: {
		base: warn,
		light: lighten(0.52, warn)
	},

	danger: {
		base: danger,
		light: lighten(0.15, danger)
	},

	message: {
		info: {
			background: info,
			color: '#fff'
		},
		warn: {
			background: warn,
			color: '#fff'
		},
		error: {
			background: danger,
			color: '#fff'
		},
		success: {
			background: success,
			color: '#fff'
		}
	},

	cards: {
		[CardType.Action]: '#0F87E2',
		[CardType.Building]: '#56BA1B',
		[CardType.Effect]: '#0F87E2 ',
		[CardType.Event]: '#FF6868',
		[CardType.Corporation]: '#BAC404',
		[CardType.Prelude]: '#FF86C2'
	}
}
