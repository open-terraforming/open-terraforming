export class GameSound {
	audio: HTMLAudioElement[]

	constructor(urls: string[]) {
		this.audio = urls.map(url => {
			const audio = document.createElement('audio')

			const items = [/*'aac',*/ 'ogg']

			items.forEach(ext => {
				const source = document.createElement('source')
				source.src = `${url}.${ext}`
				source.type = `audio/${ext}`
				audio.appendChild(source)
			})

			audio.preload = 'auto'

			return audio
		})
	}

	play() {
		const audio = this.audio[
			Math.round(Math.random() * (this.audio.length - 1))
		]

		audio.currentTime = 0

		return audio.play()
	}
}
