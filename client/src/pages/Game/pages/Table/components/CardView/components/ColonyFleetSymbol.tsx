import { faSpaceShuttle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'

export const ColonyFleetSymbol = () => {
	return (
		<Container>
			<Icon>
				<FontAwesomeIcon icon={faSpaceShuttle} />
			</Icon>
			<Background />
		</Container>
	)
}

const Container = styled.div`
	position: relative;
	width: 1.8em;
	height: 1.8em;
	color: #333;
	display: flex;
	justify-content: center;
	align-items: center;
`

const Icon = styled.div`
	position: relative;
	z-index: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 0.1em;
	font-size: 80%;
	transform: rotate(-90deg);
`

const Background = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 0;
	height: 0;
	border-left: 0.9em solid transparent;
	border-right: 0.9em solid transparent;
	border-bottom: 1.5em solid #eee;
`
