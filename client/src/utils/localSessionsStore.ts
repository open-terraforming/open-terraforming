import { useEffect, useState } from 'react'

export type SavedSessionInfo = {
	name: string
	generation: number
	finished: boolean
	session: string
	lastUpdateAt: number
}

const LOCAL_STORAGE_KEY = 'ot-saved-sessions'

const tryLoadFromLocalStorage = () => {
	try {
		return JSON.parse(localStorage[LOCAL_STORAGE_KEY])
	} catch {
		return {}
	}
}

export const localSessionsStore = {
	sessions: {} as Record<string, SavedSessionInfo>,
	changeListeners: [] as (() => void)[],

	load() {
		this.sessions = tryLoadFromLocalStorage()
	},

	changed() {
		this.save()
		this.dispatchChange()
	},

	save() {
		localStorage[LOCAL_STORAGE_KEY] = JSON.stringify(this.sessions)
	},

	dispatchChange() {
		for (const listener of this.changeListeners) {
			listener()
		}
	},

	append(games: Record<string, SavedSessionInfo>) {
		this.sessions = {
			...this.sessions,
			...games,
		}

		this.changed()
	},

	setGameData(gameId: string, data: Partial<SavedSessionInfo>) {
		this.sessions[gameId] = {
			...this.sessions[gameId],
			...data,
		}

		this.changed()
	},

	removeGameData(gameId: string) {
		delete this.sessions[gameId]

		this.changed()
	},

	getGameData(gameId: string): SavedSessionInfo | undefined {
		return this.sessions[gameId]
	},

	use() {
		const [data, setData] = useState(this.sessions)

		useEffect(() => {
			const listener = () => {
				setData({ ...this.sessions })
			}

			this.changeListeners.push(listener)

			return () => {
				const index = this.changeListeners.indexOf(listener)

				if (index !== -1) {
					this.changeListeners.splice(index, 1)
				}
			}
		}, [])

		return data
	},
}
