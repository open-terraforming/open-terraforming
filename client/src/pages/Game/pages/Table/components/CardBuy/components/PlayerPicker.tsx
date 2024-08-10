import { Button } from '@/components'
import { Modal } from '@/components/Modal/Modal'
import { Production, Resource } from '@shared/cards'
import { resourceProduction } from '@shared/cards/utils'
import { PlayerState } from '@shared/index'
import { lighten } from 'polished'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { ResourceIcon } from '../../ResourceIcon/ResourceIcon'

type Props = {
	players: PlayerState[]
	playerId: number
	onChange: (playerId: number) => void
	optional: boolean
	res?: Resource | Production
}

const resources: Resource[] = [
	'money',
	'ore',
	'titan',
	'plants',
	'energy',
	'heat'
]

const ResItem = ({
	res,
	value,
	production,
	highlight
}: {
	res: Resource
	value: number
	production: number
	highlight: boolean
}) => (
	<InfoItem highlight={highlight}>
		<Value>
			{value} <ResourceIcon res={res} />
		</Value>
		<ProductionE>
			{production > 0 && '+'}
			{production}
		</ProductionE>
	</InfoItem>
)

export const PlayerPicker = ({
	playerId,
	players,
	onChange,
	optional,
	res
}: Props) => {
	const [selecting, setSelecting] = useState(false)

	const selected = useMemo(() => players.find(p => p.id === playerId), [
		playerId
	])

	return (
		<>
			<Button
				onClick={() => setSelecting(true)}
				disabled={players.length === 0}
			>
				{selected
					? selected.name + (res ? ` (has ${selected[res]})` : '')
					: 'Nobody'}
			</Button>
			{selecting && (
				<Modal
					open={true}
					allowClose
					onClose={() => setSelecting(false)}
					header="Pick a player"
				>
					{close => (
						<>
							{optional && (
								<Player
									onClick={() => {
										onChange(-1)
										close()
									}}
								>
									Nobody
								</Player>
							)}
							{players.map(p => (
								<Player
									key={p.id}
									onClick={() => {
										onChange(p.id)
										close()
									}}
								>
									{p.name}
									<Info>
										{resources.map(r => (
											<ResItem
												key={r}
												res={r}
												value={p[r]}
												production={p[resourceProduction[r]]}
												highlight={res === r || resourceProduction[r] === res}
											/>
										))}
									</Info>
								</Player>
							))}
						</>
					)}
				</Modal>
			)}
		</>
	)
}

const Info = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
`

const InfoItem = styled.div<{ highlight?: boolean }>`
	display: flex;
	margin: 0 0.25rem;
	background-color: ${({ theme }) => theme.colors.background};
	border: 1px solid
		${props =>
			props.highlight
				? lighten(0.3, props.theme.colors.border)
				: props.theme.colors.border};
`

const Value = styled.div`
	padding: 0.5rem;
	width: 100%;
`

const ProductionE = styled.div`
	background-color: ${({ theme }) => theme.colors.border};
	padding: 0.5rem;
`

const Player = styled.button`
	color: ${({ theme }) => theme.colors.text};
	background-color: ${({ theme }) => theme.colors.background};
	display: flex;
	align-items: center;
	padding: 0.5rem 1rem;
	transition: background-color 0.1s;
	width: 100%;
	margin-bottom: 0.5rem;

	&:hover {
		background-color: ${({ theme }) => lighten(0.05, theme.colors.background)};
	}
`
