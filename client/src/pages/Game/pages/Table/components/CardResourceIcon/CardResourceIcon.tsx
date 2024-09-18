import {
	faAtom,
	faCampground,
	faCloud,
	faFighterJet,
	faMicroscope,
	faPaw,
	faRocket,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CardResource } from '@shared/cards'
import { useMemo } from 'react'
import styled, { css } from 'styled-components'

type Props = {
	res: CardResource
	fixedHeight?: boolean
}

const resourceToColor: Record<CardResource, string> = {
	animals: '#266020',
	microbes: '#BCE444',
	fighters: '#fff',
	science: '#fff',
	floaters: '#b3b149',
	asteroids: '#fff',
	camps: '#c7a50f',
}

export const CardResourceIcon = ({ res, fixedHeight }: Props) => {
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
			case 'camps':
				return <FontAwesomeIcon icon={faCampground} color="#000" />
		}
	}, [res])

	return (
		<E
			$fixedHeight={fixedHeight}
			style={{ backgroundColor: resourceToColor[res] }}
		>
			{icon}
		</E>
	)
}

const E = styled.div<{ $fixedHeight?: boolean }>`
	${({ $fixedHeight }) =>
		$fixedHeight
			? css`
					width: 1em;
					height: 1em;

					.svg-inline--fa {
						font-size: 65%;
					}
				`
			: css`
					width: 1.25em;
					height: 1.25em;
				`}

	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 0.25rem;
`
