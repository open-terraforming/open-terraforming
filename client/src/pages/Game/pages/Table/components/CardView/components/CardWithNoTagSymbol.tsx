import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { styled } from 'styled-components'

export const CardWithNoTagSymbol = () => {
	return (
		<Container>
			<FontAwesomeIcon icon={faTimes} />
		</Container>
	)
}

const Container = styled.div`
	width: 1rem;
	height: 1rem;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 125%;
	background: #eee;
	color: #333;
`
