import marsTexture from '@/assets/mars_1k_color.jpg'
import marsNormal from '@/assets/mars_1k_normal.jpg'
import { GameState } from '@shared/index'
import Hexasphere, { Point } from 'hexasphere.js'
import {
	LineBasicMaterial,
	Mesh,
	MeshPhongMaterial,
	Object3D,
	SphereGeometry,
	TextureLoader,
	Vector2,
	Vector3
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const modelLoader = new GLTFLoader()
const hexModel = new Object3D()
const cityModel = new Object3D()
const greeneryModel = new Object3D()

modelLoader.load('models/Hex.glb', glb => {
	glb.scene.traverse(n => {
		if (n instanceof Mesh) {
			const mat = Array.isArray(n.material) ? n.material : [n.material]

			mat.forEach(m => {
				console.log(m)
				m.opacity = 0.5
			})
		}
	})

	hexModel.add(glb.scene)
})

modelLoader.load('models/City.glb', glb => {
	cityModel.add(glb.scene)
})

modelLoader.load('models/Greenery.glb', glb => {
	greeneryModel.add(glb.scene)
})

const loader = new TextureLoader()

const texture = loader.load(marsTexture)
const normal = loader.load(marsNormal)

const latLon = (radius: number, point: Point) => {
	const phi = Math.acos(point.y / radius) //lat

	const theta = Math.atan2(point.x, point.z)

	return {
		lat: (180 * phi) / Math.PI - 90,
		lon: (180 * theta) / Math.PI
	}
}

export class MarsObject {
	container: Object3D

	planet: Mesh

	game: GameState

	cells: { mesh: Object3D; position: Object3D }[][]

	constructor(game: GameState) {
		// TODO: We don't really need hexasphere

		this.game = game

		this.container = new Object3D()
		this.container.name = 'Mars'
		this.container.rotateX(-Math.PI * 0.05)
		this.container.rotateZ(Math.PI / 2)

		const geometry = new SphereGeometry(1, 64, 64)

		const material = new MeshPhongMaterial({
			color: 0xffffff,
			map: texture,
			normalMap: normal,
			shininess: 0.1,
			normalScale: new Vector2(5, 5)
		})

		this.planet = new Mesh(geometry, material)

		this.planet.rotateZ(-Math.PI / 2)

		this.container.add(this.planet)

		const radius = 1.01
		const subDiv = 11

		const hexasphere = new Hexasphere(radius, subDiv, 0.8)

		const hW = game.map.width / 2
		const hH = game.map.height / 2

		this.cells = []

		for (let x = 0; x < game.map.width; x++) {
			for (let y = 0; y < game.map.height; y++) {}
		}

		for (let i = 0; i < hexasphere.tiles.length; i++) {
			const t = hexasphere.tiles[i]

			const p = latLon(radius, t.centerPoint)

			const x = -1 + Math.floor(hW - p.lon / (62 / subDiv))

			const y =
				-1 +
				(p.lat < 0
					? Math.ceil(hH + p.lat / (65 / subDiv))
					: Math.round(hH + p.lat / (65 / subDiv)))

			if (
				x >= 0 &&
				x < game.map.width &&
				y >= 0 &&
				y < game.map.height &&
				game.map.grid[y][x].enabled
			) {
				const mesh = new Object3D()
				mesh.position.set(t.centerPoint.x, t.centerPoint.y, t.centerPoint.z)

				const hex =
					Math.random() < 0.2
						? cityModel.clone()
						: Math.random() < 0.2
						? hexModel.clone()
						: hexModel.clone()

				hex.scale.multiplyScalar(0.052)
				hex.rotateX(-Math.PI * 0.5)

				mesh.add(hex)

				this.container.add(mesh)

				mesh.lookAt(new Vector3())

				if (!this.cells[x]) {
					this.cells[x] = []
				}

				const position = new Object3D()

				position.position.set(t.centerPoint.x, t.centerPoint.y, t.centerPoint.z)

				this.container.add(position)

				this.cells[x][y] = {
					mesh,
					position
				}
			}
		}
	}
}
