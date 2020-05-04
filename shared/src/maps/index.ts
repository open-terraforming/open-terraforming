import { keyMap } from '../utils'
import { hellasMap } from './hellas'
import { standardMap } from './standard'

export const MapsList = [standardMap, hellasMap]

export const Maps = keyMap(MapsList, 'type')
