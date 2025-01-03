import { GridCellContent } from '../../gameState'
import { PlayerActionType } from '../../player-actions'
import { withUnits } from '../../units'
import { f } from '@shared/utils/f'
import { condition } from '../conditions'
import { effect } from '../effects/types'
import {
	emptyEffect,
	exchangeResources,
	getTopCards,
	placeCity,
	productionChange,
	resourceChange,
} from '../effectsGrouped'
import {
	asFirstAction,
	passiveEffect,
	titanPriceChange,
} from '../passive-effects'
import { tagPriceChange } from '../passive-effects/tagPriceChange'
import { Card, CardCategory, CardSpecial, CardType, SymbolType } from '../types'
import {
	card,
	updatePlayerProduction,
	updatePlayerResource,
	withRightArrow,
} from '../utils'

export const corp = (c: Card): Card => {
	return c
}

export const baseCorporations = [
	corp(
		card({
			categories: [],
			code: 'starting_corporation',
			cost: 0,
			type: CardType.Corporation,
			playEffects: [
				resourceChange('money', 45),
				getTopCards(10),
				effect({
					description: "You don't pick cards at the beginning",
					perform: ({ player }) => {
						player.pendingActions = player.pendingActions.filter(
							(a) => a.type !== PlayerActionType.PickCards,
						)
					},
				}),
			],
			special: [CardSpecial.StartingCorporation],
		}),
	),
	corp(
		card({
			categories: [],
			code: 'creditor',
			cost: 0,
			type: CardType.Corporation,
			playEffects: [resourceChange('money', 57)],
			passiveEffects: [
				passiveEffect({
					description: f(
						'When you play a card or a standard project with basic cost of {0} or more, you gain {1}',
						withUnits('money', 20),
						withUnits('money', 4),
					),
					onCardBought: (
						{ player },
						playedCard,
						_playedCardIndex,
						playedBy,
					) => {
						if (playedBy.id === player.id && playedCard.cost >= 20) {
							updatePlayerResource(player, 'money', 4)
						}
					},
					onStandardProject: ({ player, game }, project, playedBy) => {
						if (
							playedBy.id === player.id &&
							project.cost({ player, game }) >= 20
						) {
							updatePlayerResource(player, 'money', 4)
						}
					},
				}),
			],
		}),
	),
	corp(
		card({
			code: 'ecoline',
			categories: [CardCategory.Plant],
			cost: 0,
			type: CardType.Corporation,
			playEffects: [
				resourceChange('money', 36),
				resourceChange('plants', 3),
				productionChange('plants', 2),
			],
			passiveEffects: [
				passiveEffect({
					description: f('Greenery costs {0}', withUnits('plants', 7)),
					onPlay: ({ player }) => (player.greeneryCost = 7),
				}),
			],
		}),
	),
	corp(
		card({
			code: 'helion',
			categories: [CardCategory.Space],
			cost: 0,
			type: CardType.Corporation,
			playEffects: [resourceChange('money', 42), productionChange('heat', 3)],
			actionEffects: [exchangeResources('heat', 'money')],
		}),
	),
	corp(
		card({
			code: 'mining_guild',
			categories: [CardCategory.Building, CardCategory.Building],
			cost: 0,
			type: CardType.Corporation,
			playEffects: [
				resourceChange('money', 30),
				resourceChange('ore', 5),
				productionChange('ore', 1),
			],
			passiveEffects: [
				passiveEffect({
					description:
						'When you receive a tile bonus of ore or titan, increase your ore production',
					onTilePlaced: ({ player }, cell, placedBy) => {
						if (player.id === placedBy.id && (cell.ore > 0 || cell.titan > 0)) {
							updatePlayerProduction(player, 'ore', 1)
						}
					},
				}),
			],
		}),
	),
	corp(
		card({
			code: 'interplanetary_cinematics',
			categories: [CardCategory.Building],
			cost: 0,
			type: CardType.Corporation,
			playEffects: [resourceChange('money', 30), resourceChange('ore', 20)],
			passiveEffects: [
				passiveEffect({
					description: f(
						'When you play an Event card, you receive {0}',
						withUnits('money', 2),
					),
					symbols: [
						{ tag: CardCategory.Event, count: 1 },
						{ symbol: SymbolType.Colon },
						{ resource: 'money', count: 2 },
					],
					onCardBought: (
						{ player },
						playedCard,
						_playedCardIndex,
						playedBy,
					) => {
						if (
							playedBy.id === player.id &&
							playedCard.categories.includes(CardCategory.Event)
						) {
							updatePlayerResource(player, 'money', 2)
						}
					},
				}),
			],
		}),
	),
	corp(
		card({
			code: 'phobolog',
			categories: [CardCategory.Science],
			cost: 0,
			type: CardType.Corporation,
			playEffects: [resourceChange('money', 23), resourceChange('titan', 10)],
			passiveEffects: [titanPriceChange(1)],
		}),
	),
	corp(
		card({
			code: 'tharsis_republic',
			categories: [CardCategory.Building],
			cost: 0,
			type: CardType.Corporation,
			playEffects: [
				resourceChange('money', 40),
				emptyEffect('As your first action, place a City', [
					{ tile: GridCellContent.City },
				]),
			],
			passiveEffects: [
				asFirstAction(placeCity()),
				passiveEffect({
					symbols: [
						{ tile: GridCellContent.City, other: true },
						{ symbol: SymbolType.Colon },
						{ resource: 'money', count: 1, production: true },
						{ tile: GridCellContent.City },
						{ symbol: SymbolType.Colon },
						{ resource: 'money', count: 3 },
					],
					description: f(
						'When any city tile is placed on Mars, increase your money production by 1. When you place a city tile, gain {0}',
						withUnits('money', 3),
					),
					onTilePlaced: ({ player }, cell, placedBy) => {
						if (cell.content === GridCellContent.City) {
							if (!cell.outside) {
								updatePlayerProduction(player, 'money', 1)
							}

							if (player.id === placedBy.id) {
								updatePlayerResource(player, 'money', 3)
							}
						}
					},
				}),
			],
		}),
	),
	corp(
		card({
			code: 'thorgate',
			categories: [CardCategory.Power],
			cost: 0,
			type: CardType.Corporation,
			playEffects: [resourceChange('money', 48), productionChange('energy', 1)],
			passiveEffects: [
				passiveEffect({
					description: f(
						'Power cards and Standard Project Power Plant cost {0} less',
						withUnits('money', 3),
					),
					onPlay: ({ player, card }) => {
						player.tagPriceChanges.push({
							tag: CardCategory.Power,
							change: -3,
							sourceCardIndex: card.index,
						})

						player.powerProjectCost = 11 - 3
					},
				}),
			],
		}),
	),
	corp(
		card({
			code: 'united_nations_mars_initiative',
			categories: [CardCategory.Earth],
			cost: 0,
			type: CardType.Corporation,
			playEffects: [resourceChange('money', 40)],
			actionEffects: [
				withRightArrow(resourceChange('money', -3)),
				effect({
					description:
						'If your terraforming rating was increased this generation, you may increase it by 1',
					conditions: [
						condition({
							description: 'TR has to be increased',
							evaluate: ({ player, card }) =>
								(card.data ?? 20) < player.terraformRating,
						}),
					],
					symbols: [{ symbol: SymbolType.TerraformingRating, count: 1 }],
					perform: ({ player, card }) => {
						player.terraformRating++
						card.played = true
					},
				}),
			],
			passiveEffects: [
				passiveEffect({
					description: '',
					onGenerationStarted: ({ card, player }) => {
						card.data = player.terraformRating
					},
				}),
			],
		}),
	),
	corp(
		card({
			code: 'teractor',
			categories: [CardCategory.Earth],
			cost: 0,
			type: CardType.Corporation,
			playEffects: [resourceChange('money', 60)],
			passiveEffects: [tagPriceChange(CardCategory.Earth, -2)],
			special: [CardSpecial.CorporationsEra],
		}),
	),
	corp(
		card({
			code: 'saturn_systems',
			categories: [CardCategory.Earth],
			cost: 0,
			type: CardType.Corporation,
			playEffects: [
				resourceChange('money', 42),
				productionChange('titan', 1),
				productionChange('money', 1),
			],
			passiveEffects: [
				passiveEffect({
					description: f(
						'When any card with {0} tag is played, your money production will increase by 1',
						CardCategory[CardCategory.Jupiter],
					),
					symbols: [
						{ tag: CardCategory.Jupiter },
						{ symbol: SymbolType.Colon },
						{ resource: 'money', production: true },
					],
					onCardBought: ({ player }, playedCard) => {
						if (playedCard.categories.includes(CardCategory.Jupiter)) {
							updatePlayerProduction(player, 'money', 1)
						}
					},
				}),
			],
			special: [CardSpecial.CorporationsEra],
		}),
	),
]
