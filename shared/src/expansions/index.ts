import { baseExpansion } from './base'
import { preludeExpansion } from './prelude'
import { keyMap } from '../utils'

const list = [baseExpansion, preludeExpansion]

export const Expansions = keyMap(list, 'type')
