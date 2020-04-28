import { Mesh, Object3D } from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const modelLoader = new GLTFLoader()

type ResultCallback<T = Object3D> = (g: GLTF, ctx: { path: string }) => T

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LoaderItem<T = any> = {
	path: string
	container: T
	loaded: boolean
	loading: boolean
	onResult?: ResultCallback<T>
}

export class ResourcesLoader<Items extends Record<string, LoaderItem> = {}> {
	loaded = false

	items = {} as Items

	add<Name extends string, Target = Object3D>(
		name: Name,
		path: string,
		onResult?: ResultCallback<Target>
	): ResourcesLoader<Items & { [key in Name]: LoaderItem<Target> }> {
		// eslint-disable-next-line padding-line-between-statements
		;(this.items as Record<string, LoaderItem>)[name] = {
			container: new Object3D(),
			path,
			loaded: false,
			loading: false,
			onResult
		}

		return this
	}

	async load() {
		await Promise.all(
			Object.values(this.items)
				.filter(p => !p.loading && !p.loaded)
				.map(p => {
					p.loading = true

					return p
				})
				.map(p => {
					return new Promise((resolve, reject) => {
						modelLoader.load(
							p.path,
							gltf => {
								p.loaded = true
								p.loading = false

								if (p.onResult) {
									p.container = p.onResult(gltf, p)
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
	}

	get<Name extends keyof Items>(name: Name): Items[Name]['container'] {
		return this.items[name].container
	}

	onLoad = () => {
		return
	}
}

export const extractMesh = (): ResultCallback<Mesh> => (g, { path }) => {
	const mesh = findMesh(g.scene, i => i instanceof Mesh)

	if (!mesh) {
		throw new Error(`${path}: Failed to extract mesh`)
	}

	console.log(mesh)

	return mesh as Mesh
}

export const extractByName = (name: string): ResultCallback => (
	g,
	{ path }
) => {
	const mesh = findMesh(g.scene, i => i.name === name)

	if (!mesh) {
		throw new Error(`${path}: Failed to extract object ${name}`)
	}

	return mesh
}

export const findMesh = (s: Object3D, condition: (i: Object3D) => boolean) => {
	let found = undefined as Object3D | undefined

	s.traverse(i => {
		if (condition(i)) {
			found = i
		}
	})

	return found
}
