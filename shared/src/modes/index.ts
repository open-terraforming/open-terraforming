import { keyMap } from '../utils'
import { BeginnerMode } from './types/beginner'
import { StandardMode } from './types/standard'

export const GameModes = keyMap([BeginnerMode, StandardMode], 'type')
