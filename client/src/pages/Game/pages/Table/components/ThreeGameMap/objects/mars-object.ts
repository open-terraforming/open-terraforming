import { MyEvent } from '@/utils/events'
import { GameState, PlayerState } from '@shared/index'
import {
	Camera,
	Object3D,
	PointLight,
	Raycaster,
	SpotLight,
	Vector3,
} from 'three'
import { findMesh, resources } from '../resources'
import { Cell } from './cell'

const raycaster = new Raycaster()

export class MarsObject {
	container: Object3D

	cellsContainer: Object3D

	game: GameState
	player: PlayerState

	radius: number

	cells: Cell[][] = []
	colliders: Object3D[] = []

	cameraObject = new Object3D()

	onLoad = new MyEvent(true)

	constructor(game: GameState, player: PlayerState) {
		this.game = game
		this.player = player

		this.radius = 1

		this.container = new Object3D()
		this.container.name = 'Mars'

		this.cellsContainer = new Object3D()
		this.cellsContainer.name = 'Cells'

		this.container.add(this.cellsContainer)

		if (!resources.loaded) {
			resources.onLoad = () => {
				this.initialize()
			}

			return
		}

		this.initialize()
	}

	initialize() {
		const scene = resources.get('mars-4k').clone()
		const camera = findMesh(scene, (i) => i.name === 'Camera')

		scene.traverse((i) => {
			if (i instanceof PointLight || i instanceof SpotLight) {
				i.intensity /= 20
			}
		})

		if (!camera) {
			throw new Error('Failed to locate camera in scene object')
		}

		this.cameraObject = camera

		this.container.add(scene)

		this.buildHex()
		this.update(this.game, this.player)
		this.onLoad.emit()
	}

	buildHex() {
		const game = this.game

		const hW = (game.map.width - 1) / 2
		const hH = (game.map.height - 1) / 2

		this.cells = []

		while (this.cellsContainer.children.length > 0) {
			this.cellsContainer.remove(this.cellsContainer.children[0])
		}

		const inc = Math.PI / 30

		for (let x = 0; x < game.map.width; x++) {
			for (let y = 0; y < game.map.height; y++) {
				if (game.map.grid[x][y].enabled) {
					const pitch = hH * inc * 0.9 - y * inc * 0.9
					const yaw = -hW * inc + x * inc + ((y % 2) * inc) / 2

					const position = new Vector3(
						Math.sin(yaw) * Math.cos(pitch),
						Math.sin(pitch),
						Math.cos(yaw) * Math.cos(pitch),
					).multiplyScalar(this.radius)

					if (!this.cells[x]) {
						this.cells[x] = []
					}

					this.cells[x][y] = new Cell(this, game.map.grid[x][y], position)

					this.colliders.push(this.cells[x][y].collider)
					this.cellsContainer.add(this.cells[x][y].container)
				}
			}
		}
	}

	tick(camera: Camera, mouse: { x: number; y: number }) {
		raycaster.setFromCamera(mouse, camera)

		const intersects = raycaster.intersectObjects(this.colliders)

		Object.values(this.cells).forEach((v) => {
			if (v) {
				Object.values(v).forEach((v) => {
					if (v) {
						v.hover = !!intersects.find((i) => i.object === v.collider)

						v.tick()
					}
				})
			}
		})
	}

	update(game: GameState, player: PlayerState) {
		this.game = game
		this.player = player

		Object.values(this.cells).forEach((v) => {
			if (v) {
				Object.values(v).forEach((v) => {
					if (v && v.cell) {
						v.update(game.map.grid[v.cell.x][v.cell.y])
					}
				})
			}
		})
	}
}
