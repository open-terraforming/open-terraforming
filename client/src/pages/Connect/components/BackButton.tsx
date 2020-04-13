import React from 'react'
import { useAppDispatch } from '@/utils/hooks'
import { setApiState, ApiState } from '@/store/modules/api'
import { Button } from '@/components'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

type Props = {}

export const BackButton = ({}: Props) => {
	const dispatch = useAppDispatch()

	const handleBack = () => {
		dispatch(
			setApiState({
				state: ApiState.Ready,
				gameId: null
			})
		)
	}

	return (
		<Button onClick={handleBack} icon={faArrowLeft} schema="transparent">
			Back
		</Button>
	)
}
