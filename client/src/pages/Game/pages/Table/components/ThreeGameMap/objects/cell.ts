import {
	GridCell,
	GridCellContent,
	GridCellOther,
	PlayerStateValue
} from '@shared/index'
import { Object3D, Vector3, Mesh, MeshStandardMaterial, Vector2 } from 'three'
import { resources } from '../resources'
import { MarsObject } from './mars-object'
import { pendingActions } from '@shared/utils'
import { PlayerActionType } from '@shared/player-actions'
import { canPlace, isClaimable } from '@shared/placements'

const findMesh = (s: Object3D) => {
	let found = undefined as Mesh | undefined

	s.traverse(i => {
		if (i instanceof Mesh) {
			found = i
		}
	})

	return found
}

resources.add('hex', 'models/Hex.glb')
resources.add('hex-hover', 'models/HexHover.glb')
resources.add('hex-available', 'models/HexAvailable.glb')
resources.add('hex-collider', 'models/HexCollider.glb')
resources.add('city', 'models/City.glb')
resources.add('greenery', 'models/Greenery.glb')
resources.add('ocean', 'models/Ocean.glb')
resources.add('other', 'models/Other.glb')
resources.load()

export class Cell {
	container: Object3D
	collider: Object3D

	mars: MarsObject
	cell: GridCell | undefined

	hex: Object3D
	hexHover: Object3D
	hexAvailable: Object3D

	ocean?: MeshStandardMaterial

	hover = false
	available = false

	constructor(mars: MarsObject, cell: GridCell, position: Vector3) {
		this.mars = mars

		this.container = new Object3D()
		this.container.position.copy(position)
		this.container.scale.multiplyScalar(0.052)

		const hexCollider = findMesh(resources.get('hex-collider'))

		if (!hexCollider) {
			throw new Error('No mesh in hex collider!')
		}

		this.collider = hexCollider.clone()
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

		this.container.lookAt(new Vector3())
	}

	tick() {
		this.hexAvailable.visible = this.available

		this.hex.visible =
			(!this.available || !this.hover) &&
			this.cell?.content !== GridCellContent.Ocean

		this.hexHover.visible = this.available && this.hover

		if (this.ocean) {
			this.ocean.map?.offset.add(new Vector2(1 / 60).multiplyScalar(0.01))
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
				const owner = game.players.find(p => p.id === cell.ownerId)
				const color = owner?.color ?? '#ffffff'

				this.hex.traverse(i => {
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
			(!!placing &&
				cell.content === undefined &&
				(cell.claimantId === undefined || cell.claimantId === player.id) &&
				canPlace(game, player, cell, placing)) ||
			(!!claiming && isClaimable(cell))
	}

	private add(o: Object3D) {
		o.rotateX(-Math.PI * 0.5)
		this.container.add(o)
	}

	private setModel(type?: GridCellContent, other?: GridCellOther) {
		this.container.children.forEach(c => {
			if (c.name === 'Model') {
				this.container.remove(c)
			}
		})

		const model = this.getModel(type, other)

		if (model) {
			const newModel = model.clone()
			newModel.name = 'Model'

			console.log(newModel)

			if (type === GridCellContent.Ocean) {
				newModel.traverse(i => {
					if (i instanceof Mesh && i.material instanceof MeshStandardMaterial) {
						this.ocean = i.material.clone()
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
			case GridCellContent.Other:
				return resources.get('other')
		}

		return undefined
	}
}
