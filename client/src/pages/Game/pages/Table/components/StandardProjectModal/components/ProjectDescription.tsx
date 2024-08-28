import { StandardProject } from '@shared/projects'
import { StandardProjectType } from '@shared/index'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card } from '@/icons/card'
import { ResourceIcon } from '../../ResourceIcon/ResourceIcon'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

type Props = {
	project: StandardProject
	cost: number
}

const typeToContent = (project: StandardProject, cost: number) => {
	switch (project.type) {
		case StandardProjectType.SellPatents:
			return (
				<>
					<span>X</span>
					<Card />
					<FontAwesomeIcon icon={faArrowRight} />
					<span>X</span>
					<ResourceIcon res={project.resource} size="lg" />
				</>
			)
		case StandardProjectType.PowerPlant:
			return (
				<>
					<span>{cost}</span>
					<ResourceIcon res={project.resource} size="lg" />
					<FontAwesomeIcon icon={faArrowRight} />
					<span>+ 1 energy production</span>
				</>
			)
		case StandardProjectType.Asteroid:
			return (
				<>
					<span>{cost}</span>
					<ResourceIcon res={project.resource} size="lg" />
					<FontAwesomeIcon icon={faArrowRight} />
					<span>+ 1 temperature</span>
				</>
			)
		case StandardProjectType.Aquifer:
			return (
				<>
					<span>{cost}</span>
					<ResourceIcon res={project.resource} size="lg" />
					<FontAwesomeIcon icon={faArrowRight} />
					<span>place an Ocean</span>
				</>
			)
		case StandardProjectType.Greenery:
			return (
				<>
					<span>{cost}</span>
					<ResourceIcon res={project.resource} size="lg" />
					<FontAwesomeIcon icon={faArrowRight} />
					<span>place a Forest</span>
				</>
			)
		case StandardProjectType.City:
			return (
				<>
					<span>{cost}</span>
					<ResourceIcon res={project.resource} size="lg" />
					<FontAwesomeIcon icon={faArrowRight} />
					<div>
						<div>place a City</div>
						<div>+ 1 money production</div>
					</div>
				</>
			)
		case StandardProjectType.AirScrapping:
			return (
				<>
					<span>{cost}</span>
					<ResourceIcon res={project.resource} size="lg" />
					<FontAwesomeIcon icon={faArrowRight} />
					<div>
						<div>+ 1 Venus</div>
					</div>
				</>
			)
		default:
			return <></>
	}
}

export const ProjectDescription = ({ project, cost }: Props) => {
	return <E>{typeToContent(project, cost)}</E>
}

const E = styled.div`
	display: flex;
	align-items: center;

	> * {
		margin: 0 0.25rem;
	}
`
