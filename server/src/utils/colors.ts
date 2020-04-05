import { shuffle } from './collections'

const colors: string[] = shuffle([
	'#DDDD00',
	'#0AB900',
	'#FF5757',
	'#2E2E2E',
	'#F9A424',
	'#FF71B8',
	'#909090',
	'#F0F0F0',
	'#AD5C5C'
])

export const nextColor = () => colors.pop() || '#000'
