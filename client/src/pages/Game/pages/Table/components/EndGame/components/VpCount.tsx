import styled from 'styled-components'
import mars from '@/assets/mars-icon.png'

type Props = {
	count: number
}

export const VpCount = ({ count }: Props) => {
	return <E>{count}</E>
}

const E = styled.div`
	border-radius: 50%;
	width: 1.5rem;
	height: 1.5rem;
	line-height: 1.5rem;
	text-align: center;
	font-size: 100%;
	color: #fff;

	border-top: 2px solid rgb(221, 221, 221);
	border-left: 2px solid rgb(221, 221, 221);
	border-bottom: 2px solid rgb(137, 137, 137);
	border-right: 2px solid rgb(137, 137, 137);

	background-image: url('${mars}');
	background-size: 100% 100%;
`
