import { ClippedBox } from '@/components/ClippedBox'
import { styled } from 'styled-components'

export const EmptyGlobalEventView = () => {
	return (
		<Container>
			<Inner>NONE</Inner>
		</Container>
	)
}

const Container = styled(ClippedBox)`
	width: 200px;
`

const Inner = styled.div`
	padding: 45px 0px;
	text-align: center;
	font-size: 175%;
	color: ${({ theme }) => theme.colors.border};
`
