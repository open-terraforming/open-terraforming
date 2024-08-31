export class GameSound {
	private enabled = true
	audio: HTMLAudioElement[]

	constructor(urls: string[]) {
		this.audio = urls.map((url) => {
			const audio = document.createElement('audio')

			const items = [/*'aac',*/ 'ogg']

			items.forEach((ext) => {
				const source = document.createElement('source')
				source.src = `${url}.${ext}`
				source.type = `audio/${ext}`
				audio.appendChild(source)
			})

			audio.preload = 'auto'

			return audio
		})
	}

	setEnabled(enabled: boolean) {
		this.enabled = enabled

		this.audio.forEach((audio) => {
			audio.muted = !enabled
		})
	}

	setVolume(volume: number) {
		this.audio.forEach((audio) => {
			audio.volume = Math.min(1, Math.max(0, volume))
		})
	}

	play() {
		if (!this.enabled) {
			return
		}

		const audio =
			this.audio[Math.round(Math.random() * (this.audio.length - 1))]

		audio.currentTime = 0

		return audio.play()
	}
}
