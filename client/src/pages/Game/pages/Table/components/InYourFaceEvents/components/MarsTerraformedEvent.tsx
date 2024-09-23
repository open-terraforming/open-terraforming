import { Mars } from '@/components/Mars/Mars'
import { styled } from 'styled-components'

export const MarsTerraformedEvent = () => {
	return (
		<BigTitle>
			<Mars />
			<div>Mars terraformed!</div>
		</BigTitle>
	)
}

const BigTitle = styled.div`
	font-size: 175%;
	font-weight: bold;
	text-transform: uppercase;
	margin: 2rem 0;
	text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
`
