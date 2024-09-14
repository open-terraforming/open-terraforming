import { DialogButton } from '@/components/DialogButton/DialogButton'
import { ColoniesModal } from '../../ColoniesModal/ColoniesModal'
import styled from 'styled-components'

export const ColoniesButton = () => {
	return (
		<StyledButton dialog={(close) => <ColoniesModal onClose={close} />} noClip>
			Colonies
		</StyledButton>
	)
}

const StyledButton = styled(DialogButton)`
	margin-top: 0.5rem;
	background-color: ${({ theme }) => theme.colors.background};
	border: 2px solid ${({ theme }) => theme.colors.border};

	padding: 0.5rem 1rem;
`
