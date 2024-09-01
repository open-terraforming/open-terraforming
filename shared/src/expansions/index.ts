import { baseExpansion } from './base'
import { preludeExpansion } from './prelude'
import { keyMap } from '../utils'
import { venusExpansion } from './venusExpansion'
import { coloniesExpansion } from './coloniesExpansion'

const list = [
	baseExpansion,
	preludeExpansion,
	venusExpansion,
	coloniesExpansion,
]

export const Expansions = keyMap(list, 'type')
