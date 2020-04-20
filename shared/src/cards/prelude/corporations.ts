import { drawCard } from '../../utils'
import { corp } from '../base/corporations'
import {
	pickPreludes,
	productionChange,
	resourceChange,
	tagPriceChange
} from '../effects'
import { passiveEffect, asFirstAction } from '../passive-effects'
import { CardCategory, CardSpecial, CardType } from '../types'
import { card } from '../utils'

export const preludeCorporations = [
	corp(
		card({
			code: 'cheung_shing_mars',
			title: 'Cheung Shing MARS',
			cost: 0,
			type: CardType.Corporation,
			categories: [CardCategory.Building],
			special: [CardSpecial.Prelude],
			playEffects: [
				productionChange('money', 3),
				resourceChange('money', 44),
				tagPriceChange(CardCategory.Building, -2)
			]
		})
	),
	corp(
		card({
			code: 'point_luna',
			title: 'Point Luna',
			cost: 0,
			type: CardType.Corporation,
			categories: [CardCategory.Earth, CardCategory.Space],
			special: [CardSpecial.Prelude],
			playEffects: [productionChange('titan', 1), resourceChange('money', 38)],
			passiveEffects: [
				passiveEffect({
					description:
						'When you play an Earth tag, including this, draw a card',
					onCardPlayed: (
						{ player, game },
						playedCard,
						_cardIndex,
						playedBy
					) => {
						if (
							playedBy.id === player.id &&
							playedCard.categories.includes(CardCategory.Earth)
						) {
							player.cards.push(drawCard(game))
						}
					}
				})
			]
		})
	),
	/*
	TODO:
	corp(
		card({
			code: 'robinson_industries',
			title: 'Robinson Industries',
			cost: 0,
			type: CardType.Corporation,
			categories: [],
			special: [CardSpecial.Prelude],
			playEffects: [
				resourceChange('money', 47)
			],
			actionEffects: [
				resourceChange('money', -4),
				lowestProductionChange(1)
			]
		})
	)
	*/
	corp(
		card({
			code: 'valley_trust',
			title: 'Valley Trust',
			cost: 0,
			type: CardType.Corporation,
			categories: [CardCategory.Earth],
			special: [CardSpecial.Prelude],
			playEffects: [
				resourceChange('money', 37),
				tagPriceChange(CardCategory.Science, -2)
			],
			passiveEffects: [asFirstAction(pickPreludes(3, 1))]
		})
	)
	/*
	TODO:
	corp(
		card({
			code: 'vitor',
			title: 'Vitor',
			cost: 0,
			type: CardType.Corporation,
			categories: [CardCategory.Earth],
			special: [CardSpecial.Prelude],
			playEffects: [resourceChange('money', 45), pickAward()],
			passiveEffects: [
				passiveEffect({
					description: f(
						'When you play a card with non-negative victory points, gain {0}',
						withUnits('money', 3)
					),
					onCardPlayed: ({ player }, playedCard, _cardIndex, playedBy) => {
						if (
							playedBy.id === player.id &&
							(playedCard.victoryPoints > 0 || playedCard.victoryPointsCallback)
						) {
							updatePlayerResource(player, 'money', 3)
						}
					}
				})
			]
		})
	)
	*/
]
