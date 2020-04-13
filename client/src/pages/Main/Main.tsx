import { getServerInfo } from '@/api/rest'
import { Loader } from '@/components'
import { Modal } from '@/components/Modal/Modal'
import { ApiState, setApiState } from '@/store/modules/api'
import { ServerInfo } from '@shared/extra'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { GamesList } from './components/GamesList'

type Props = {}

export const Main = ({}: Props) => {
	const dispatch = useDispatch()
	const [info, setInfo] = useState(null as ServerInfo | null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (location.hash) {
			const gameId = location.hash.substr(1)

			if (gameId.length > 0) {
				dispatch(
					setApiState({
						state: ApiState.Connecting,
						gameId
					})
				)
			}
		}
	}, [])

	useEffect(() => {
		getServerInfo().then(info => {
			if (info.singleGame) {
				dispatch(
					setApiState({
						state: ApiState.Connecting
					})
				)
			} else {
				setInfo(info)
				setLoading(false)
			}
		})
	}, [])

	return (
		<Modal open={true} allowClose={false}>
			<Loader loaded={!loading} />
			{!loading && info && (
				<GamesList allowCreate={info?.servers < info?.maxServers} />
			)}
		</Modal>
	)
}
