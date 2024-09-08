import { CardType } from '@shared/cards'
import { lighten, darken, rgba } from 'polished'

type Props = {
	application: string
	text: string
	primary: string
	secondary: string
	info: string
	success: string
	danger: string
	warn: string
}

export const buildColors = ({
	application,
	text,
	primary,
	secondary,
	info,
	success,
	danger,
	warn,
}: Props) => {
	return {
		application,
		text,

		background: rgba(application, 0.8),
		modalBackground: rgba(rgba(application, 0.8), 0.95),
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
					color: text,
				},
			},
			transparent: {
				background: 'none',
				borderColor: 'transparent',
				color: text,
				hover: {
					background: 'none',
					borderColor: 'transparent',
					color: darken(0.2, text),
				},
			},
		},

		success: {
			light: lighten(0.52, success),
			base: success,
		},

		primary: {
			base: primary,
			light: lighten(0.52, primary),
			shadowColor: 'rgba(0,123,255,.4)',
		},

		secondary: {
			base: secondary,
			light: lighten(0.52, secondary),
			shadowColor: 'rgba(0,123,255,.4)',
		},

		warn: {
			base: warn,
			light: lighten(0.52, warn),
		},

		danger: {
			base: danger,
			light: lighten(0.15, danger),
		},

		message: {
			info: {
				background: 'transparent',
				color: text,
				border: `2px solid ${info}`,
			},
			warn: {
				background: 'transparent',
				color: text,
				border: `2px solid ${warn}`,
			},
			error: {
				background: 'transparent',
				color: text,
				border: `2px solid ${danger}`,
			},
			success: {
				background: 'transparent',
				color: text,
				border: `2px solid ${success}`,
			},
		},

		cards: {
			[CardType.Action]: '#0F87E2',
			[CardType.Building]: '#56BA1B',
			[CardType.Effect]: '#0F87E2',
			[CardType.Event]: '#FF6868',
			[CardType.Corporation]: '#BAC404',
			[CardType.Prelude]: '#FF86C2',
		},
	}
}

const application = '#182541'
const text = '#BDCBEE'
const primary = lighten(0.1, application)
const secondary = '#265560'
const info = '#3d5969'
const success = '#37B479'
const danger = '#DB433A'
const warn = '#FAA94B'

export default buildColors({
	application,
	text,
	primary,
	secondary,
	info,
	success,
	danger,
	warn,
})
