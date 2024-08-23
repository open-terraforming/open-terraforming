import {
	faAtom,
	faCloud,
	faFighterJet,
	faMicroscope,
	faPaw,
	faRocket,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CardResource } from '@shared/cards'
import { useMemo } from 'react'
import styled from 'styled-components'

type Props = {
	res: CardResource
}

const resourceToColor: Record<CardResource, string> = {
	animals: '#266020',
	microbes: '#BCE444',
	fighters: '#fff',
	science: '#fff',
	floaters: '#b3b149',
	asteroids: '#fff',
}

export const CardResourceIcon = ({ res }: Props) => {
	const icon = useMemo(() => {
		switch (res) {
			case 'animals':
				return <FontAwesomeIcon icon={faPaw} color="#fff" />
			case 'microbes':
				return <FontAwesomeIcon icon={faMicroscope} color="#5A703B" />
			case 'science':
				return <FontAwesomeIcon icon={faAtom} color="#000" />
			case 'fighters':
				return <FontAwesomeIcon icon={faFighterJet} color="#000" />
			case 'floaters':
				return <FontAwesomeIcon icon={faCloud} color="#fff" size="xs" />
			case 'asteroids':
				// TODO: Better icon
				return <FontAwesomeIcon icon={faRocket} color="#000" />
		}
	}, [res])

	return <E style={{ backgroundColor: resourceToColor[res] }}>{icon}</E>
}

const E = styled.div`
	width: 1.25rem;
	height: 1.25rem;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 0.25rem;
`
