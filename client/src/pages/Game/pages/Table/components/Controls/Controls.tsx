import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { useAppStore, useAppDispatch } from '@/utils/hooks'
import { Resources } from './components/Resources'
import { Button } from '@/components'
import { Corporations } from '@shared/corporations'
import {
	playerPass,
	PlayerStateValue,
	buyStandardProject,
	StandardProjectType
} from '@shared/index'
import {
	faArrowRight,
	faAngleUp,
	faThermometerHalf,
	faTree
} from '@fortawesome/free-solid-svg-icons'
import { Hand } from '../Hand/Hand'
import { PlayedCards } from '../PlayedCards/PlayedCards'
import { setTableState } from '@/store/modules/table'
import { CardBuy } from '../CardBuy/CardBuy'
import { useApi } from '@/context/ApiContext'
import { StandardProjectModal } from '../StandardProjectModal/StandardProjectModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ResourceIcon } from '../ResourceIcon/ResourceIcon'
import { CompetitionsModal } from '../CompetitionsModal/CompetitionsModal'
import { MilestonesModal } from '../MilestonesModal/MilestonesModal'

export const Controls = () => {
	const api = useApi()
	const dispatch = useAppDispatch()
	const player = useAppStore(state => state.game.player)
	const buyingCardIndex = useAppStore(state => state.table.buyingCardIndex)
	const playingCardIndex = useAppStore(state => state.table.playingCardIndex)
	const state = player?.gameState
	const corporation = Corporations.find(c => c.code === state?.corporation)
	const [handOpened, setHandOpened] = useState(false)
	const [cardsOpened, setCardsOpened] = useState(false)
	const [projectsOpened, setProjectsOpened] = useState(false)
	const [competitionsOpened, setCompetitionsOpened] = useState(false)
	const [milestonesOpened, setMilestonesOpened] = useState(false)
	const stackedActions = player?.gameState.cardsToPlay

	const isPlaying = state?.state === PlayerStateValue.Playing

	const faded = state?.placingTile.length !== 0

	const handlePass = () => {
		api.send(playerPass(false))
	}

	const buyTemperature = () => {
		if (player && player.gameState.heat >= 8) {
			api.send(buyStandardProject(StandardProjectType.TemperatureForHeat))
		}
	}

	const buyForest = () => {
		if (player && player.gameState.plants >= 8) {
			api.send(buyStandardProject(StandardProjectType.GreeneryForPlants))
		}
	}

	return state ? (
		<Container faded={faded}>
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
				<StandardProjectModal onClose={() => setProjectsOpened(false)} />
			)}

			{competitionsOpened && (
				<CompetitionsModal onClose={() => setCompetitionsOpened(false)} />
			)}

			{milestonesOpened && (
				<MilestonesModal onClose={() => setMilestonesOpened(false)} />
			)}

			<Flexed>
				<Resources state={state} />

				<CardButtons>
					<Button
						disabled={(player?.gameState.heat || 0) < 8}
						onClick={buyTemperature}
					>
						+<FontAwesomeIcon icon={faThermometerHalf} /> for 8{' '}
						<ResourceIcon res="heat" />
					</Button>
					<Button
						disabled={(player?.gameState.plants || 0) < 8}
						onClick={buyForest}
					>
						Build <FontAwesomeIcon icon={faTree} /> for 8{' '}
						<ResourceIcon res="plants" />
					</Button>
				</CardButtons>
			</Flexed>
			<CardButtons>
				<Button
					icon={faAngleUp}
					disabled={state.cards.length === 0 || faded}
					onClick={() => setHandOpened(true)}
				>
					{state.cards.length} cards in hand
				</Button>
				<Button
					icon={faAngleUp}
					disabled={state.usedCards.length === 0 || faded}
					onClick={() => setCardsOpened(true)}
				>
					{state.usedCards.length} cards played
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

				<PassButton
					disabled={!isPlaying || faded}
					onClick={handlePass}
					icon={faArrowRight}
				>
					Pass
				</PassButton>
			</Flexed>
		</Container>
	) : (
		<></>
	)
}

const Container = styled.div<{ faded: boolean }>`
	display: flex;
	justify-content: space-between;
	background-color: rgba(14, 129, 214, 0.8);
	${props =>
		props.faded &&
		css`
			opacity: 0.7;
		`}
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
