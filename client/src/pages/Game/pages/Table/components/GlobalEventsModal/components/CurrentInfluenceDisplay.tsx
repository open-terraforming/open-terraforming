import { Flex } from '@/components/Flex/Flex'
import { useGameState, usePlayerState } from '@/utils/hooks'
import { SymbolType } from '@shared/cards'
import { getPlayerInfluence } from '@shared/expansions/turmoil/utils/getPlayerInfluence'
import { styled } from 'styled-components'
import { SymbolDisplay } from '../../CardView/components/SymbolDisplay'
import { Tooltip } from '@/components'
import { Position } from '@/components/Tooltip/Tooltip'
import { TooltipContent } from '@/components/TooltipContent'

export const CurrentInfluenceDisplay = () => {
	const game = useGameState()
	const player = usePlayerState()

	const hasChairman = game.committee.chairman?.playerId?.id === player.id

	const dominantParty = game.committee.parties.find(
		(p) => p.code === game.committee.dominantParty,
	)

	const isLeaderOfDominantParty =
		dominantParty?.leader?.playerId?.id === player.id

	const hasMemberInDominantParty = dominantParty?.members.some(
		(m) => m.playerId?.id === player.id,
	)

	return (
		<Tooltip
			styleTrigger={{ marginLeft: 'auto' }}
			position={Position.Bottom}
			noSpacing
			content={
				<TooltipContent title="Your current influence value">
					<div>{hasChairman ? 1 : 0} for being Chairman</div>
					<div>
						{isLeaderOfDominantParty ? 1 : 0} for being leader of the dominant
						party
					</div>
					<div>
						{hasMemberInDominantParty ? 1 : 0} for being a member of the
						dominant party
					</div>
					<div>{player.extraInfluence ?? 0} for extra influence</div>
				</TooltipContent>
			}
		>
			<Container>
				<Icon>
					<SymbolDisplay symbol={{ symbol: SymbolType.Influence }} noSpacing />
				</Icon>
				<Value>{getPlayerInfluence(game, player)}</Value>
			</Container>
		</Tooltip>
	)
}

const Container = styled(Flex)`
	border: 2px solid ${({ theme }) => theme.colors.border};
`

const Icon = styled.div`
	background-color: ${({ theme }) => theme.colors.border};
	padding: 0.25rem;
`

const Value = styled.div`
	padding: 0 0.5rem;
	font-size: 125%;
`
