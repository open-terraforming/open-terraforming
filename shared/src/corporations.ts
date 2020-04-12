import { condition } from './cards/conditions'
import {
	earthCardPriceChange,
	effect,
	exchangeResources,
	getTopCards,
	pickTopCards,
	placeTile,
	productionChange,
	resourceChange,
	titanPriceChange
} from './cards/effects'
import { passiveEffect } from './cards/passive-effects'
import { Card, CardCategory, CardType, CardSpecial } from './cards/types'
import {
	card,
	updatePlayerProduction,
	updatePlayerResource
} from './cards/utils'
import { GridCellContent } from './game'
import { withUnits } from './units'
import { f } from './utils'

const corp = (c: Card, pickingCards = true): Card => {
	if (pickingCards) {
		c.playEffects = [
			effect({ ...pickTopCards(10), description: '' }),
			...c.playEffects
		]
	}
	return c
}

export const Corporations = [
	corp(
		card({
			title: 'Starting Corporation',
			categories: [],
			code: 'starting_corporation',
			cost: 0,
			type: CardType.Corporation,
			playEffects: [resourceChange('money', 45), getTopCards(10)],
			special: [CardSpecial.StartingCorporation]
		})
	),
	corp(
		card({
			title: 'Creditor',
			categories: [],
			code: 'creditor',
			cost: 0,
			type: CardType.Corporation,
			playEffects: [resourceChange('money', 57)],
			passiveEffects: [
				passiveEffect({
					description: f(
						'Effect: When you play a card or a standard project with basic cost of {0} or more, you gain {1}',
						withUnits('money', 20),
						withUnits('money', 4)
					),
					onCardPlayed: (
						{ player },
						playedCard,
						_playedCardIndex,
						playedBy
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
					}
				})
			]
		})
	),
	corp(
		card({
			code: 'ecoline',
			categories: [CardCategory.Plant],
			title: 'ecoline',
			cost: 0,
			type: CardType.Corporation,
			playEffects: [
				resourceChange('money', 36),
				resourceChange('plants', 3),
				productionChange('plants', 2),
				effect({
					description: f('Greenery will only cost {0}', withUnits('plants', 7)),
					perform: ({ player }) => (player.greeneryCost = 7)
				})
			]
		})
	),
	corp(
		card({
			code: 'helion',
			categories: [CardCategory.Space],
			title: 'Helion',
			cost: 0,
			type: CardType.Corporation,
			playEffects: [resourceChange('money', 42), productionChange('heat', 3)],
			actionEffects: [exchangeResources('heat', 'money')]
		})
	),
	corp(
		card({
			code: 'mining_guild',
			categories: [CardCategory.Building, CardCategory.Building],
			title: 'Mining Guild',
			cost: 0,
			type: CardType.Corporation,
			playEffects: [
				resourceChange('money', 30),
				resourceChange('ore', 5),
				productionChange('ore', 1)
			],
			passiveEffects: [
				passiveEffect({
					description:
						'When you receive a tile bonus of ore or titan, increase your ore production',
					onTilePlaced: ({ player }, cell, placedBy) => {
						if (player.id === placedBy.id && (cell.ore > 0 || cell.titan > 0)) {
							updatePlayerProduction(player, 'ore', 1)
						}
					}
				})
			]
		})
	),
	corp(
		card({
			code: 'interplanetary_cinematics',
			categories: [CardCategory.Building],
			title: 'Interplanetary Cinematics',
			cost: 0,
			type: CardType.Corporation,
			playEffects: [resourceChange('money', 30), resourceChange('ore', 20)],
			passiveEffects: [
				passiveEffect({
					description: f(
						'When you play an Event card, you receive {0}',
						withUnits('money', 2)
					),
					onCardPlayed: (
						{ player },
						playedCard,
						_playedCardIndex,
						playedBy
					) => {
						if (
							playedBy.id === player.id &&
							playedCard.categories.includes(CardCategory.Event)
						) {
							updatePlayerResource(player, 'money', 2)
						}
					}
				})
			]
		})
	),
	corp(
		card({
			code: 'phobolog',
			categories: [CardCategory.Science],
			title: 'Phobolog',
			cost: 0,
			type: CardType.Corporation,
			playEffects: [
				resourceChange('money', 23),
				resourceChange('titan', 10),
				titanPriceChange(1)
			]
		})
	),
	corp(
		card({
			code: 'tharsis_republic',
			categories: [CardCategory.Building],
			title: 'Tharsis Republic',
			cost: 0,
			type: CardType.Corporation,
			playEffects: [
				resourceChange('money', 40),
				placeTile({ type: GridCellContent.City })
			],
			passiveEffects: [
				passiveEffect({
					description: f(
						'When any city tile is placed on Mars, increase your money production by 1. When you place a city tile, gain {0}',
						withUnits('money', 3)
					),
					onTilePlaced: ({ player }, cell, placedBy) => {
						if (cell.content === GridCellContent.City) {
							updatePlayerProduction(player, 'money', 1)
							if (player.id === placedBy.id) {
								updatePlayerResource(player, 'money', 3)
							}
						}
					}
				})
			]
		})
	),
	corp(
		card({
			code: 'thorgate',
			categories: [CardCategory.Power],
			title: 'Thorgate',
			cost: 0,
			type: CardType.Corporation,
			playEffects: [
				resourceChange('money', 48),
				productionChange('energy', 1),
				effect({
					description: f(
						'Power cards and Standard Project Power Plant cost {0} less',
						withUnits('money', 3)
					),
					perform: ({ player }) => {
						player.powerPriceChange = -3
						player.powerProjectCost = 11 - 3
					}
				})
			]
		})
	),
	corp(
		card({
			code: 'united_nations_mars_initiative',
			categories: [CardCategory.Earth],
			title: 'United Nations Mars Initiative',
			cost: 0,
			type: CardType.Corporation,
			playEffects: [resourceChange('money', 40)],
			actionEffects: [
				resourceChange('money', -3),
				effect({
					description:
						'If your terraforming rating was increased this generation, you may increase it by 1',
					conditions: [
						condition({
							description: 'TR has to be increased',
							evaluate: ({ player, card }) =>
								card.data === undefined || card.data < player.terraformRating
						})
					],
					perform: ({ player, card }) => {
						player.terraformRating++
						card.played = true
					}
				})
			],
			passiveEffects: [
				passiveEffect({
					description: '',
					onGenerationEnd: ({ card, player }) => {
						card.data = player.terraformRating
					}
				})
			]
		})
	),
	corp(
		card({
			code: 'teractor',
			categories: [CardCategory.Earth],
			title: 'Teractor',
			cost: 0,
			type: CardType.Corporation,
			playEffects: [resourceChange('money', 60), earthCardPriceChange(-3)],
			special: [CardSpecial.AgeOfCorporations]
		})
	),
	corp(
		card({
			code: 'saturn_systems',
			categories: [CardCategory.Earth],
			title: 'Saturn Systems',
			cost: 0,
			type: CardType.Corporation,
			playEffects: [
				resourceChange('money', 42),
				productionChange('titan', 1),
				productionChange('money', 1)
			],
			passiveEffects: [
				passiveEffect({
					description: f(
						'When any card with {0} tag is played, your money production will increase by 1',
						CardCategory[CardCategory.Jupiter]
					),
					onCardPlayed: ({ player }, playedCard) => {
						if (playedCard.categories.includes(CardCategory.Jupiter)) {
							updatePlayerProduction(player, 'money', 1)
						}
					}
				})
			],
			special: [CardSpecial.AgeOfCorporations]
		})
	)
]

export const CorporationsLookup = Corporations.reduce((acc, c) => {
	acc[c.code] = c
	return acc
}, {} as Record<string, Card | undefined>)
