import { baseExpansion } from './base'
import { preludeExpansion } from './prelude'
import { keyMap } from '../utils'
import { venusExpansion } from './venusExpansion'
import { coloniesExpansion } from './coloniesExpansion'
import { turmoilExpansion } from './turmoil/turmoilExpansion'

const list = [
	baseExpansion,
	preludeExpansion,
	venusExpansion,
	coloniesExpansion,
	turmoilExpansion,
]

export const Expansions = keyMap(list, 'type')
