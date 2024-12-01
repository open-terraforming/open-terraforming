import { DialogButton } from '@/components/DialogButton/DialogButton'
import styled from 'styled-components'

export const HeaderDialogButton = styled(DialogButton)`
	background-color: ${({ theme }) => theme.colors.background};
	border: 2px solid ${({ theme }) => theme.colors.border};
	display: flex;
	padding: 0.5rem 1rem;
	width: 100%;
	box-sizing: border-box;
`
