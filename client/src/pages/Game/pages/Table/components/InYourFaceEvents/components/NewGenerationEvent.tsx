import { styled } from 'styled-components'
import { NewGeneration } from '../../EventList/types'

type Props = {
	event: NewGeneration
}

export const NewGenerationEvent = ({ event }: Props) => {
	return (
		<Container>
			<Title>New generation</Title>
			<Count>{event.generation}</Count>
		</Container>
	)
}

const Container = styled.div`
	min-height: 20rem;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
`

const Title = styled.div`
	font-size: 125%;
	text-align: center;
	margin: 1rem;
`

const Count = styled.div`
	font-size: 200%;
	text-align: center;
	margin: 1rem;
`
