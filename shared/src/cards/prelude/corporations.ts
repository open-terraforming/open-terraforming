import { drawCard, f } from '../../utils'
import { corp } from '../base/corporations'
import {
	pickPreludes,
	productionChange,
	resourceChange,
	deprecatedTagPriceChange,
	emptyEffect,
	lowestProductionChange,
	sponsorCompetitionForFree,
	joinedEffects,
} from '../effectsGrouped'
import { passiveEffect, asFirstAction } from '../passive-effects'
import { CardCategory, CardSpecial, CardType } from '../types'
import { card, withRightArrow, updatePlayerResource } from '../utils'
import { withUnits } from '../../units'

export const preludeCorporations = [
	corp(
		card({
			code: 'cheung_shing_mars',
			cost: 0,
			type: CardType.Corporation,
			categories: [CardCategory.Building],
			special: [CardSpecial.Prelude],
			playEffects: [
				productionChange('money', 3),
				resourceChange('money', 44),
				deprecatedTagPriceChange(CardCategory.Building, -2),
			],
		}),
	),
	corp(
		card({
			code: 'point_luna',
			cost: 0,
			type: CardType.Corporation,
			categories: [CardCategory.Earth, CardCategory.Space],
			special: [CardSpecial.Prelude],
			playEffects: [productionChange('titan', 1), resourceChange('money', 38)],
			passiveEffects: [
				passiveEffect({
					description:
						'When you play an Earth tag, including this, draw a card',
					onCardBought: (
						{ player, game },
						playedCard,
						_cardIndex,
						playedBy,
					) => {
						if (
							playedBy.id === player.id &&
							playedCard.categories.includes(CardCategory.Earth)
						) {
							player.cards.push(drawCard(game))
						}
					},
				}),
			],
		}),
	),
	corp(
		card({
			code: 'robinson_industries',
			cost: 0,
			type: CardType.Corporation,
			categories: [],
			special: [CardSpecial.Prelude],
			playEffects: [resourceChange('money', 47)],
			actionEffects: [
				joinedEffects(
					[
						withRightArrow(resourceChange('money', -4, true)),
						lowestProductionChange(1),
					],
					'to',
				),
			],
		}),
	),
	corp(
		card({
			code: 'valley_trust',
			cost: 0,
			type: CardType.Corporation,
			categories: [CardCategory.Earth],
			special: [CardSpecial.Prelude],
			playEffects: [
				resourceChange('money', 37),
				deprecatedTagPriceChange(CardCategory.Science, -2),
				emptyEffect(
					'As your first action, draw 3 prelude cards, pick 1 and discard the rest',
				),
			],
			passiveEffects: [asFirstAction(pickPreludes(3, 1))],
		}),
	),
	corp(
		card({
			code: 'vitor',
			cost: 0,
			type: CardType.Corporation,
			categories: [CardCategory.Earth],
			special: [CardSpecial.Prelude],
			playEffects: [resourceChange('money', 45), sponsorCompetitionForFree()],
			passiveEffects: [
				passiveEffect({
					description: f(
						'When you play a card with non-negative victory points, gain {0}',
						withUnits('money', 3),
					),
					onCardBought: ({ player }, playedCard, _cardIndex, playedBy) => {
						if (
							playedBy.id === player.id &&
							(playedCard.victoryPoints > 0 || playedCard.victoryPointsCallback)
						) {
							updatePlayerResource(player, 'money', 3)
						}
					},
				}),
			],
		}),
	),
]
