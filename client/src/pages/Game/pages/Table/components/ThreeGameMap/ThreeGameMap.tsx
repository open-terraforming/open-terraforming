import { useAnimationFrame, useAppStore } from '@/utils/hooks'
import React, { useEffect, useMemo, useState, useRef } from 'react'
import {
	AmbientLight,
	Mesh,
	PerspectiveCamera,
	PointLight,
	Scene,
	WebGLRenderer,
	Vector3
} from 'three'
import { MarsObject } from './mars-object'
import styled from 'styled-components'
import { OrbitControls } from './orbit-controls'

type Props = {}

export default ({}: Props) => {
	const game = useAppStore(state => state.game.state)
	const [canvas, setCanvas] = useState(null as null | HTMLCanvasElement)
	const [size, setSize] = useState([600, 600])

	const [cells, setCells] = useState(
		[] as { x: number; y: number; px: number; py: number }[]
	)

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
			if (c.name === 'Mars') {
				scene.remove(c)
			}
		})

		const newPlanet = new MarsObject(game)

		scene.add(newPlanet.container)

		return newPlanet
	}, [])

	useEffect(() => {
		if (camera && planet) {
			camera.position.z = 2
			camera.lookAt(planet.container.position)
		}
	}, [camera, planet])

	useEffect(() => {
		if (camera && renderer) {
			camera.aspect = size[0] / size[1]
			camera.updateProjectionMatrix()
			// renderer.setPixelRatio(window.devicePixelRatio)
			renderer.setSize(size[0], size[1])

			positionsNeedUpdate.current = true
		}
	}, [size])

	const renderer = useMemo(() => {
		if (canvas) {
			const renderer = new WebGLRenderer({ canvas: canvas, alpha: true })
			// renderer.setPixelRatio(window.devicePixelRatio)
			renderer.setSize(size[0], size[1])

			return renderer
		} else {
			return undefined
		}
	}, [canvas])

	const positionsNeedUpdate = useRef<boolean>()

	const controls = useMemo(() => {
		if (renderer && camera) {
			const controls = new OrbitControls(camera, renderer.domElement)
			controls.enablePan = false
			controls.rotateSpeed = 0.1
			controls.enableDamping = true
			controls.minDistance = 1.2
			controls.maxDistance = 2

			const updated = () => {
				positionsNeedUpdate.current = true
			}

			controls.addEventListener('change', updated)

			return controls
		}
	}, [renderer, camera])

	useAnimationFrame(() => {
		if (renderer && scene && camera) {
			renderer.render(scene, camera)
			controls?.update()

			if (positionsNeedUpdate.current) {
				const cells = [] as { x: number; y: number; px: number; py: number }[]

				for (let x = 0; x < game.map.width; x++) {
					for (let y = 0; y < game.map.height; y++) {
						if (
							game.map.grid[y][x].enabled &&
							planet.cells[y] &&
							planet.cells[y][x]
						) {
							const cell = planet.cells[x][y]

							const width = size[0],
								height = size[1]

							const widthHalf = width / 2,
								heightHalf = height / 2

							const pos = new Vector3()
							cell.position.getWorldPosition(pos)
							pos.project(camera)
							pos.x = pos.x * widthHalf + widthHalf
							pos.y = -(pos.y * heightHalf) + heightHalf

							cells.push({
								x: y,
								y: x,
								px: pos.x,
								py: pos.y
							})
						}
					}
				}

				positionsNeedUpdate.current = false

				setCells(cells)
			}
		}
	})

	return (
		<>
			<E>
				<canvas ref={e => setCanvas(e)} />
				{cells.map(c => (
					<Cell key={`${c.x}_${c.y}`} style={{ top: c.py, left: c.px }}>
						{c.x},{c.y}
					</Cell>
				))}
			</E>
			<O></O>
		</>
	)
}

const E = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
`

const O = styled.div`
	flex: 1;
`

const Cell = styled.div`
	position: absolute;
	z-index: 10;
	color: #000;
`
