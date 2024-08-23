import { buildColors } from '@/styles/colors'
import { defaultTheme, Theme } from './defaultTheme'
import { lighten } from 'polished'

const application = '#aa2424'
const text = '#eee'
const primary = lighten(0.1, application)
const secondary = '#265560'
const info = '#3d5969'
const success = '#37B479'
const danger = '#DB433A'
const warn = '#FAA94B'

const colors = buildColors({
	application,
	text,
	primary,
	secondary,
	info,
	success,
	danger,
	warn,
})

export const redTheme: Theme = {
	...defaultTheme,
	colors: {
		...defaultTheme.colors,
		...colors,
	},
}
