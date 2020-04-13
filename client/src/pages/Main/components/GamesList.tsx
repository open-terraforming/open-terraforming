import React, { useState, useEffect } from 'react'
import { GameInfo } from '@shared/extra'
import { getGames } from '@/api/rest'
import { Loader, Button, DialogWrapper } from '@/components'
import { setApiState, ApiState } from '@/store/modules/api'
import { useAppDispatch } from '@/utils/hooks'
import styled from 'styled-components'
import { faArrowRight, faSync } from '@fortawesome/free-solid-svg-icons'
import { NewGameModal } from './NewGameModal'

type Props = {}

export const GamesList = ({}: Props) => {
	const dispatch = useAppDispatch()
	const [loading, setLoading] = useState(false)
	const [games, setGames] = useState([] as GameInfo[])

	const handleJoin = (game: GameInfo) => {
		dispatch(
			setApiState({
				state: ApiState.Connecting,
				gameId: game.id
			})
		)
	}

	const refresh = () => {
		if (!loading) {
			setLoading(true)

			getGames()
				.then(games => {
					setGames(games)
					setLoading(false)
				})
				.catch(e => {
					console.error(e)
					setLoading(false)
				})
		}
	}

	useEffect(() => {
		refresh()
	}, [])

	return (
		<Container>
			<Head>
				<DialogWrapper
					dialog={(opened, close) => opened && <NewGameModal onClose={close} />}
				>
					{open => <Button onClick={open}>Create new game</Button>}
				</DialogWrapper>

				<Button icon={faSync} isLoading={loading} onClick={refresh}>
					Refresh
				</Button>
			</Head>

			<Loader loaded={!loading} absolute />

			{games.map(game => (
				<GameLine key={game.id}>
					<GameName>{game.name}</GameName>
					<GamePlayers>
						{game.players} / {game.maxPlayers}
					</GamePlayers>
					<Join>
						<Button onClick={() => handleJoin(game)} icon={faArrowRight}>
							Join
						</Button>
					</Join>
				</GameLine>
			))}
			{games.length === 0 && <NoGames>No games to join</NoGames>}
		</Container>
	)
}

const Container = styled.div`
	width: 30rem;
`

const Head = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`

const NoGames = styled.div`
	padding: 2rem 0;
	text-align: center;
`

const GameLine = styled.div`
	display: flex;
	align-items: center;
`

const GameName = styled.div`
	flex: 1;
`

const GamePlayers = styled.div`
	flex-grow: 0;
	width: 64px;
`

const Join = styled.div`
	flex-grow: 0;
	width: 64px;
`
