import { PartyPickerInput } from '@/components/PartyPickerInput/PartyPickerInput'
import { useAppStore, useGameState, usePlayerState } from '@/utils/hooks'
import { CardEffectArgument } from '@shared/cards'
import { getPartyState } from '@shared/expansions/turmoil/utils/getPartyState'
import { deduplicate } from '@shared/utils'
import { useEffect, useMemo, useState } from 'react'
import { ArgContainer } from './ArgContainer'

type Props = {
	arg: CardEffectArgument
	onChange: (v: (string | number | null)[]) => void
}

export const CommitteePartyMemberArg = ({ arg, onChange }: Props) => {
	const game = useGameState()
	const player = usePlayerState()
	const playerMap = useAppStore((store) => store.game.playerMap)

	const filteredParties = game.committee.parties
		.filter(
			(p) =>
				!arg.committeePartyConditions ||
				arg.committeePartyConditions.every((c) => c({ game, player }, p)),
		)
		.map((p) => p.code)

	const [partyCode, setPartyCode] = useState(filteredParties[0])

	const selectedParty = getPartyState(game, partyCode)

	const playerChoices = useMemo(
		() =>
			deduplicate(selectedParty.members.flatMap((m) => m.playerId?.id ?? null)),
		[selectedParty],
	)

	const [playerId, setPlayerId] = useState<number | null>(null)

	useEffect(() => {
		setPlayerId(playerChoices[0] ?? null)
	}, [playerChoices])

	useEffect(() => {
		onChange([partyCode, playerId])
	}, [partyCode, playerId])

	const partyPicked = (value: string | null) => {
		if (!value) {
			return
		}

		setPartyCode(value)
	}

	return (
		<ArgContainer>
			<span>{arg.descriptionPrefix}</span>

			<PartyPickerInput
				value={partyCode}
				onChange={partyPicked}
				parties={filteredParties}
			/>

			<select
				value={playerId === null ? 'null' : playerId}
				onChange={(e) =>
					setPlayerId(e.target.value !== 'null' ? Number(e.target.value) : null)
				}
			>
				{playerChoices.map((p) => (
					<option key={String(p)} value={p === null ? 'null' : p}>
						{p === null ? 'Neutral' : playerMap[p].name}
					</option>
				))}
			</select>

			<span>{arg.descriptionPostfix}</span>
		</ArgContainer>
	)
}
