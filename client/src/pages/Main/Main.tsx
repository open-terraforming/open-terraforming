import { getServerInfo } from '@/api/rest'
import { Button, DialogWrapper, Loader, Message } from '@/components'
import { AboutModal } from '@/components/AboutModal/AboutModal'
import { CardsViewer } from '@/components/CardsViewer/CardsViewer'
import { DialogButton } from '@/components/DialogButton/DialogButton'
import { Mars } from '@/components/Mars/Mars'
import { Modal } from '@/components/Modal/Modal'
import { setApiInfo } from '@/store/modules/api'
import { localSessionsStore } from '@/utils/localSessionsStore'
import {
	faCog,
	faInfo,
	faList,
	faPlay,
	faPlusCircle,
	faSearch,
	faSync,
} from '@fortawesome/free-solid-svg-icons'
import { ServerInfo } from '@shared/extra'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { ContinueModal } from './components/ContinueModal/ContinueModal'
import { Footer } from './components/Footer'
import { GamesListModal } from './components/GamesListModal'
import { NewGamePickerModal } from './components/NewGamePickerModal'
import { SettingsModal } from './components/SettingsModal'

export const Main = () => {
	const dispatch = useDispatch()
	const sessions = localSessionsStore.sessions

	const [info, setInfo] = useState(null as ServerInfo | null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null as string | null)

	const update = () => {
		setLoading(true)
		setError(null)

		getServerInfo()
			.then((info) => {
				dispatch(setApiInfo(info))

				setInfo(info)
				setLoading(false)
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
						{Object.keys(sessions).length > 0 && (
							<DialogButton
								dialog={(close) => <ContinueModal onClose={close} />}
								icon={faPlay}
							>
								Continue
							</DialogButton>
						)}

						<DialogWrapper
							dialog={(close) => <NewGamePickerModal onClose={close} />}
						>
							{(open) => (
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

						{info.publicGames.enabled && (
							<DialogWrapper
								dialog={(close) => <GamesListModal onClose={close} />}
							>
								{(open) => (
									<Button onClick={open} icon={faList}>
										Join game
									</Button>
								)}
							</DialogWrapper>
						)}

						<DialogWrapper dialog={(close) => <CardsViewer onClose={close} />}>
							{(open) => (
								<Button onClick={open} icon={faSearch}>
									Cards viewer
								</Button>
							)}
						</DialogWrapper>

						<DialogWrapper
							dialog={(close) => <SettingsModal onClose={close} />}
						>
							{(open) => (
								<Button onClick={open} icon={faCog}>
									Settings
								</Button>
							)}
						</DialogWrapper>

						<DialogButton
							dialog={(close) => <AboutModal onClose={close} />}
							icon={faInfo}
						>
							About
						</DialogButton>
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
			<Footer />
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
