import { Button } from '@/components'
import { useApi } from '@/context/ApiContext'
import { setTableState } from '@/store/modules/table'
import { colors } from '@/styles'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import {
	faAngleUp,
	faArrowRight,
	faThermometerHalf,
	faTree
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Corporations } from '@shared/corporations'
import {
	buyStandardProject,
	GridCellContent,
	GridCellOther,
	playerPass,
	PlayerStateValue,
	StandardProjectType
} from '@shared/index'
import { darken, rgba } from 'polished'
import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { CardBuy } from '../CardBuy/CardBuy'
import { CompetitionsModal } from '../CompetitionsModal/CompetitionsModal'
import { Hand } from '../Hand/Hand'
import { MilestonesModal } from '../MilestonesModal/MilestonesModal'
import { PlayedCards } from '../PlayedCards/PlayedCards'
import { ResourceIcon } from '../ResourceIcon/ResourceIcon'
import { StandardProjectModal } from '../StandardProjectModal/StandardProjectModal'
import { Resources } from './components/Resources'

export const Controls = () => {
	const api = useApi()
	const dispatch = useAppDispatch()
	const player = useAppStore(state => state.game.player)
	const game = useAppStore(state => state.game.state)

	const buyingCardIndex = useAppStore(state => state.table.buyingCardIndex)
	const playingCardIndex = useAppStore(state => state.table.playingCardIndex)
	const state = player
	const corporation = Corporations.find(c => c.code === state?.corporation)
	const [handOpened, setHandOpened] = useState(false)
	const [cardsOpened, setCardsOpened] = useState(false)
	const [projectsOpened, setProjectsOpened] = useState(false)
	const [competitionsOpened, setCompetitionsOpened] = useState(false)
	const [milestonesOpened, setMilestonesOpened] = useState(false)
	const stackedActions = player?.cardsToPlay

	const isPlaying = state?.state === PlayerStateValue.Playing

	const placingTile = state?.placingTile[0]

	const handlePass = () => {
		api.send(playerPass(false))
	}

	const buyTemperature = () => {
		if (player && player.heat >= 8) {
			api.send(buyStandardProject(StandardProjectType.TemperatureForHeat))
		}
	}

	const buyForest = () => {
		if (player && player.plants >= player.greeneryCost) {
			api.send(buyStandardProject(StandardProjectType.GreeneryForPlants))
		}
	}

	return state ? (
		<Container faded={!!placingTile}>
			{handOpened && (
				<Hand playing={isPlaying} onClose={() => setHandOpened(false)} />
			)}
			{cardsOpened && (
				<PlayedCards
					playing={isPlaying}
					onClose={() => setCardsOpened(false)}
				/>
			)}

			{stackedActions && stackedActions.length > 0 && (
				<CardBuy
					buying={false}
					index={stackedActions[0]}
					onClose={() => false}
				/>
			)}

			{playingCardIndex !== undefined && (
				<CardBuy
					buying={false}
					index={playingCardIndex}
					onClose={() =>
						dispatch(
							setTableState({
								playingCardIndex: undefined
							})
						)
					}
				/>
			)}

			{buyingCardIndex !== undefined && (
				<CardBuy
					buying={true}
					index={buyingCardIndex}
					onClose={() =>
						dispatch(
							setTableState({
								buyingCardIndex: undefined
							})
						)
					}
				/>
			)}

			{projectsOpened && (
				<StandardProjectModal
					playing={isPlaying}
					onClose={() => setProjectsOpened(false)}
				/>
			)}

			{competitionsOpened && (
				<CompetitionsModal
					playing={isPlaying}
					onClose={() => setCompetitionsOpened(false)}
				/>
			)}

			{milestonesOpened && (
				<MilestonesModal
					playing={isPlaying}
					onClose={() => setMilestonesOpened(false)}
				/>
			)}

			<Flexed>
				<Resources state={state} />
			</Flexed>
			<CardButtons>
				<Button
					icon={faAngleUp}
					disabled={state.cards.length === 0 || !!placingTile}
					onClick={() => setHandOpened(true)}
				>
					{state.cards.length} cards in hand
				</Button>
				<Button
					icon={faAngleUp}
					disabled={state.usedCards.length === 0 || !!placingTile}
					onClick={() => setCardsOpened(true)}
				>
					{state.usedCards.length} cards on table
				</Button>
			</CardButtons>
			{/*<div>{corporation?.name}</div>*/}
			<Flexed>
				<Button onClick={() => setProjectsOpened(true)}>
					Standard projects
				</Button>

				<CardButtons>
					<Button onClick={() => setMilestonesOpened(true)}>Milestones</Button>
					<Button onClick={() => setCompetitionsOpened(true)}>
						Competitions
					</Button>
				</CardButtons>

				<CardButtons>
					<Button
						disabled={
							!isPlaying ||
							(player?.heat || 0) < 8 ||
							(game?.temperature || 0) >= (game?.map.temperature || 0)
						}
						onClick={buyTemperature}
					>
						+<FontAwesomeIcon icon={faThermometerHalf} /> for 8{' '}
						<ResourceIcon res="heat" />
					</Button>
					<Button
						disabled={
							!isPlaying || (player?.plants || 0) < (player?.greeneryCost || 0)
						}
						onClick={buyForest}
					>
						Build <FontAwesomeIcon icon={faTree} /> for {player?.greeneryCost}{' '}
						<ResourceIcon res="plants" />
					</Button>
				</CardButtons>

				<PassButton
					disabled={!isPlaying || !!placingTile}
					onClick={handlePass}
					icon={faArrowRight}
				>
					Pass
				</PassButton>
			</Flexed>
			{placingTile && (
				<Fade>
					<div>
						Placing{' '}
						{placingTile.type === GridCellContent.Other
							? GridCellOther[placingTile.other as GridCellOther]
							: GridCellContent[placingTile.type]}{' '}
					</div>
				</Fade>
			)}
		</Container>
	) : (
		<></>
	)
}

const Container = styled.div<{ faded: boolean }>`
	position: relative;
	display: flex;
	justify-content: center;
	background-color: ${colors.background};
	border-top: 0.2rem solid ${colors.border};
	background: linear-gradient(
		45deg,
		${darken(0.01, colors.background)} 25%,
		${colors.background} 25%,
		${colors.background} 50%,
		${darken(0.01, colors.background)} 50%,
		${darken(0.01, colors.background)} 75%,
		${colors.background} 75%,
		${colors.background}
	);
	background-size: 40px 40px;

	${props =>
		props.faded &&
		css`
			opacity: 0.7;
		`}
`

const Fade = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: ${rgba(colors.background, 0.5)};
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 125%;
	font-weight: bold;
	color: #fff;
`

const Flexed = styled.div`
	flex: 1;
	display: flex;
`

const CardButtons = styled.div`
	display: flex;
	flex-direction: column;
	align-content: center;
	justify-content: space-around;
	margin: 0 1rem;
`

const PassButton = styled(Button)`
	margin-left: auto;
`
