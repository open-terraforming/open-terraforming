import { baseExpansion } from './base'
import { preludeExpansion } from './prelude'
import { keyMap } from '../utils'
import { venusExpansion } from './venusExpansion'

const list = [baseExpansion, preludeExpansion, venusExpansion]

export const Expansions = keyMap(list, 'type')
