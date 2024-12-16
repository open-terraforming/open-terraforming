import { SymbolType } from '@shared/cards'
import { GridCellContent, StandardProjectType } from '@shared/index'
import { AnyStandardProject } from '@shared/projects'
import styled from 'styled-components'
import { Symbols } from '../../CardView/components/Symbols'

type Props = {
	project: AnyStandardProject
	cost: number
}

const typeToContent = (project: AnyStandardProject, cost: number) => {
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
