import { ClippedBox } from '@/components/ClippedBox'
import { GlobalEvent } from '@shared/expansions/turmoil/globalEvent'
import { Symbols } from '../../CardView/components/Symbols'
import { styled } from 'styled-components'
import { useLocale } from '@/context/LocaleContext'

type Props = {
	globalEvent: GlobalEvent
}

export const GlobalEventView = ({ globalEvent }: Props) => {
	const t = useLocale()

	return (
		<Container>
			<Title>{t.globalEvents[globalEvent.code]}</Title>
			<Inner>
				<div>On reveal: + {globalEvent.initialDelegate} delegate</div>
				<div>On resolve: + {globalEvent.effectDelegate} delegate</div>
				<div>
					{globalEvent.effects.map((effect, index) => (
						<div key={index}>
							<Symbols symbols={effect.symbols} />
							{effect.description}
						</div>
					))}
				</div>
			</Inner>
		</Container>
	)
}

const Container = styled(ClippedBox)`
	width: 200px;
`

const Inner = styled.div`
	padding: 5px;
	text-align: center;
`

const Title = styled.div`
	background-color: ${({ theme }) => theme.colors.border};
	padding: 5px;
`
