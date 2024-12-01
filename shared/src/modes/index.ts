import { keyMap } from '@shared/utils/keyMap'
import { BeginnerMode } from './types/beginner'
import { StandardMode } from './types/standard'

export const GameModes = keyMap([BeginnerMode, StandardMode], 'type')
