import { Button } from '@/components'
import { Mars } from '@/components/Mars/Mars'
import { useApi } from '@/context/ApiContext'
import { useAppStore } from '@/utils/hooks'
import {
	faCheck,
	faTimes,
	faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import { playerReady, PlayerStateValue, startGame } from '@shared/index'
import styled from 'styled-components'
import { Player } from './components/Player'
import { Modal } from '@/components/Modal/Modal'
import { Flex } from '@/components/Flex/Flex'
import { Info } from './components/Info'

const Lobby = () => {
	const api = useApi()
	const players = useAppStore((state) => state.game.state?.players)
	const player = useAppStore((state) => state.game.player)
	const info = useAppStore((state) => state.game.info)
	const isReady = player?.state === PlayerStateValue.Ready

	const allReady =
		players.find((p) => p.state !== PlayerStateValue.Ready) === undefined

	const handleReady = () => {
		api.send(playerReady(!isReady))
	}

	const handleStart = () => {
		api.send(startGame())
	}

	return (
		<>
			<Mars />
			<Modal
				open={true}
				allowClose={false}
				contentStyle={{ minWidth: '35rem' }}
				header={info?.name}
				footer={
					<>
						<Waiting>
							{allReady
								? player.owner && (
										<Button icon={faChevronRight} onClick={handleStart}>
											Start game
										</Button>
									)
								: 'Waiting for players'}
						</Waiting>
						<Button onClick={handleReady} icon={isReady ? faTimes : faCheck}>
							{isReady ? 'Not ready' : 'Ready'}
						</Button>
					</>
				}
			>
				<Flex align="flex-start">
					<Players>
						{players?.map((p) => (
							<Player
								id={p.id}
								name={p.name}
								color={p.color}
								key={p.id}
								bot={p.bot}
								current={p.id === player?.id}
								ready={p.state === PlayerStateValue.Ready}
							/>
						))}
					</Players>
					{info && <Info info={info} />}
				</Flex>
			</Modal>
		</>
	)
}

const Players = styled.div`
	min-width: 12rem;
	flex: 1;
`

const Waiting = styled.div`
	margin-right: auto;
`

export default Lobby
