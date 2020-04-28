import marsTexture from '@/assets/mars_4k_color.jpg'
import marsNormal from '@/assets/mars_4k_normal.jpg'
import { GameState, PlayerState } from '@shared/index'
import {
	Camera,
	Mesh,
	MeshPhongMaterial,
	Object3D,
	Raycaster,
	SphereGeometry,
	TextureLoader,
	Vector2,
	Vector3
} from 'three'
import { Cell, resources } from './cell'

const loader = new TextureLoader()

const texture = loader.load(marsTexture)
const normal = loader.load(marsNormal)

const raycaster = new Raycaster()

export class MarsObject {
	container: Object3D

	cellsContainer: Object3D

	planet: Mesh

	game: GameState
	player: PlayerState

	radius: number

	cells: Cell[][] = []
	colliders: Object3D[] = []

	constructor(game: GameState, player: PlayerState) {
		this.game = game
		this.player = player

		this.radius = 1

		this.container = new Object3D()
		this.container.name = 'Mars'

		this.cellsContainer = new Object3D()
		this.cellsContainer.name = 'Cells'

		this.container.add(this.cellsContainer)

		const geometry = new SphereGeometry(this.radius, 64, 64)

		const material = new MeshPhongMaterial({
			color: 0xffffff,
			map: texture,
			normalMap: normal,
			shininess: 0.1,
			normalScale: new Vector2(5, 5)
		})

		this.planet = new Mesh(geometry, material)

		// this.planet.rotateZ(-Math.PI / 2)

		this.container.add(this.planet)

		this.buildHex()
	}

	buildHex() {
		if (!resources.loaded) {
			resources.onLoad = () => {
				this.buildHex()
				this.update(this.game, this.player)
			}

			return
		}

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
						Math.cos(yaw) * Math.cos(pitch)
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

		Object.values(this.cells).forEach(v => {
			if (v) {
				Object.values(v).forEach(v => {
					if (v) {
						v.hover = !!intersects.find(i => i.object === v.collider)

						v.tick()
					}
				})
			}
		})
	}

	update(game: GameState, player: PlayerState) {
		this.game = game
		this.player = player

		Object.values(this.cells).forEach((v, x) => {
			if (v) {
				Object.values(v).forEach((v, y) => {
					if (v) {
						v.update(game.map.grid[x][y])
					}
				})
			}
		})
	}
}
