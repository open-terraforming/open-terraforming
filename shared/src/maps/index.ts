import { keyMap } from '@shared/utils/keyMap'
import { hellasMap } from './hellas'
import { standardMap } from './standard'
import { elysiumMap } from './elysium'

export const MapsList = [standardMap, hellasMap, elysiumMap]

export const Maps = keyMap(MapsList, 'type')
