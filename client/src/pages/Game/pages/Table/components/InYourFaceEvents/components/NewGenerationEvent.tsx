import { styled } from 'styled-components'
import { NewGeneration } from '@shared/index'

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
	margin: 3rem 0;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
`

const Title = styled.div`
	font-size: 125%;
	text-align: center;
	margin: 0.5rem 3rem;
`

const Count = styled.div`
	font-size: 200%;
	text-align: center;
	margin: 1rem;
`
