import { CardsLookupApi, GameProgress, Resource } from '@shared/cards'
import { resourceProduction } from '@shared/cards/utils'
import { GameState, GameStateValue } from '@shared/index'
import { PlayerActionType } from '@shared/player-actions'
import { groupBy } from '@shared/utils'
import { objDiff } from '@shared/utils/collections'
import { isMarsTerraformed } from '@shared/utils/isMarsTerraformed'
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

			if (colony.active) {
				newEvents.push({
					type: EventType.ColonyActivated,
					colony: +colonyIndex,
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

	if (diff.committee) {
		if (diff.committee.parties) {
			for (const [index, party] of Object.entries(diff.committee.parties)) {
				const prevParty = lastGame.committee.parties[+index]
				const nextParty = game.committee.parties[+index]

				if (!prevParty) {
					continue
				}

				if (party.members) {
					const newMembers = groupBy(
						nextParty.members.map((m) => m.playerId?.id ?? null),
						(m) => m,
					)

					const oldMembers = groupBy(
						prevParty.members.map((m) => m.playerId?.id ?? null),
						(m) => m,
					)

					const oldLeaderId = prevParty.leader?.playerId?.id ?? null
					const newLeaderId = nextParty.leader?.playerId?.id ?? null

					oldMembers.set(oldLeaderId, [
						...(oldMembers.get(oldLeaderId) ?? []),
						oldLeaderId,
					])

					newMembers.set(newLeaderId, [
						...(newMembers.get(newLeaderId) ?? []),
						newLeaderId,
					])

					const changes = new Map<number | null, number>()

					for (const [playerId, members] of newMembers) {
						if (!oldMembers.has(playerId)) {
							changes.set(playerId, members.length)
						} else {
							const prevCount = oldMembers.get(playerId)!.length

							if (prevCount !== members.length) {
								changes.set(playerId, members.length - prevCount)
							}
						}
					}

					for (const [playerId, members] of oldMembers) {
						if (!newMembers.has(playerId)) {
							changes.set(playerId, -members.length)
						}
					}

					game.events.push({
						type: EventType.CommitteePartyDelegateChange,
						partyCode: prevParty.code,
						changes: Array.from(changes).map(([playerId, change]) => ({
							playerId: playerId === null ? null : { id: playerId },
							change,
						})),
					})
				}

				if (party.leader) {
					game.events.push({
						type: EventType.CommitteePartyLeaderChanged,
						partyCode: prevParty.code,
						playerId: party.leader.playerId,
					})
				}
			}
		}

		if (diff.committee.dominantParty) {
			game.events.push({
				type: EventType.CommitteeDominantPartyChanged,
				partyCode: diff.committee.dominantParty,
			})
		}
	}

	return newEvents
}
