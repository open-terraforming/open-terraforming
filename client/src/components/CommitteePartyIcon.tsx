import {
	faAtom,
	faFire,
	faHandPeace,
	faHandsHelping,
	faMars,
	faTree,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'

type Params = {
	party: string
}

export const CommitteePartyIcon = ({ party }: Params) => {
	switch (party) {
		case 'mars_first':
			return (
				<GeneralContainer
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

const GeneralContainer = styled.div`
	padding: 0.1rem 0.5rem;
	border-radius: 0.8rem;
	width: 1.5rem;
	display: inline-block;
	text-align: center;
	border: 2px solid #fff;
	font-size: 125%;
`