import { IconProp } from '@fortawesome/fontawesome-svg-core'
import styled from 'styled-components'
import mars from '@/assets/mars-icon.png'

export const cardIcon = {
	prefix: 'fas',
	iconName: 'ad',
	icon: [
		640,
		640,
		[],
		'f641',
		'M520 27.95C520 146.9 520 493.1 520 612.05C520 617.92 514.92 622.68 508.66 622.68C430.93 622.68 209.07 622.68 131.34 622.68C125.08 622.68 120 617.92 120 612.05C120 493.1 120 146.9 120 27.95C120 22.08 125.08 17.32 131.34 17.32C209.07 17.32 430.93 17.32 508.66 17.32C514.92 17.32 520 22.08 520 27.95Z',
	],
} as IconProp

export const Card = styled.div`
	display: inline-block;
	background-color: #000;
	border-radius: 0.15em;
	width: 1em;
	height: 1.4em;
	margin: 0 0.1rem;

	background-image: url('${mars}');
	background-position: center center;
	background-size: 70% auto;
	background-repeat: no-repeat;
`
