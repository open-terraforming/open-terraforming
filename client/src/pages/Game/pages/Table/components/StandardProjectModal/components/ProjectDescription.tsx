import React from 'react'
import { StandardProject } from '@shared/projects'
import { StandardProjectType } from '@shared/index'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { cardIcon, Card } from '@/icons/card'
import { ResourceIcon } from '../../ResourceIcon/ResourceIcon'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

type Props = {
	project: StandardProject
}

const typeToContent = (project: StandardProject) => {
	switch (project.type) {
		case StandardProjectType.SellPatents:
			return (
				<>
					<span>X</span>
					<Card />
					<FontAwesomeIcon icon={faArrowRight} />
					<span>X</span>
					<ResourceIcon res="money" size="lg" />
				</>
			)
		case StandardProjectType.PowerPlant:
			return (
				<>
					<span>{project.cost}</span>
					<ResourceIcon res="money" size="lg" />
					<FontAwesomeIcon icon={faArrowRight} />
					<span>+ 1 energy production</span>
				</>
			)
		case StandardProjectType.Asteroid:
			return (
				<>
					<span>{project.cost}</span>
					<ResourceIcon res="money" size="lg" />
					<FontAwesomeIcon icon={faArrowRight} />
					<span>+ 1 temperature</span>
				</>
			)
		case StandardProjectType.Aquifer:
			return (
				<>
					<span>{project.cost}</span>
					<ResourceIcon res="money" size="lg" />
					<FontAwesomeIcon icon={faArrowRight} />
					<span>place an Ocean</span>
				</>
			)
		case StandardProjectType.Greenery:
			return (
				<>
					<span>{project.cost}</span>
					<ResourceIcon res="money" size="lg" />
					<FontAwesomeIcon icon={faArrowRight} />
					<span>place a Forest</span>
				</>
			)
		case StandardProjectType.City:
			return (
				<>
					<span>{project.cost}</span>
					<ResourceIcon res="money" size="lg" />
					<FontAwesomeIcon icon={faArrowRight} />
					<div>
						<div>place a City</div>
						<div>+ 1 money production</div>
					</div>
				</>
			)
		default:
			return <></>
	}
}

export const ProjectDescription = ({ project }: Props) => {
	return <E>{typeToContent(project)}</E>
}

const E = styled.div`
	display: flex;
	align-items: center;

	> * {
		margin: 0 0.25rem;
	}
`
