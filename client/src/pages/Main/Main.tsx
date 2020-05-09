import { getServerInfo } from '@/api/rest'
import { Loader, Message, Button } from '@/components'
import { Modal } from '@/components/Modal/Modal'
import { ApiState, setApiState } from '@/store/modules/api'
import { ServerInfo } from '@shared/extra'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { GamesList } from './components/GamesList'
import { faSync } from '@fortawesome/free-solid-svg-icons'

type Props = {}

export const Main = ({}: Props) => {
	const dispatch = useDispatch()
	const [info, setInfo] = useState(null as ServerInfo | null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null as string | null)

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

	const update = () => {
		setLoading(true)
		setError(null)

		getServerInfo()
			.then(info => {
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
			.catch(() => {
				setError('Failed to fetch server info')
				setLoading(false)
			})
	}

	useEffect(() => {
		update()
	}, [])

	return (
		<Modal
			open={true}
			allowClose={false}
			contentStyle={{ minHeight: '4rem' }}
			header="Open Terraforming"
			headerStyle={{ justifyContent: 'center', fontSize: '150%' }}
		>
			<Loader loaded={!loading} absolute />
			{!loading && info && (
				<GamesList allowCreate={info?.servers < info?.maxServers} />
			)}
			{error && (
				<>
					<Message message={error} type="error" />
					<Button icon={faSync} onClick={update}>
						Retry
					</Button>
				</>
			)}
		</Modal>
	)
}
