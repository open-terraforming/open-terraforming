import { PartyPickerInput } from '@/components/PartyPickerInput/PartyPickerInput'
import { useGameState, usePlayerState } from '@/utils/hooks'
import { CardEffectArgument } from '@shared/cards'
import { useEffect, useState } from 'react'
import { ArgContainer } from './ArgContainer'

type Props = {
	arg: CardEffectArgument
	onChange: (v: string) => void
}

export const CommitteePartyArg = ({ arg, onChange }: Props) => {
	const game = useGameState()
	const player = usePlayerState()

	const filteredParties = game.committee.parties
		.filter(
			(p) =>
				!arg.committeePartyConditions ||
				arg.committeePartyConditions.every((c) => c({ game, player }, p)),
		)
		.map((p) => p.code)

	const [partyCode, setPartyCode] = useState(filteredParties[0])

	const partyPicked = (value: string | null) => {
		if (!value) {
			return
		}

		setPartyCode(value)
		onChange(value)
	}

	useEffect(() => {
		onChange(partyCode)
	}, [])

	return (
		<ArgContainer>
			<span>{arg.descriptionPrefix}</span>

			<PartyPickerInput
				value={partyCode}
				onChange={partyPicked}
				parties={filteredParties}
			/>

			<span>{arg.descriptionPostfix}</span>
		</ArgContainer>
	)
}
