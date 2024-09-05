import { Flex } from '@/components/Flex/Flex'
import { ColoniesLookupApi } from '@shared/colonies/ColoniesLookupApi'
import { ColonyState } from '@shared/game'
import styled from 'styled-components'
import { Symbols } from '../../CardView/components/Symbols'

type Props = {
	colony: ColonyState
}

export const ColonyDisplay = ({ colony }: Props) => {
	const info = ColoniesLookupApi.get(colony.code)

	return (
		<div>
			<div>{info.code}</div>

			<Flex>
				<div>Trade bonus:</div>
				<div>
					<Symbols symbols={info.incomeBonus.symbols} />
				</div>
			</Flex>

			<Flex>
				<div>Trade income:</div>
				<div>
					<Symbols symbols={info.tradeIncome.symbols} />
				</div>
			</Flex>

			<div>Step: {colony.step}</div>

			<Flex>
				{info.tradeIncome.slots.map((s, i) => (
					<Slot key={i}>
						<SlotBonus>
							{info.colonizeBonus[i] && (
								<Symbols symbols={info.colonizeBonus[i].symbols} />
							)}
						</SlotBonus>
						<SlotLabel>
							<Symbols symbols={[s]} />
						</SlotLabel>
					</Slot>
				))}
			</Flex>
		</div>
	)
}

const SlotBonus = styled.div`
	border: 2px solid #aaa;
	border-right-width: 0;
	width: 2.5rem;
	height: 2.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
`

const Slot = styled.div`
	&:last-child ${SlotBonus} {
		border-right-width: 2px;
	}
`

const SlotLabel = styled.div``
