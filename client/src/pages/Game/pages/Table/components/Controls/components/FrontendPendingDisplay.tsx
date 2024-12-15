import { Button } from '@/components'
import { popFrontendAction } from '@/store/modules/table'
import {
	FrontendPendingAction,
	FrontendPendingActionType,
} from '@/store/modules/table/frontendActions'
import { useAppDispatch } from '@/utils/hooks'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { rgba } from 'polished'
import { useMemo } from 'react'
import styled from 'styled-components'

type Props = {
	pending: FrontendPendingAction
}

export const FrontendPendingDisplay = ({ pending }: Props) => {
	const dispatch = useAppDispatch()

	const text = useMemo(() => {
		switch (pending.type) {
			case FrontendPendingActionType.PickHandCards:
				return 'Picking cards'
			case FrontendPendingActionType.PickTile:
				return 'Placing tile'
		}
	}, [pending])

	const cancel = () => {
		dispatch(popFrontendAction())
	}

	return (
		<Fade>
			<Info>{text}</Info>
			<Button schema="transparent" onClick={cancel} icon={faTimes}>
				Cancel
			</Button>
		</Fade>
	)
}

const Fade = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: ${({ theme }) => rgba(theme.colors.background, 0.8)};
	z-index: 5;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: row;
`

const Info = styled.div`
	font-size: 125%;
	font-weight: bold;
	color: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
`
