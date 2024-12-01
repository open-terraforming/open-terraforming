import { setSettings } from '@/store/modules/settings'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import { faEyeSlash, faQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled, { css } from 'styled-components'
import { ClippedBox } from '../ClippedBox'

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
					<FontAwesomeIcon icon={faEyeSlash} />
				</Hide>
			)}
			<Icon>
				<FontAwesomeIcon icon={faQuestion} />
			</Icon>
			{message}
		</Help>
	)
}

const Hide = styled.div`
	padding: 0.3rem 0.3rem 0.2rem 0.2rem;
	position: absolute;
	right: 0;
	top: 0;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 0.6;
	font-size: 80%;

	&:hover {
		opacity: 1;
	}
`

const Icon = styled.div`
	position: absolute;
	left: 0;
	top: 0;
	padding: 0.3rem 0.2rem 0.2rem 0.3rem;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: ${({ theme }) => theme.colors.border};
`

const Help = styled(ClippedBox)<{ hasClose: boolean }>`
	margin: 0.5rem auto;
	max-width: 30rem;
	position: relative;

	> .inner {
		padding: 0.5rem;
		padding-left: 1.75rem;

		${(props) =>
			props.hasClose &&
			css`
				padding-right: 2rem;
			`}
	}
`
