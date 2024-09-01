import {
	GridCell,
	GridCellContent,
	GridCellOther,
	PlayerStateValue,
} from '@shared/index'
import { canPlace, isClaimable } from '@shared/placements'
import { PlayerActionType } from '@shared/player-actions'
import { specialToStr } from '@shared/texts'
import { pendingActions, range } from '@shared/utils'
import {
	Mesh,
	MeshBasicMaterial,
	MeshStandardMaterial,
	Object3D,
	PlaneBufferGeometry,
	Vector2,
	Vector3,
} from 'three'
import { resources } from '../resources'
import { MarsObject } from './mars-object'
import { makeLabelTexture } from './utils'

export class Cell {
	container: Object3D
	collider: Object3D
	resources: Object3D

	mars: MarsObject
	cell: GridCell | undefined

	hex: Object3D
	hexHover: Object3D
	hexAvailable: Object3D

	ocean?: MeshStandardMaterial

	hover = false
	available = false

	size = 2 * 0.052

	constructor(mars: MarsObject, cell: GridCell, position: Vector3) {
		this.cell = cell
		this.mars = mars

		this.container = new Object3D()
		this.container.position.copy(position)
		this.container.scale.multiplyScalar(this.size / 2)
		this.container.lookAt(new Vector3())

		this.collider = resources.get('hex-collider').clone()
		this.collider.rotateX(-Math.PI * 0.5)
		this.collider.visible = false

		this.container.add(this.collider)

		this.setModel(cell.content, cell.other)

		this.hex = resources.get('hex').clone()
		this.hexHover = resources.get('hex-hover').clone()
		this.hexAvailable = resources.get('hex-available').clone()

		this.add(this.hex)
		this.add(this.hexHover)
		this.add(this.hexAvailable)

		this.resources = new Object3D()

		const total = cell.cards + cell.plants + cell.ore + cell.titan
		let totalCards = cell.cards
		let totalPlants = cell.plants
		let totalOre = cell.ore
		let totalTitan = cell.titan

		range(0, total).forEach((i) => {
			const rx = ((total - 1) / 2 - i) * 0.45

			const res =
				totalPlants-- > 0
					? 'plant'
					: totalOre-- > 0
						? 'ore'
						: totalTitan-- > 0
							? 'titan'
							: totalCards--
								? 'card'
								: null

			if (res) {
				const mesh = resources.get(res).clone()
				mesh.position.set(rx, cell.special ? 0.5 : 0, 0)
				mesh.rotateX(-Math.PI * 0.5)

				this.resources.add(mesh)
			}
		})

		if (cell.special) {
			const labelTexture = makeLabelTexture(
				250,
				'Oswald',
				60,
				specialToStr(cell.special),
			)

			const labelMaterial = new MeshBasicMaterial({
				map: labelTexture,
				transparent: true,
			})

			const label = new Mesh(new PlaneBufferGeometry(1, 1), labelMaterial)
			label.rotateY(Math.PI)
			label.scale.set(1.6, 0.5, 1)

			this.resources.add(label)
		}

		this.container.add(this.resources)
	}

	tick() {
		this.resources.visible = !this.cell?.content

		this.hexAvailable.visible = this.available

		this.hex.visible =
			(!this.available || !this.hover) &&
			this.cell?.content !== GridCellContent.Ocean

		this.hexHover.visible = this.available && this.hover

		if (this.ocean) {
			this.ocean.map?.offset.add(
				new Vector2(1, 1).normalize().multiplyScalar((1 / 60) * 0.01),
			)
		}
	}

	update(cell: GridCell) {
		const game = this.mars.game
		const player = this.mars.player

		if (!this.cell || cell.content !== this.cell.content) {
			this.setModel(cell.content, cell.other)
		}

		if (!this.cell || cell.ownerId !== this.cell.ownerId) {
			if (
				cell.ownerId !== undefined &&
				cell.content !== GridCellContent.Ocean
			) {
				const owner = game.players.find((p) => p.id === cell.ownerId)
				const color = owner?.color ?? '#ffffff'

				this.hex.traverse((i) => {
					if (
						i instanceof Mesh &&
						!Array.isArray(i.material) &&
						i.material instanceof MeshStandardMaterial
					) {
						i.material = i.material.clone()
						// eslint-disable-next-line padding-line-between-statements
						;(i.material as MeshStandardMaterial).color.setStyle(color)
					}
				})
			}
		}

		this.cell = cell

		const isPlaying =
			player.state === PlayerStateValue.Playing ||
			player.state === PlayerStateValue.EndingTiles

		const pending = pendingActions(player)[0]

		const placing =
			isPlaying && pending && pending.type === PlayerActionType.PlaceTile
				? pending.state
				: undefined

		const claiming = !!(
			isPlaying &&
			pending &&
			pending.type === PlayerActionType.ClaimTile
		)

		this.available =
			(!!placing && canPlace(game, player, cell, placing)) ||
			(!!claiming && isClaimable(cell))
	}

	private add(o: Object3D) {
		o.rotateX(-Math.PI * 0.5)
		this.container.add(o)
	}

	private setModel(type?: GridCellContent, other?: GridCellOther) {
		this.container.children.forEach((c) => {
			if (c.name === 'Model') {
				this.container.remove(c)
			}
		})

		const model = this.getModel(type, other)

		if (model) {
			const newModel = model.clone()
			newModel.name = 'Model'

			if (type === GridCellContent.Ocean) {
				newModel.traverse((i) => {
					if (i instanceof Mesh && i.material instanceof MeshStandardMaterial) {
						this.ocean = i.material.clone()
						i.material.opacity = 0.5
						i.material = this.ocean
					}
				})
			} else {
				newModel.rotateZ((Math.PI / 2) * Math.round(Math.random() * 3))
			}

			newModel.rotateX(-Math.PI * 0.5)

			this.container.add(newModel)
		}
	}

	private getModel(type?: GridCellContent, other?: GridCellOther) {
		switch (type) {
			case GridCellContent.City:
				return resources.get('city')
			case GridCellContent.Forest:
				return resources.get('greenery')
			case GridCellContent.Ocean:
				return resources.get('ocean')

			case GridCellContent.Other: {
				switch (other) {
					case GridCellOther.Volcano:
						return resources.get('volcano')
				}

				return resources.get('other')
			}
		}

		return undefined
	}
}
