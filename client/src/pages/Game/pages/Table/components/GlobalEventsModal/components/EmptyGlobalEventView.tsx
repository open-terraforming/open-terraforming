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
	flex: 1;

	.inner {
		height: 100%;
	}
`

const Inner = styled.div`
	text-align: center;
	font-size: 175%;
	color: ${({ theme }) => theme.colors.border};
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
`
