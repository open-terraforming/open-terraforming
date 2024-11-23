import { useLocale } from '@/context/LocaleContext'
import { CommitteePartyDisplay } from '@/pages/Game/pages/Table/components/CommitteeModal/components/CommitteePartyDisplay'
import { useGameState, useToggle } from '@/utils/hooks'
import { Button } from '../Button/Button'
import { Flex } from '../Flex/Flex'
import { Modal } from '../Modal/Modal'

type Props = {
	value: string | null
	onChange: (value: string | null) => void
	parties?: string[]
}

export const PartyPickerInput = ({ value, onChange, parties }: Props) => {
	const game = useGameState()
	const [showPicker, togglePicker] = useToggle()
	const t = useLocale()

	const shownParties = game.committee.parties.filter(
		(p) => !parties || parties.includes(p.code),
	)

	return (
		<Flex>
			{value === null ? 'None' : t.committeeParties[value]}
			<Button noClip onClick={togglePicker}>
				Pick
			</Button>

			{showPicker && (
				<Modal open header="Pick a Party" onClose={togglePicker}>
					{shownParties.map((party) => (
						<CommitteePartyDisplay
							key={party.code}
							state={party}
							onClick={() => {
								onChange(party.code)
								togglePicker()
							}}
						/>
					))}
				</Modal>
			)}
		</Flex>
	)
}
