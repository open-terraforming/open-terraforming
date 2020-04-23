import marsTexture from '@/assets/mars_4k_color.jpg'
import marsNormal from '@/assets/mars_4k_normal.jpg'
import { useAnimationFrame } from '@/utils/hooks'
import React, { useEffect, useMemo, useState } from 'react'
import {
	AmbientLight,
	Mesh,
	MeshPhongMaterial,
	PerspectiveCamera,
	PointLight,
	Scene,
	SphereGeometry,
	Texture,
	TextureLoader,
	Vector2,
	WebGLRenderer
} from 'three'

type Props = {}

export default ({}: Props) => {
	const [canvas, setCanvas] = useState(null as null | HTMLCanvasElement)
	const [texture, setTexture] = useState(null as null | [Texture, Texture])
	const [size, setSize] = useState([600, 600])

	useEffect(() => {
		const updateSize = () => {
			setSize([window.innerWidth, window.innerHeight])
		}

		updateSize()

		window.addEventListener('resize', updateSize)

		return () => {
			window.removeEventListener('resize', updateSize)
		}
	}, [])

	const camera = useMemo(
		() => new PerspectiveCamera(75, size[0] / size[1], 0.1, 1000),
		[]
	)

	const scene = useMemo(() => {
		const scene = new Scene()

		const pointLight = new PointLight(0xffd09d, 2)
		pointLight.position.z = 2
		pointLight.position.y = 0.5
		pointLight.position.x = 0.5

		const ambientLight = new AmbientLight(0xfebd76, 0.2)

		scene.add(ambientLight)
		scene.add(pointLight)

		return scene
	}, [])

	const planet = useMemo(() => {
		scene.children.forEach(c => {
			if (c instanceof Mesh) {
				scene.remove(c)
			}
		})

		if (texture) {
			const geometry = new SphereGeometry(1, 64, 64)

			const material = new MeshPhongMaterial({
				color: 0xffffff,
				map: texture[0],
				normalMap: texture[1],
				shininess: 0.1,
				normalScale: new Vector2(5, 5)
			})

			const newPlanet = new Mesh(geometry, material)

			scene.add(newPlanet)

			return newPlanet
		}
	}, [texture])

	useEffect(() => {
		if (!texture) {
			const loader = new TextureLoader()

			loader.load(marsTexture, texture => {
				loader.load(marsNormal, normal => {
					setTexture([texture, normal])
				})
			})
		}
	}, [])

	useEffect(() => {
		if (camera && planet) {
			camera.position.z = 1.5
			camera.lookAt(planet.position)
		}
	}, [camera, planet])

	useEffect(() => {
		if (camera && renderer) {
			camera.aspect = size[0] / size[1]
			camera.updateProjectionMatrix()
			renderer.setPixelRatio(window.devicePixelRatio)
			renderer.setSize(size[0], size[1])
		}
	}, [size])

	const renderer = useMemo(() => {
		if (canvas) {
			const renderer = new WebGLRenderer({ canvas: canvas, alpha: true })
			renderer.setPixelRatio(window.devicePixelRatio)
			renderer.setSize(size[0], size[1])

			return renderer
		} else {
			return undefined
		}
	}, [canvas])

	useAnimationFrame(() => {
		if (renderer && scene && camera) {
			if (planet) {
				planet.rotateY(0.001)
			}

			renderer.render(scene, camera)
		}
	})

	return <canvas ref={e => setCanvas(e)} />
}
