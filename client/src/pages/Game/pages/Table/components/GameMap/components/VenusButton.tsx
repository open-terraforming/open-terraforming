import React, { useEffect, useState } from 'react'
import venusBackground from '@/assets/venus-background.png'
import styled from 'styled-components'
import { VenusModal } from './VenusModal'
import { useAppStore } from '@/utils/hooks'
import { GridCellContent, GridCellLocation } from '@shared/game'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCity } from '@fortawesome/free-solid-svg-icons'
import { colors } from '@/styles'
import { venusIcon } from '@/icons/venus'
import { PlacementState } from '@shared/placements'

type Props = {
	placing?: PlacementState
}

export const VenusButton = ({ placing }: Props) => {
	const [open, setOpen] = useState(false)
	const game = useAppStore(state => state.game.state)

	const venusMap = game.map.grid.map(col =>
		col.filter(c => c.enabled && c.location === GridCellLocation.Venus)
	)

	useEffect(() => {
		if (
			!open &&
			placing?.special?.length &&
			venusMap.some(col =>
				col.some(
					cell => cell.special && placing.special?.includes(cell.special)
				)
			)
		) {
			setOpen(true)
		}
	}, [placing, open])

	return (
		<>
			<Container>
				<img src={venusBackground} alt="Venus" onClick={() => setOpen(true)} />
				<LabelContainer>
					<Label>Venus</Label>
					<ProgressContainer>
						<ProgressIcon>
							<FontAwesomeIcon icon={venusIcon} />
						</ProgressIcon>
						<ProgressValue>
							{game.venus * 2}{' '}
							<ProgressTarget>/ {game.map.venus * 2}</ProgressTarget>
						</ProgressValue>
					</ProgressContainer>
					<CitiesContainer>
						<FontAwesomeIcon icon={faCity} /> x
						{venusMap.reduce(
							(acc, m) =>
								acc + m.filter(c => c.content === GridCellContent.City).length,
							0
						)}
					</CitiesContainer>
				</LabelContainer>
			</Container>
			{open && (
				<VenusModal
					placing={placing}
					open={open}
					onClose={() => setOpen(false)}
				/>
			)}
		</>
	)
}

const Container = styled.div`
	position: absolute;
	right: 0;
	bottom: 0;
	margin-right: -75px;
	margin-bottom: -75px;
	border-radius: 50%;
	box-shadow: 0px 0px 20px 14px rgba(200, 200, 255, 0.4);
	z-index: 5;
	cursor: pointer;
	transition: box-shadow 0.1s;

	> img {
		width: 150px;
		height: 150px;
	}

	&:hover {
		box-shadow: 0px 0px 20px 14px rgba(200, 200, 255, 0.6);
	}
`

const LabelContainer = styled.div`
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	pointer-events: none;
`

const Label = styled.div`
	font-size: 125%;
	text-shadow: 0px 0px 4px rgba(0, 0, 0, 1);
`

const CitiesContainer = styled.div`
	padding: 0.5rem;
	border: 2px solid ${colors.border};
	background-color: ${colors.background};
`

const ProgressContainer = styled.div`
	display: flex;
	margin: 0.5rem 0;
`

const ProgressIcon = styled.div`
	padding: 0 1rem;
	display: flex;
	align-items: center;
	border: 2px solid ${colors.border};
	border-right: 0;
	background-color: ${colors.background};
`

const ProgressValue = styled.div`
	background-color: ${colors.border};
	border-left: 0;

	padding: 0.5rem;
	font-size: 150%;

	flex: 1;

	text-align: center;
`

const ProgressTarget = styled.span`
	color: #aaa;
`
