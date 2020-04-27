import { useAnimationFrame, useAppStore, useEvent } from '@/utils/hooks'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import {
	AmbientLight,
	PerspectiveCamera,
	PointLight,
	Scene,
	Vector3,
	WebGLRenderer
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { MarsObject } from './objects/mars-object'
import { PlayerStateValue, claimTile, placeTile } from '@shared/index'
import { PlayerActionType } from '@shared/player-actions'
import { useApi } from '@/context/ApiContext'

type Props = {}

export default ({}: Props) => {
	const api = useApi()
	const player = useAppStore(state => state.game.player)
	const game = useAppStore(state => state.game.state)
	const pending = useAppStore(state => state.game.pendingAction)

	const isPlaying = useAppStore(
		state =>
			state.game.player.state === PlayerStateValue.Playing ||
			state.game.player.state === PlayerStateValue.EndingTiles
	)

	const placing =
		isPlaying && pending && pending.type === PlayerActionType.PlaceTile
			? pending.state
			: undefined

	const claiming = !!(
		isPlaying &&
		pending &&
		pending.type === PlayerActionType.ClaimTile
	)

	const [canvas, setCanvas] = useState(null as null | HTMLCanvasElement)
	const [size, setSize] = useState([600, 600])
	const mouse = useRef({ x: -5, y: -5 })

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

	useEvent(canvas, 'mousemove', (e: MouseEvent) => {
		if (canvas) {
			const rect = canvas.getBoundingClientRect()
			mouse.current.x = ((e.clientX - rect.x) / rect.width) * 2 - 1
			mouse.current.y = -((e.clientY - rect.y) / rect.height) * 2 + 1
		}
	})

	const camera = useMemo(
		() => new PerspectiveCamera(75, size[0] / size[1], 0.1, 1000),
		[]
	)

	const scene = useMemo(() => {
		const scene = new Scene()

		const pointLight = new PointLight(0xffd09d, 1.5)
		pointLight.position.z = 2
		pointLight.position.y = 0.5
		pointLight.position.x = 0.5
		scene.add(pointLight)

		const pointLight2 = new PointLight(0xffd09d, 0.5)
		pointLight.position.z = 2
		pointLight.position.y = 0.5
		pointLight.position.x = -0.1
		scene.add(pointLight2)

		const ambientLight = new AmbientLight(0xfebd76, 0.3)

		scene.add(ambientLight)

		return scene
	}, [])

	const planet = useMemo(() => {
		scene.children.forEach(c => {
			if (c.name === 'Mars') {
				scene.remove(c)
			}
		})

		const newPlanet = new MarsObject(game, player)

		scene.add(newPlanet.container)

		newPlanet.update(game, player)

		return newPlanet
	}, [])

	useEffect(() => {
		if (planet) {
			planet.update(game, player)
		}
	}, [game])

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

	const handleClick = () => {
		for (let x = 0; x < game.map.width; x++) {
			for (let y = 0; y < game.map.height; y++) {
				if (
					game.map.grid[x][y].enabled &&
					planet.cells[x] &&
					planet.cells[x][y]
				) {
					const cell = planet.cells[x][y]

					if (cell.hover && cell.available) {
						if (placing) {
							api.send(placeTile(x, y))
						} else if (claiming) {
							api.send(claimTile(x, y))
						}
					}
				}
			}
		}
	}

	useAnimationFrame(() => {
		if (renderer && scene && camera) {
			controls?.update()

			if (positionsNeedUpdate.current) {
				const cells = [] as { x: number; y: number; px: number; py: number }[]

				for (let x = 0; x < game.map.width; x++) {
					for (let y = 0; y < game.map.height; y++) {
						if (
							game.map.grid[x][y].enabled &&
							planet.cells[x] &&
							planet.cells[x][y]
						) {
							const cell = planet.cells[x][y]

							const width = size[0],
								height = size[1]

							const widthHalf = width / 2,
								heightHalf = height / 2

							const pos = new Vector3()
							cell.container.getWorldPosition(pos)
							pos.project(camera)
							pos.x = pos.x * widthHalf + widthHalf
							pos.y = -(pos.y * heightHalf) + heightHalf

							cells.push({
								x: x,
								y: y,
								px: pos.x,
								py: pos.y
							})
						}
					}
				}

				positionsNeedUpdate.current = false

				setCells(cells)
			}

			planet.tick(camera, mouse.current)

			renderer.render(scene, camera)
		}
	})

	return (
		<>
			<E>
				<canvas ref={e => setCanvas(e)} onClick={handleClick} />
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
	z-index: 1;
	color: #000;
`
