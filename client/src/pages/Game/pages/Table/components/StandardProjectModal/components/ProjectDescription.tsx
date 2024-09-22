import { StandardProject } from '@shared/projects'
import { GridCellContent, StandardProjectType } from '@shared/index'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card } from '@/icons/card'
import { ResourceIcon } from '../../ResourceIcon/ResourceIcon'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Symbols } from '../../CardView/components/Symbols'
import { SymbolType } from '@shared/cards'

type Props = {
	project: StandardProject
	cost: number
}

const typeToContent = (project: StandardProject, cost: number) => {
	switch (project.type) {
		case StandardProjectType.SellPatents:
			return (
				<>
					<CostE>
						<Symbols
							symbols={[
								{ symbol: SymbolType.X, noRightSpacing: true },
								{ symbol: SymbolType.Card },
							]}
						/>
					</CostE>
					<Symbols
						symbols={[
							{ symbol: SymbolType.RightArrow },
							{ symbol: SymbolType.X, noRightSpacing: true },
							{ resource: 'money' },
						]}
					/>
				</>
			)
		case StandardProjectType.PowerPlant:
			return (
				<>
					<CostE>
						<Symbols symbols={[{ resource: 'money', count: cost }]} />
					</CostE>
					<Symbols
						symbols={[
							{ symbol: SymbolType.RightArrow },
							{
								resource: 'energy',
								production: true,
								count: 1,
								forceCount: true,
								forceSign: true,
							},
						]}
					/>
				</>
			)
		case StandardProjectType.Asteroid:
			return (
				<>
					<CostE>
						<Symbols symbols={[{ resource: 'money', count: cost }]} />
					</CostE>
					<Symbols
						symbols={[
							{ symbol: SymbolType.RightArrow },
							{ symbol: SymbolType.Temperature, count: 1 },
						]}
					/>
				</>
			)
		case StandardProjectType.Aquifer:
			return (
				<>
					<CostE>
						<Symbols symbols={[{ resource: 'money', count: cost }]} />
					</CostE>
					<Symbols
						symbols={[
							{ symbol: SymbolType.RightArrow },
							{ tile: GridCellContent.Ocean, title: 'Place a Ocean' },
						]}
					/>
				</>
			)
		case StandardProjectType.Greenery:
			return (
				<>
					<CostE>
						<Symbols symbols={[{ resource: 'money', count: cost }]} />
					</CostE>
					<Symbols
						symbols={[
							{ symbol: SymbolType.RightArrow },
							{ tile: GridCellContent.Forest, title: 'Place a Forest' },
						]}
					/>
				</>
			)
		case StandardProjectType.City:
			return (
				<>
					<CostE>
						<Symbols symbols={[{ resource: 'money', count: cost }]} />
					</CostE>
					<Symbols
						symbols={[
							{ symbol: SymbolType.RightArrow },
							{ tile: GridCellContent.City, title: 'Place a City' },
							{
								resource: 'money',
								production: true,
								count: 1,
								forceCount: true,
								forceSign: true,
							},
						]}
					/>
				</>
			)
		case StandardProjectType.AirScrapping:
			return (
				<>
					<CostE>
						<Symbols symbols={[{ resource: 'money', count: cost }]} />
					</CostE>
					<Symbols
						symbols={[
							{ symbol: SymbolType.RightArrow },
							{ symbol: SymbolType.Venus, count: 1, forceSign: true },
						]}
					/>
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
	height: 1.5rem;
`

const CostE = styled.div`
	width: 3rem;
`
