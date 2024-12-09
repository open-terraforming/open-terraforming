import { useLocale } from '@/context/LocaleContext'
import { CommitteePartyDisplay } from '@/pages/Game/pages/Table/components/CommitteeModal/components/CommitteePartyDisplay'
import { useGameState, useToggle } from '@/utils/hooks'
import { Button } from '../Button/Button'
import { Flex } from '../Flex/Flex'
import { Modal } from '../Modal/Modal'
import styled from 'styled-components'
import { CommitteePartyIcon } from '../CommitteePartyIcon'

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
		<Container>
			<Value>
				{value === null ? (
					'None'
				) : (
					<>
						<CommitteePartyIcon party={value} size="sm" />
						{t.committeeParties[value]}
					</>
				)}
			</Value>
			<Button noClip onClick={togglePicker}>
				Pick
			</Button>

			{showPicker && (
				<Modal open header="Pick a Party" onClose={togglePicker}>
					<Flex wrap="wrap" justify="center" align="stretch" gap="0.5rem">
						{shownParties.map((party) => (
							<CommitteePartyDisplay
								key={party.code}
								state={party}
								onClick={() => {
									onChange(party.code)
									togglePicker()
								}}
								pickerMode
							/>
						))}
					</Flex>
				</Modal>
			)}
		</Container>
	)
}

const Container = styled(Flex)`
	align-items: center;
	background-color: ${({ theme }) => theme.colors.background};
	margin: 0 0.25rem;
	border: 2px solid ${({ theme }) => theme.colors.border};

	button {
		margin: 0;
	}
`

const Value = styled(Flex)`
	padding: 0 0.5rem;
	gap: 0.25rem;
	align-items: center;
`
