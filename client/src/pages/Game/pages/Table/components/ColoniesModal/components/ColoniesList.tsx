import { useAppStore } from '@/utils/hooks'
import styled from 'styled-components'
import { ColonyDisplay } from './ColonyDisplay'

type Props = {
	freeTradePick?: boolean
	freeColonizePick?: boolean
	allowDuplicateColonies?: boolean
	customAction?: (colonyIndex: number) => {
		enabled: boolean
		perform: () => void
		label: string
	}
}

export const ColoniesList = ({
	freeTradePick,
	freeColonizePick,
	allowDuplicateColonies,
	customAction,
}: Props) => {
	const colonies = useAppStore((app) => app.game.state.colonies)

	return (
		<Container>
			{colonies.map((colony, index) => (
				<ColonyDisplay
					key={colony.code}
					index={index}
					colony={colony}
					freeTradePick={freeTradePick}
					freeColonizePick={freeColonizePick}
					allowDuplicateColonies={allowDuplicateColonies}
					customAction={customAction}
				/>
			))}
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
`
