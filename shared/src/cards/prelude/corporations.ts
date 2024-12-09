import { withUnits } from '../../units'
import { drawCard } from '@shared/utils/drawCard'
import { f } from '@shared/utils/f'
import { corp } from '../base/corporations'
import {
	emptyEffect,
	joinedEffects,
	lowestProductionChange,
	pickPreludes,
	productionChange,
	resourceChange,
	sponsorCompetitionForFree,
} from '../effectsGrouped'
import { asFirstAction, passiveEffect } from '../passive-effects'
import { tagPriceChange } from '../passive-effects/tagPriceChange'
import { CardCategory, CardSpecial, CardType, SymbolType } from '../types'
import { card, updatePlayerResource, withRightArrow } from '../utils'

export const preludeCorporations = [
	corp(
		card({
			code: 'cheung_shing_mars',
			cost: 0,
			type: CardType.Corporation,
			categories: [CardCategory.Building],
			special: [CardSpecial.Prelude],
			playEffects: [productionChange('money', 3), resourceChange('money', 44)],
			passiveEffects: [tagPriceChange(CardCategory.Building, -2)],
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
					symbols: [
						{ tag: CardCategory.Earth },
						{ symbol: SymbolType.Colon },
						{ symbol: SymbolType.Card },
					],
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
				emptyEffect(
					'As your first action, draw 3 prelude cards, pick 1 and discard the rest',
				),
			],
			passiveEffects: [
				asFirstAction(pickPreludes(3, 1)),
				tagPriceChange(CardCategory.Science, -2),
			],
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
