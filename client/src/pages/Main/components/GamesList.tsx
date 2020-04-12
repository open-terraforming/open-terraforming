import React, { useState, useEffect } from 'react'
import { GameInfo } from '@shared/extra'
import { getGames } from '@/api/rest'
import { Loader, Button } from '@/components'
import { setApiState, ApiState } from '@/store/modules/api'
import { useAppDispatch } from '@/utils/hooks'
import styled from 'styled-components'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

type Props = {}

export const GamesList = ({}: Props) => {
	const dispatch = useAppDispatch()
	const [loading, setLoading] = useState(true)
	const [games, setGames] = useState([] as GameInfo[])

	const handleJoin = (game: GameInfo) => {
		dispatch(
			setApiState({
				state: ApiState.Connecting,
				gameId: game.id
			})
		)
	}

	useEffect(() => {
		getGames().then(games => {
			setGames(games)
			setLoading(false)
		})
	}, [])

	if (loading) {
		return <Loader loaded={false} />
	}

	return (
		<Container>
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
