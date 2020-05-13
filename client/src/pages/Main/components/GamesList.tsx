import { getGames } from '@/api/rest'
import { Button, Loader } from '@/components'
import { ApiState, setApiState } from '@/store/modules/api'
import { colors } from '@/styles'
import { useAppDispatch } from '@/utils/hooks'
import { faArrowRight, faSync } from '@fortawesome/free-solid-svg-icons'
import { GameInfo } from '@shared/extra'
import { Maps } from '@shared/maps'
import { GameModes } from '@shared/modes'
import { darken } from 'polished'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

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
				<Button icon={faSync} isLoading={loading} onClick={refresh}>
					Refresh
				</Button>
			</Head>

			<Loader loaded={!loading} absolute />

			{games.length !== 0 && (
				<GameHeader>
					<GameName>Name</GameName>
					<GameMode>Mode</GameMode>
					<GameMap>Board</GameMap>
					<GamePlayers>Players</GamePlayers>
					<Join>&nbsp;</Join>
				</GameHeader>
			)}

			{games.map(game => (
				<GameLine key={game.id}>
					<GameName>{game.name}</GameName>
					<GameMode>{GameModes[game.mode]?.name}</GameMode>
					<GameMap>{Maps[game.map]?.name}</GameMap>
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
	justify-content: flex-end;
`

const NoGames = styled.div`
	padding: 2rem 0;
	text-align: center;
`

const GameLine = styled.div`
	display: flex;
	align-items: center;
	margin: 0.5rem 0;
`

const GameHeader = styled(GameLine)`
	margin-top: 2rem;
	color: ${darken(0.1, colors.text)};
`

const GameName = styled.div`
	flex: 1;
	min-width: 10rem;
`

const GamePlayers = styled.div`
	flex-grow: 0;
	width: 4rem;
`

const GameMode = styled.div`
	flex-grow: 0;
	width: 8rem;
`

const GameMap = styled.div`
	flex-grow: 0;
	width: 4rem;
`

const Join = styled.div`
	flex-grow: 0;
	width: 6rem;

	> button {
		margin-left: auto;
	}
`
