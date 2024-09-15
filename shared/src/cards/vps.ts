import { GridCellContent } from '../game'
import { CardResource, CardVictoryPointsCallback, CardCategory } from './types'
import { CardsLookupApi } from './lookup'
import { allCells, adjacentCells } from '../utils'
import { countGridContent } from './utils'
import { getColoniesCount } from '@shared/expansions/colonies/utils/getColoniesCount'

export const vpCb = (cb: CardVictoryPointsCallback) => cb

export const minCardResourceToVP = (
	res: CardResource,
	amount: number,
	vps: number,
) =>
	vpCb({
		description: `${vps} VPs if you have at least ${amount} of ${res} resources here`,
		compute: ({ card }) => {
			return card[res] >= amount ? vps : 0
		},
	})

export const vpsForAdjacentTiles = (type: GridCellContent, perTile: number) =>
	vpCb({
		description: `${perTile} VPs for each adjacent ${GridCellContent[type]} tile`,
		compute: ({ game, player, card }) => {
			const tile = allCells(game).find(
				(c) => c.ownerId === player.id && c.ownerCard === card.index,
			)

			if (!tile) {
				return 0
			}

			return Math.floor(
				adjacentCells(game, tile.x, tile.y).filter((c) => c.content === type)
					.length * perTile,
			)
		},
	})

export const vpsForCards = (category: CardCategory, vpPerCategory: number) =>
	vpCb({
		description: `${vpPerCategory} VP for each ${CardCategory[category]} tag you have`,
		compute: ({ player }) => {
			return Math.floor(
				player.usedCards
					.map((c) => CardsLookupApi.get(c.code))
					.reduce(
						(acc, c) =>
							acc + c.categories.filter((cat) => cat === category).length,
						0,
					) * vpPerCategory,
			)
		},
	})

export const vpsForCardResources = (res: CardResource, vpPerUnit: number) =>
	vpCb({
		description: `${vpPerUnit >= 1 ? vpPerUnit : 1} VP per ${
			vpPerUnit >= 1 ? 1 : Math.ceil(1 / vpPerUnit)
		} ${res} on this card`,
		compute: ({ card }) => {
			return Math.floor(card[res] * vpPerUnit)
		},
	})

export const vpsForTiles = (type: GridCellContent, perTile: number) =>
	vpCb({
		description:
			perTile >= 1
				? `${perTile} VPs for each ${GridCellContent[type]} tile in game`
				: `1 VPs for every ${Math.ceil(1 / perTile)} ${
						GridCellContent[type]
					} tiles in game`,
		compute: ({ game }) => {
			return Math.floor(countGridContent(game, type) * perTile)
		},
	})

export const vpsForColoniesInPlay = (vpPerColony: number) =>
	vpCb({
		description:
			vpPerColony >= 1
				? `${vpPerColony} VPs for each colony in play`
				: `1 VPs for every ${Math.ceil(1 / vpPerColony)} colony tiles in play`,
		compute: ({ game }) => {
			const colonies = getColoniesCount({ game })

			return Math.floor(colonies * vpPerColony)
		},
	})
