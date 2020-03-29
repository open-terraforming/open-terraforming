/* eslint-disable @typescript-eslint/no-explicit-any */
import { combineReducers } from 'redux'

import api from './api'
import client from './client'
import game from './game'
import player from './player'

const reducers = combineReducers({
	api,
	client,
	game,
	player,
})

export default (state: any, action: any) => {
	return reducers(state, action)
}
