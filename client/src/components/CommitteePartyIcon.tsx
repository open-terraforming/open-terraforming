import {
	faAtom,
	faFire,
	faHandPeace,
	faHandsHelping,
	faMars,
	faTree,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled, { css } from 'styled-components'

type Size = 'sm' | 'md'

type Params = {
	party: string
	size?: Size
	className?: string
}

export const CommitteePartyIcon = ({
	party,
	className,
	size = 'md',
}: Params) => {
	switch (party) {
		case 'mars_first':
			return (
				<GeneralContainer
					className={className}
					$size={size}
					style={{
						backgroundColor: '#b87e47',
						color: '#5f3420',
						borderColor: '#85533d',
					}}
				>
					<FontAwesomeIcon icon={faMars} />
				</GeneralContainer>
			)

		case 'kelvinists':
			return (
				<GeneralContainer
					className={className}
					$size={size}
					style={{
						backgroundColor: '#333',
						color: '#f53030',
						borderColor: '#f86666',
					}}
				>
					<FontAwesomeIcon icon={faFire} />
				</GeneralContainer>
			)

		case 'scientists':
			return (
				<GeneralContainer
					className={className}
					$size={size}
					style={{
						backgroundColor: '#e0e0e0',
						color: '#444444',
						borderColor: '#979797',
					}}
				>
					<FontAwesomeIcon icon={faAtom} />
				</GeneralContainer>
			)

		case 'reds':
			return (
				<GeneralContainer
					className={className}
					$size={size}
					style={{
						backgroundColor: '#f00',
						color: '#fff',
						borderColor: '#faa',
					}}
				>
					<FontAwesomeIcon icon={faHandPeace} />
				</GeneralContainer>
			)

		case 'unity':
			return (
				<GeneralContainer
					className={className}
					$size={size}
					style={{
						backgroundColor: '#22a',
						color: '#fff',
						borderColor: '#aaf',
					}}
				>
					<FontAwesomeIcon icon={faHandsHelping} />
				</GeneralContainer>
			)

		case 'greens':
			return (
				<GeneralContainer
					className={className}
					$size={size}
					style={{
						backgroundColor: '#4b4',
						color: '#060',
						borderColor: '#060',
					}}
				>
					<FontAwesomeIcon icon={faTree} />
				</GeneralContainer>
			)
	}
}

const GeneralContainer = styled.div<{ $size: Size }>`
	padding: 0.1em 0.5em;
	border-radius: 0.8em;
	width: 1.5em;
	display: inline-block;
	text-align: center;
	border: 2px solid #fff;
	font-size: 125%;

	${({ $size }) =>
		$size === 'sm' &&
		css`
			width: 1.25em;
			font-size: 80%;
			padding: 0.1em 0.3em;
		`}
`
