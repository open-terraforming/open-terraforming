import Jimp from 'jimp'

export const normalizeImage = async (data: Buffer) => {
	const img = await Jimp.read(data)
	img.resize(512, img.getHeight() * (512 / img.getWidth()))
	img.quality(90)

	return await img.getBufferAsync('image/jpeg')
}
