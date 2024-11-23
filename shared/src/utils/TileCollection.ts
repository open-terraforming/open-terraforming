import { adjacentCells } from './adjacentCells'
import { GridCell, GridCellContent, GameState } from '..'
import { FilteredCollection } from './FilteredCollection'

export class TileCollection extends FilteredCollection<GridCell> {
	ownedBy(playerId: number) {
		return this.c(
			(c: GridCell) =>
				c.ownerId === playerId && c.content !== GridCellContent.Ocean,
		)
	}

	notOwnedBy(playerId: number) {
		return this.c((c: GridCell) => c.ownerId !== playerId)
	}

	hasContent(content: GridCellContent) {
		return this.c((c: GridCell) => c.content === content)
	}

	hasAnyContent(content: GridCellContent[]) {
		return this.c(
			(c: GridCell) => c.content !== undefined && content.includes(c.content),
		)
	}

	nextTo(game: GameState, content: GridCellContent) {
		return this.c(
			(c) =>
				adjacentCells(game, c.x, c.y).find((c) => c.content === content) !==
				undefined,
		)
	}

	onMars() {
		return this.c((c: GridCell) => !c.outside)
	}

	hasCity = () => this.hasContent(GridCellContent.City)
	hasOcean = () => this.hasContent(GridCellContent.Ocean)
	hasGreenery = () => this.hasContent(GridCellContent.Forest)
	hasOther = () => this.hasContent(GridCellContent.Other)
}
