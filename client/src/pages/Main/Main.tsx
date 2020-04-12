import React, { useState, useEffect } from 'react'
import { ServerInfo } from '@shared/extra'
import { getServerInfo } from '@/api/rest'
import { useDispatch } from 'react-redux'
import { setApiState, ApiState } from '@/store/modules/api'
import { Modal } from '@/components/Modal/Modal'
import { GamesList } from './components/GamesList'
import { Loader, DialogWrapper, Button } from '@/components'
import { NewGameModal } from './components/NewGameModal'

type Props = {}

export const Main = ({}: Props) => {
	const dispatch = useDispatch()
	const [info, setInfo] = useState(null as ServerInfo | null)
	const [loading, setLoading] = useState(true)

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
			<DialogWrapper
				dialog={(opened, close) => opened && <NewGameModal onClose={close} />}
			>
				{open => <Button onClick={open}>Create new game</Button>}
			</DialogWrapper>
			<GamesList />
		</Modal>
	)
}
