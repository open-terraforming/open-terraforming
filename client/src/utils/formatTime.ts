export const formatTime = (time: number) => {
	const hours = Math.floor(time / 3600000)
	const minutes = Math.floor((time % 3600000) / 60000)
	const seconds = ((time % 60000) / 1000).toFixed(0)

	return `${hours > 0 ? hours + ':' : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
