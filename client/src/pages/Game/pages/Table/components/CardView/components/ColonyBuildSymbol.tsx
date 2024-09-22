import { faBuilding } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'

export const ColonyBuildSymbol = () => {
	return (
		<Container>
			<Icon>
				<FontAwesomeIcon icon={faBuilding} />
			</Icon>
			<Background />
		</Container>
	)
}

const Container = styled.div`
	position: relative;
	width: 1.7em;
	height: 1.5em;
	color: #fff;
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
	margin-top: 0.5em;
	font-size: 80%;
`

const Background = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 0;
	height: 0;
	border-left: 0.9em solid transparent;
	border-right: 0.9em solid transparent;
	border-bottom: 1.5em solid #555;
`
