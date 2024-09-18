import { NewGeneration } from '../../EventList/types'

type Props = {
	event: NewGeneration
}

export const NewGenerationEvent = ({}: Props) => {
	return (
		<>
			<div>New generation</div>
		</>
	)
}
