import { Sounds } from '@/sounds/sounds'
import { useAppStore } from '@/utils/hooks'
import { useEffect } from 'react'

export const SoundController = () => {
	const audioVolume = useAppStore((state) => state.settings.data.audioVolume)
	const enableAudio = useAppStore((state) => state.settings.data.enableAudio)

	useEffect(() => {
		Object.values(Sounds).forEach((sound) => {
			sound.setVolume(audioVolume)
		})
	}, [audioVolume])

	useEffect(() => {
		Object.values(Sounds).forEach((sound) => {
			sound.setEnabled(enableAudio)
		})
	}, [enableAudio])

	return <></>
}
