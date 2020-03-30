import { CardResource, CardCategory, CardEffectTarget, Resource } from './types'
import {
	effect,
	resourceCondition,
	effectArg,
	cellTypeCondition,
	countGridContent,
	condition,
	placeTile,
	drawnCards,
} from './utils'
import { CardsLookupApi } from '.'
import { PlayerStateValue, GridCellContent } from '../game'
import { withUnits } from '../units'

export const convertTopCardToCardResource = (
	category: CardCategory,
	res: CardResource,
	amount: number
) =>
	effect({
		args: [drawnCards(1)],
		conditions: [resourceCondition('money', 1)],
		description: `Spend 1 $ to reveal top card of the draw deck. If the card has ${category} tag, add ${amount} ${res} resource here`,
		perform: ({ player, card }, drawnCards: string[]) => {
			const drawn = CardsLookupApi.get(drawnCards[0])

			player.money -= 1

			if (drawn.categories.includes(category)) {
				card[res] += amount
			}
		},
	})

export const pickTopCards = (count: number) =>
	effect({
		args: [drawnCards(count)],
		description: `Look at top ${count} cards and either buy them or discard them`,
		perform: ({ player }, drawnCards: string[]) => {
			player.cardsPick = drawnCards
			player.state = PlayerStateValue.PickingCards
		},
	})

export const getTopCards = (count: number) =>
	effect({
		args: [drawnCards(count)],
		description: `Draw ${count} card(s)`,
		perform: ({ player }, drawnCards: string[]) => {
			player.cards.push(...drawnCards)
		},
	})

export const resourceForCities = (
	costRes: Resource,
	cost: number,
	res: Resource,
	resPerCity: number
) =>
	effect({
		conditions: [
			resourceCondition('energy', 1),
			cellTypeCondition(
				GridCellContent.City,
				resPerCity > 1 ? 1 : Math.ceil(1 / resPerCity)
			),
		],
		description: `Spend ${withUnits(costRes, cost)} to gain ${
			resPerCity > 1
				? `${withUnits(res, resPerCity)} for each city on Mars`
				: `${withUnits(res, 1)} per ${Math.ceil(1 / resPerCity)} cities on Mars`
		}`,
		perform: ({ player, game }) => {
			player.money += Math.floor(
				countGridContent(game, GridCellContent.City) * resPerCity
			)
		},
	})

export const moneyOrTitanForOcean = (cost: number) =>
	effect({
		args: [
			effectArg({
				type: CardEffectTarget.Resource,
				resource: 'titan',
				description: 'Used titan to pay ',
			}),
		],
		conditions: [
			condition({
				evaluate: ({ player }) =>
					player.money + player.titan * player.titanPrice >= cost,
			}),
		],
		description: `Pay ${withUnits(
			'money',
			cost
		)} to place an ocean tile, titan can also be used`,
		perform: (ctx, titan: number) => {
			if (titan > ctx.player.titanPrice) {
				throw new Error(`You don't have that much titanium`)
			}

			const usedTitan = Math.min(Math.ceil(cost / ctx.player.titanPrice), titan)

			placeTile(GridCellContent.Ocean).perform(ctx)

			ctx.player.titan -= usedTitan
			ctx.player.money -= Math.max(0, cost - usedTitan * ctx.player.titanPrice)
		},
	})
