import { Object3D } from 'three'
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

const modelLoader = new GLTFLoader()

export const resources = {
	loaded: false,

	items: {} as Record<
		string,
		{
			path: string
			container: Object3D
			loaded: boolean
			loading: boolean
			onResult?: (g: GLTF, container: Object3D) => void
		}
	>,

	add(
		name: string,
		path: string,
		onResult?: (g: GLTF, container: Object3D) => void
	) {
		this.items[name] = {
			container: new Object3D(),
			path,
			loaded: false,
			loading: false,
			onResult
		}
	},

	async load() {
		await Promise.all(
			Object.values(this.items)
				.filter(p => !p.loading && !p.loaded)
				.map(p => ({ ...p, loading: true }))
				.map(p => {
					return new Promise((resolve, reject) => {
						modelLoader.load(
							p.path,
							gltf => {
								p.loaded = true
								p.loading = false

								if (p.onResult) {
									p.onResult(gltf, p.container)
								} else {
									p.container.add(gltf.scene)
								}

								resolve(gltf)
							},
							undefined,
							err => reject(err)
						)
					})
				})
		)

		this.loaded = true

		if (this.onLoad) {
			this.onLoad()
		}
	},

	get(name: string) {
		return this.items[name]?.container
	},

	onLoad: () => {
		return
	}
}
