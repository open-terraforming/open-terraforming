import { CardsLookupApi, CardType, GameProgress, Resource } from '@shared/cards'
import { resourceProduction } from '@shared/cards/utils'
import { GameState, GameStateValue } from '@shared/index'
import { PlayerActionType } from '@shared/player-actions'
import { isMarsTerraformed } from '@shared/utils'
import { objDiff } from '@shared/utils/collections'
import { EventType, GameEvent } from './eventTypes'

const resources: Resource[] = [
	'money',
	'ore',
	'titan',
	'plants',
	'energy',
	'heat',
]

const progress: GameProgress[] = ['oxygen', 'temperature', 'venus']

const EVENTS_ATE_BY_CARD_CHANGES = [
	EventType.CardsReceived,
	EventType.ResourcesChanged,
	EventType.ProductionChanged,
	EventType.CardResourceChanged,
	EventType.GameProgressChanged,
	EventType.RatingChanged,
	EventType.ColonyActivated,
	EventType.PlayerTradeFleetsChange,
	EventType.TileAcquired,
]

const EVENTS_WITH_CHANGES = [
	EventType.CardPlayed,
	EventType.CardUsed,
	EventType.StandardProjectBought,
	EventType.ColonyBuilt,
	EventType.ColonyTrading,
] as const

export const buildEvents = (lastGame: GameState, game: GameState) => {
	const diff = objDiff(lastGame, game) as GameState
	const newEvents = [] as GameEvent[]

	const tiles = diff.map?.grid

	if (tiles) {
		Object.entries(tiles).forEach(([y, row]) => {
			Object.entries(row).forEach(([x, cellChange]) => {
				const currentCell = game.map.grid[+y][+x]

				if (cellChange.content) {
					newEvents.push({
						type: EventType.TilePlaced,
						playerId: cellChange.placedById as number,
						tile: cellChange.content,
						other: cellChange.other,
						cell: { x: currentCell.x, y: currentCell.y },
					})
				}

				if (cellChange.claimantId !== undefined) {
					newEvents.push({
						type: EventType.TileClaimed,
						playerId: cellChange.ownerId as number,
						tile: { x: currentCell.x, y: currentCell.y },
					})
				}
			})
		})
	}

	if (diff.colonies) {
		Object.entries(diff.colonies).forEach(([colonyIndex, colony]) => {
			if (!lastGame.colonies[+colonyIndex]) {
				return
			}

			const oldColony = lastGame.colonies[+colonyIndex]
			const newColony = game.colonies[+colonyIndex]

			if (colony.playersAtSteps) {
				const players = Object.entries(colony.playersAtSteps)

				for (const [, playerId] of players) {
					newEvents.push({
						type: EventType.ColonyBuilt,
						playerId,
						colony: +colonyIndex,
						state: { ...newColony },
						changes: [],
					})
				}
			}

			if (colony.active) {
				newEvents.push({
					type: EventType.ColonyActivated,
					colony: +colonyIndex,
				})
			}

			if (typeof colony.currentlyTradingPlayer === 'number') {
				newEvents.push({
					type: EventType.ColonyTrading,
					playerId: colony.currentlyTradingPlayer,
					colony: +colonyIndex,
					at: oldColony.step,
					state: { ...newColony },
					changes: [],
				})
			}

			if (typeof colony.step === 'number') {
				newEvents.push({
					type: EventType.ColonyTradingStepChanged,
					colony: +colonyIndex,
					change: colony.step - lastGame.colonies[+colonyIndex].step,
				})
			}
		})
	}

	if (diff.standardProjects) {
		Object.entries(diff.standardProjects).forEach(([index, project]) => {
			const oldProject = lastGame.standardProjects[+index]

			if (!oldProject) {
				return
			}

			if (project.usedByPlayerIds) {
				Object.values(project.usedByPlayerIds).forEach((playerId) => {
					newEvents.push({
						type: EventType.StandardProjectBought,
						playerId,
						project: oldProject.type,
						changes: [],
					})
				})
			}
		})
	}

	if (diff.players) {
		Object.entries(diff.players).forEach(([playerIndex, changes]) => {
			const player = lastGame.players[parseInt(playerIndex)]
			const newPlayer = game.players[parseInt(playerIndex)]

			// New player
			if (!player) {
				return
			}

			const playerEvents = [] as GameEvent[]

			const gameChanges = changes

			if (gameChanges) {
				if (gameChanges.usedCards) {
					// First add "card played" event before any other changes
					Object.entries(gameChanges.usedCards).forEach(
						([cardIndex, cardChanges]) => {
							if (!cardChanges) {
								return
							}

							const oldCard = player.usedCards[parseInt(cardIndex)]
							const newCard = newPlayer.usedCards[parseInt(cardIndex)]

							if (!oldCard) {
								if (
									CardsLookupApi.get(cardChanges.code).type !==
										CardType.Corporation &&
									CardsLookupApi.get(cardChanges.code).type !== CardType.Prelude
								) {
									playerEvents.push({
										type: EventType.CardPlayed,
										playerId: player.id,
										card: cardChanges.code,
										changes: [],
									})
								}
							} else {
								const card = CardsLookupApi.get(oldCard.code)

								if (
									cardChanges.played === true &&
									card.type === CardType.Action
								) {
									playerEvents.push({
										type: EventType.CardUsed,
										playerId: player.id,
										card: oldCard.code,
										index: parseInt(cardIndex),
										changes: [],
										state: {
											...newCard,
										},
									})
								}
							}
						},
					)

					// Next add card resource changes
					Object.entries(gameChanges.usedCards).forEach(
						([cardIndex, cardChanges]) => {
							if (!cardChanges) {
								return
							}

							const oldCard = player.usedCards[parseInt(cardIndex)]

							if (oldCard) {
								const card = CardsLookupApi.get(oldCard.code)

								if (card.resource && cardChanges[card.resource] !== undefined) {
									playerEvents.push({
										type: EventType.CardResourceChanged,
										playerId: player.id,
										card: oldCard.code,
										resource: card.resource,
										index: parseInt(cardIndex),
										amount: cardChanges[card.resource] - oldCard[card.resource],
									})
								}
							}
						},
					)
				}

				if (gameChanges.terraformRating) {
					playerEvents.push({
						type: EventType.RatingChanged,
						playerId: player.id,
						amount: gameChanges.terraformRating - player.terraformRating,
					})
				}

				const resourceChanges = resources
					.filter((res) => gameChanges[res] !== undefined)
					.map((res) => [res, gameChanges[res] - player[res]])
					.filter((res) => res[1] !== 0)

				if (resourceChanges.length > 0) {
					playerEvents.push({
						type: EventType.ResourcesChanged,
						playerId: player.id,
						resources: Object.fromEntries(resourceChanges),
					})
				}

				resources.forEach((res) => {
					const prod = resourceProduction[res]

					if (gameChanges[prod] !== undefined) {
						playerEvents.push({
							type: EventType.ProductionChanged,
							playerId: player.id,
							resource: res,
							amount: gameChanges[prod] - player[prod],
						})
					}
				})

				if (gameChanges.corporation) {
					playerEvents.push({
						type: EventType.CorporationPicked,
						playerId: player.id,
						corporation: gameChanges.corporation,
					})
				}

				if (gameChanges.cards) {
					const diff = newPlayer.cards.filter(
						(c) => !player.cards.includes(c),
					).length

					if (diff > 0) {
						playerEvents.push({
							type: EventType.CardsReceived,
							playerId: player.id,
							amount: diff,
						})
					}
				}

				if (gameChanges.tradeFleets) {
					const diff = newPlayer.tradeFleets - player.tradeFleets

					if (diff > 0) {
						playerEvents.push({
							type: EventType.PlayerTradeFleetsChange,
							playerId: player.id,
							amount: diff,
						})
					}
				}

				if (gameChanges.pendingActions) {
					for (const [, action] of Object.entries(gameChanges.pendingActions)) {
						if (!action) {
							continue
						}

						switch (action.type) {
							case PlayerActionType.PlaceTile: {
								playerEvents.push({
									type: EventType.TileAcquired,
									playerId: player.id,
									tile: action.state.type,
									other: action.state.other,
								})

								break
							}
						}
					}
				}

				newEvents.push(...playerEvents)
			}
		})
	}

	if (
		!game.events.some((e) => e.type === EventType.MarsTerraformed) &&
		isMarsTerraformed(game)
	) {
		newEvents.push({
			type: EventType.MarsTerraformed,
		})
	}

	progress.forEach((p) => {
		if (diff[p]) {
			newEvents.push({
				type: EventType.GameProgressChanged,
				progress: p,
				amount: diff[p] - lastGame[p],
			})
		}
	})

	if (diff.competitions) {
		Object.values(diff.competitions).forEach((c) => {
			newEvents.push({
				type: EventType.CompetitionSponsored,
				playerId: c.playerId,
				competition: c.type,
			})
		})
	}

	if (diff.milestones) {
		Object.values(diff.milestones).forEach((c) => {
			newEvents.push({
				type: EventType.MilestoneBought,
				playerId: c.playerId,
				milestone: c.type,
			})
		})
	}

	if (diff.currentPlayer !== undefined) {
		newEvents.push({
			type: EventType.PlayingChanged,
			playing: diff.currentPlayer,
		})
	}

	if (diff.generation !== undefined) {
		newEvents.push({
			type: EventType.NewGeneration,
			generation: diff.generation,
		})
	}

	if (diff.state === GameStateValue.GenerationEnding) {
		newEvents.push({
			type: EventType.ProductionPhase,
		})
	}

	const changes = newEvents.filter((e) =>
		EVENTS_ATE_BY_CARD_CHANGES.includes(e.type),
	)

	for (const eventTypeWithChanges of EVENTS_WITH_CHANGES) {
		const eventWithChanges = newEvents.find(
			(e) => e.type === eventTypeWithChanges,
		)

		if (eventWithChanges && 'changes' in eventWithChanges) {
			eventWithChanges.changes = changes
		}
	}

	return newEvents
}
