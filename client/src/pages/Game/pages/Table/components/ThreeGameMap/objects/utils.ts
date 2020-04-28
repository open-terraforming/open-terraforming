import { CanvasTexture, LinearFilter, ClampToEdgeWrapping } from 'three'

export function makeLabelTexture(
	baseWidth: number,
	fontName: string,
	size: number,
	text: string
) {
	const borderSize = 2
	const ctx = document.createElement('canvas').getContext('2d')

	if (!ctx) {
		throw new Error('Failed to initialize drawing context')
	}

	const font = `${size}px ${fontName}`
	ctx.font = font
	// measure how long the name will be
	const textWidth = ctx.measureText(text).width

	const doubleBorderSize = borderSize * 2
	const width = baseWidth + doubleBorderSize
	const height = size + doubleBorderSize
	ctx.canvas.width = width
	ctx.canvas.height = height

	// need to set font again after resizing canvas
	ctx.font = font
	ctx.textBaseline = 'middle'
	ctx.textAlign = 'center'

	// scale to fit but don't stretch
	const scaleFactor = Math.min(1, baseWidth / textWidth)
	ctx.translate(width / 2, height / 2)
	ctx.scale(scaleFactor, 1)
	ctx.fillStyle = '#ccc'
	ctx.fillText(text, 0, 0)

	const texture = new CanvasTexture(ctx.canvas)
	// because our canvas is likely not a power of 2
	// in both dimensions set the filtering appropriately.
	texture.minFilter = LinearFilter
	texture.wrapS = ClampToEdgeWrapping
	texture.wrapT = ClampToEdgeWrapping

	return texture
}
