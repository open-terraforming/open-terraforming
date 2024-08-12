import { getServerInfo } from '@/api/rest'
import { Button, DialogWrapper, Loader, Message } from '@/components'
import { CardsViewer } from '@/components/CardsViewer/CardsViewer'
import { Mars } from '@/components/Mars/Mars'
import { Modal } from '@/components/Modal/Modal'
import { ApiState, setApiState } from '@/store/modules/api'
import {
	faArrowRight,
	faCog,
	faPlusCircle,
	faSearch,
	faSync
} from '@fortawesome/free-solid-svg-icons'
import { ServerInfo } from '@shared/extra'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { GamesListModal } from './components/GamesListModal'
import { NewGameModal } from './components/NewGameModal'
import { SettingsModal } from './components/SettingsModal'

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

	const allowCreate = info ? info.servers < info.maxServers : false

	return (
		<>
			<Mars />
			<Modal
				open={true}
				allowClose={false}
				contentStyle={{ minHeight: '4rem', minWidth: '10rem', margin: 'auto' }}
				header="Open Terraforming"
				headerStyle={{ justifyContent: 'center', fontSize: '150%' }}
			>
				<Loader loaded={!loading} absolute />

				{!loading && info && (
					<Menu>
						<DialogWrapper dialog={close => <NewGameModal onClose={close} />}>
							{open => (
								<Button
									onClick={open}
									disabled={!allowCreate}
									tooltip={
										!allowCreate ? 'Game count limit reached, sorry' : undefined
									}
									icon={faPlusCircle}
								>
									New game
								</Button>
							)}
						</DialogWrapper>

						<DialogWrapper dialog={close => <GamesListModal onClose={close} />}>
							{open => (
								<Button onClick={open} icon={faArrowRight}>
									Join game
								</Button>
							)}
						</DialogWrapper>

						<DialogWrapper dialog={close => <SettingsModal onClose={close} />}>
							{open => (
								<Button onClick={open} icon={faCog}>
									Settings
								</Button>
							)}
						</DialogWrapper>

						<DialogWrapper dialog={close => <CardsViewer onClose={close} />}>
							{open => (
								<Button onClick={open} icon={faSearch}>
									Cards viewer
								</Button>
							)}
						</DialogWrapper>
					</Menu>
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
		</>
	)
}

const Menu = styled.div`
	display: flex;
	flex-direction: column;
	align-items: stretch;

	> button {
		margin: 0.5rem 0;
	}
`
