import { setSettings } from '@/store/modules/settings'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import styled, { css } from 'styled-components'

type Props = {
	id?: string
	message: string
}

export const HelpMessage = ({ id, message }: Props) => {
	const dispatch = useAppDispatch()
	const hiddenHelp = useAppStore((state) => state.settings.data.hiddenHelp)

	const hidden = !!(id && hiddenHelp[id])

	const handleHide = () => {
		if (id) {
			dispatch(
				setSettings({
					hiddenHelp: {
						...hiddenHelp,
						[id]: true,
					},
				}),
			)
		}
	}

	return hidden ? (
		<></>
	) : (
		<Help hasClose={!!id}>
			{id && (
				<Hide onClick={handleHide} title="Hide this help message forever">
					&times;
				</Hide>
			)}
			{message}
		</Help>
	)
}

const Hide = styled.div`
	padding: 0.2rem;
	position: absolute;
	right: 0;
	top: 0;
	border: 0.2rem solid ${({ theme }) => theme.colors.border};
	border-top: 0;
	border-right: 0;
	cursor: pointer;
`

const Help = styled.div<{ hasClose: boolean }>`
	margin: 0.5rem auto;
	padding: 1rem;
	border: 0.2rem solid ${({ theme }) => theme.colors.border};
	background-color: ${({ theme }) => theme.colors.background};
	max-width: 30rem;
	position: relative;

	${(props) =>
		props.hasClose &&
		css`
			padding-right: 2rem;
		`}
`
