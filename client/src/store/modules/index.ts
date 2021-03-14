/* eslint-disable @typescript-eslint/no-explicit-any */
import { combineReducers } from 'redux'

import api from './api'
import client from './client'
import game from './game'
import settings from './settings'
import table from './table'

const reducers = combineReducers({
	api,
	client,
	game,
	table,
	settings
})

export default (state: any, action: any) => {
	return reducers(state, action)
}
