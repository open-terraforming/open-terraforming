import { Resource } from '@shared/cards'
import { ResourceIcon } from '../../ResourceIcon/ResourceIcon'
import styled from 'styled-components'

export const ResItem = ({
	res,
	value,
	production,
}: {
	res: Resource
	value: number
	production: number
}) => (
	<InfoItem>
		<Value>
			{value} <ResourceIcon res={res} />
		</Value>
		<Production>
			{production > 0 && '+'}
			{production}
		</Production>
	</InfoItem>
)

const InfoItem = styled.div`
	background-color: ${({ theme }) => theme.colors.background};
	border: 0.2rem solid ${({ theme }) => theme.colors.border};
	border-bottom: 0;
	border-right: 0;

	&:first-child {
		border-left: 0;
	}
`

const Value = styled.div`
	padding: 0.2rem 0.5rem;
	width: 100%;
`

const Production = styled.div`
	background-color: ${({ theme }) => theme.colors.border};
	padding: 0.2rem 0.5rem;
	text-align: center;
	font-size: 85%;
`
