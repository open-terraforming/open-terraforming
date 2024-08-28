import { Button } from '@/components'
import { ApiState, setApiState } from '@/store/modules/api'
import { useAppDispatch } from '@/utils/hooks'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export const BackButton = () => {
	const dispatch = useAppDispatch()

	const handleBack = () => {
		dispatch(
			setApiState({
				state: ApiState.Ready,
				gameId: null,
			}),
		)
	}

	return (
		<Button onClick={handleBack} icon={faArrowLeft} schema="transparent">
			Back
		</Button>
	)
}
