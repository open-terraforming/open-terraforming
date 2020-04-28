import { useApi } from '@/context/ApiContext'
import { useAnimationFrame, useAppStore, useEvent } from '@/utils/hooks'
import { claimTile, GridCell, placeTile, PlayerStateValue } from '@shared/index'
import { PlayerActionType } from '@shared/player-actions'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import {
	AmbientLight,
	PerspectiveCamera,
	PointLight,
	PointLightHelper,
	Scene,
	WebGLRenderer,
	Vector2
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { MarsObject } from './objects/mars-object'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

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
	const controls = useRef<OrbitControls>()

	const [cells, setCells] = useState(
		[] as { x: number; y: number; px: number; py: number; cell: GridCell }[]
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
		pointLight.position.z = 1.5
		pointLight.position.y = 0
		pointLight.position.x = 0
		scene.add(pointLight)
		//scene.add(new PointLightHelper(pointLight, 0.5))

		/*
		const pointLight2 = new PointLight(0xffd09d, 0.5)
		pointLight2.position.z = 1.5
		pointLight2.position.y = -0.2
		pointLight2.position.x = -0.6
		scene.add(pointLight2)
		scene.add(new PointLightHelper(pointLight2, 0.5))
		*/

		const ambientLight = new AmbientLight(0xfebd76, 0.3)
		scene.add(ambientLight)

		return scene
	}, [])

	const planet = useMemo(() => {
		console.log('Building planet')

		scene.children.forEach(c => {
			if (c.name === 'Mars') {
				console.log('Removing previous planet')
				scene.remove(c)
			}
		})

		const newPlanet = new MarsObject(game, player)

		scene.add(newPlanet.container)

		newPlanet.update(game, player)

		return newPlanet
	}, [scene])

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
			renderer.setPixelRatio(window.devicePixelRatio)
			renderer.setSize(size[0], size[1])

			if (composer) {
				composer.setSize(size[0], size[1])
			}

			positionsNeedUpdate.current = true
		}
	}, [size])

	const [renderer, composer] = useMemo(() => {
		if (canvas) {
			const renderer = new WebGLRenderer({ canvas: canvas, alpha: true })
			renderer.setPixelRatio(window.devicePixelRatio)
			renderer.setSize(size[0], size[1])

			const composer = new EffectComposer(renderer)
			composer.addPass(new RenderPass(scene, camera))

			composer.addPass(
				new UnrealBloomPass(new Vector2(size[0], size[1]), 1.5, 0.4, 0.85)
			)

			return [renderer, composer] as const
		} else {
			return [undefined, undefined] as const
		}
	}, [canvas])

	const positionsNeedUpdate = useRef<boolean>()

	useEffect(() => {
		if (renderer && camera) {
			const newControls = new OrbitControls(camera, renderer.domElement)
			newControls.enablePan = false
			newControls.rotateSpeed = 0.1
			newControls.enableDamping = true
			newControls.minDistance = 1.2
			newControls.maxDistance = 10

			const updated = () => {
				positionsNeedUpdate.current = true
			}

			newControls.addEventListener('change', updated)

			controls.current = newControls

			return () => {
				newControls.dispose()
			}
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
			controls.current?.update()

			/*
			if (positionsNeedUpdate.current) {
				const cells = [] as {
					x: number
					y: number
					px: number
					py: number
					cell: GridCell
				}[]

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
								py: pos.y,
								cell: cell.cell!
							})
						}
					}
				}

				positionsNeedUpdate.current = false
				

				setCells(cells)
			}
			*/

			planet.tick(camera, mouse.current)

			// renderer.render(scene, camera)
			composer?.render()
		}
	})

	return (
		<>
			<E>
				<canvas ref={e => setCanvas(e)} onClick={handleClick} />
				{/*cells.map(c => (
					<Cell key={`${c.x}_${c.y}`} style={{ top: c.py, left: c.px }}>
						<Resources>
							{range(0, c.cell.plants).map(i => (
								<PlantRes key={i}>
									<FontAwesomeIcon icon={faSeedling} color="#356A00" />
								</PlantRes>
							))}
							{range(0, c.cell.ore).map(i => (
								<OreRes key={i}>
									<FontAwesomeIcon icon={faHammer} color="#8A4500" />
								</OreRes>
							))}
							{range(0, c.cell.titan).map(i => (
								<FontAwesomeIcon key={i} icon={faStar} color="#FFFFAC" />
							))}
							{range(0, c.cell.cards).map(i => (
								<Card key={i} />
							))}
						</Resources>
					</Cell>
					))*/}
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

const Resources = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
`

const Special = styled.div`
	margin-bottom: 0.5rem;
	text-align: center;
	margin-left: 0.25rem;
	margin-right: 0.25rem;
	position: relative;
	text-shadow: 0px 0px 4px rgba(0, 0, 0, 1);
`

const Res = styled.div`
	padding: 0.1rem;
	margin: 0 0.1rem;
	border-radius: 0.25rem;
	border: 1px solid #fff;
`

const PlantRes = styled(Res)`
	background: #54a800;
	border-color: #356a00;
`

const OreRes = styled(Res)`
	background: #ff8811;
	border-color: #8a4500;
`
