import {
	EventDispatcher,
	PerspectiveCamera,
	OrthographicCamera,
	Camera,
	Vector3
} from 'three'

export class OrbitControls extends EventDispatcher {
	constructor(
		object: PerspectiveCamera | OrthographicCamera,
		domElement: HTMLElement
	)

	autoRotate: boolean

	autoRotateSpeed: number

	dampingFactor: number

	domElement: HTMLElement
	enabled: boolean
	enableDamping: boolean
	enableKeys: boolean

	enablePan: boolean
	enableRotate: boolean

	enableZoom: boolean

	keyPanSpeed: number

	keys: Record<string, number>

	maxAzimuthAngle: number

	maxDistance: number

	maxPolarAngle: number

	maxZoom: number

	minAzimuthAngle: number

	minDistance: number

	minPolarAngle: number

	minZoom: number

	mouseButtons: Record<string, number>

	object: Camera

	panSpeed: number

	position0: Vector3

	rotateSpeed: number

	screenSpacePanning: boolean

	target0: Vector3
	target: Vector3
	touches: Record<string, number>

	zoom0: number

	zoomSpeed: number

	update(): void
}
