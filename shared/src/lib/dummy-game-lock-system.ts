import { GameLockSystem } from '@shared/game/game'

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
