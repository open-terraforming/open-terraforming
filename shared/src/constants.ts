import { Production, Resource } from './cards'

export const PLAYER_PRODUCTION_FIELDS: Production[] = [
	'moneyProduction',
	'oreProduction',
	'titanProduction',
	'plantsProduction',
	'energyProduction',
	'heatProduction',
]

export const PLAYER_PRODUCTION_TO_RESOURCE: Record<Production, Resource> = {
	moneyProduction: 'money',
	oreProduction: 'ore',
	titanProduction: 'titan',
	plantsProduction: 'plants',
	energyProduction: 'energy',
	heatProduction: 'heat',
}

export const PLAYER_RESOURCE_TO_PRODUCTION: Record<Resource, Production> = {
	money: 'moneyProduction',
	ore: 'oreProduction',
	titan: 'titanProduction',
	plants: 'plantsProduction',
	energy: 'energyProduction',
	heat: 'heatProduction',
}

export const GAME_PROGRESS_VALUES = [
	'temperature',
	'oxygen',
	'oceans',
	'venus',
] as const

/** Resources that can be used to trade with a colony */
export const COLONY_TRADE_RESOURCES = ['money', 'energy', 'titan'] as const
