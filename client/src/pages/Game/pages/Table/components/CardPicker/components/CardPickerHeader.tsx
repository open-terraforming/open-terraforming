import { colors } from '@/styles'
import { media } from '@/styles/media'
import { useAppStore } from '@/utils/hooks'
import { faTint, faThermometerHalf } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ExpansionType } from '@shared/expansions/types'
import React from 'react'
import styled from 'styled-components'

type Props = {
	text: string
}

export const CardPickerHeader = ({ text }: Props) => {
	const game = useAppStore(state => state.game.state)

	return (
		<PickerHeader>
			{text}
			<GameProgress>
				<ProgressItem>
					<Res>
						<FontAwesomeIcon icon={faTint} />
					</Res>
					<span>
						{game.oceans} / {game.map.oceans}
					</span>{' '}
				</ProgressItem>
				<ProgressItem>
					<Res>
						<FontAwesomeIcon icon={faThermometerHalf} />
					</Res>
					<span>
						{game.temperature * 2} / {game.map.temperature * 2}
					</span>{' '}
				</ProgressItem>
				<ProgressItem>
					<Res>
						O<sub>2</sub>
					</Res>
					<span>
						{game.oxygen} / {game.map.oxygen}
					</span>{' '}
				</ProgressItem>
				{game.expansions.includes(ExpansionType.Venus) && (
					<ProgressItem>
						<Res>V</Res>
						<span>
							{game.venus * 2} / {game.map.venus * 2}
						</span>{' '}
					</ProgressItem>
				)}
			</GameProgress>
		</PickerHeader>
	)
}

const PickerHeader = styled.div`
	display: flex;
	align-items: center;
`

const GameProgress = styled.div`
	display: flex;
	justify-content: center;
	font-size: 85%;
	margin-left: 1rem;

	${media.medium} {
		display: none;
	}
`

const ProgressItem = styled.div`
	display: flex;
	margin: 0 0.25rem;
	background-color: ${colors.background};
	border: 1px solid ${colors.border};

	> span {
		margin-left: 0.25rem;
		padding: 0.5rem;
	}
`

const Res = styled.div`
	background-color: ${colors.border};
	padding: 0.5rem;
`
