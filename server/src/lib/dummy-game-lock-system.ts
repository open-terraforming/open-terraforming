import { GameLockSystem } from '@/game/game'

export class DummyGameLockSystem implements GameLockSystem {
	createLock() {
		return
	}

	clearLock() {
		return
	}

	tryLoadLock() {
		return null
	}
}
