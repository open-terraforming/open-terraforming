import { colors } from '@/styles'
import { Resource as Res } from '@shared/cards'
import React, { useEffect, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { ResourceIcon } from '../../../../ResourceIcon/ResourceIcon'
import { useAnimatedNumber } from '@/utils/hooks'

export const Resource = ({
	name,
	res,
	value = 0,
	production = 0
}: {
	name: string
	res: Res
	value: number | undefined
	production: number | undefined
}) => {
	const [lastValue, setLastValue] = useState(value)
	const [lastProduction, setLastProduction] = useState(production)
	const [valueDiff, setValueDiff] = useState(0)
	const [productionDiff, setProductionDiff] = useState(0)
	const valueDisplay = useAnimatedNumber(value, 500)
	const productionDisplay = useAnimatedNumber(production, 500)

	useEffect(() => {
		const diff = value - lastValue
		setLastValue(value)
		setValueDiff(diff)

		if (diff !== 0) {
			setTimeout(() => {
				setValueDiff(0)
			}, 1500)
		}
	}, [value])

	useEffect(() => {
		const diff = production - lastProduction
		setLastProduction(production)
		setProductionDiff(diff)

		if (diff !== 0) {
			setTimeout(() => {
				setProductionDiff(0)
			}, 1500)
		}
	}, [production])

	return (
		<Container diffAnim={productionDiff !== 0 || valueDiff !== 0}>
			<Value title={name}>
				{valueDisplay} <ResourceIcon res={res} />
			</Value>
			<Production negative={production < 0}>
				{production >= 0 ? `+${productionDisplay}` : productionDisplay}
			</Production>
			{valueDiff !== 0 && (
				<DiffAnim positive={valueDiff > 0}>
					{valueDiff > 0 ? `+${valueDiff}` : valueDiff}
					<ResourceIcon res={res} />
				</DiffAnim>
			)}
			{productionDiff !== 0 && (
				<DiffAnim positive={productionDiff > 0}>
					{productionDiff > 0 ? `+${productionDiff}` : productionDiff}
					<ResourceIcon res={res} production />
				</DiffAnim>
			)}
		</Container>
	)
}

const popOut = keyframes`
	0% {
		opacity: 0;
		transform: translate(0, 0);
	}
	75% {
		opacity: 1;
		transform: translate(0, -10rem);
	}
	90% {
		opacity: 1;
		transform: translate(0, -10rem);
	}
	100% {
		opacity: 0;
		transform: translate(0, -10rem);
	}
`

const popIn = keyframes`
	0% {
		opacity: 0;
		transform: translate(0, -10rem);
	}
	50% {
		opacity: 1;
		transform: translate(0, -10rem);
	}
	90% {
		opacity: 0.6;
		transform: translate(0, -0.5rem);
	}
	100% {
		opacity: 0;
		transform: translate(0, -0.5rem);
	}
`

const Container = styled.div<{ diffAnim: boolean }>`
	border-right: 0.2rem solid ${colors.border};
	position: relative;
	flex: 1;

	z-index: 3;
	width: 3.5rem;
	transition: background-color 0.2s;
	height: 100%;
	display: flex;
	flex-direction: column;

	&:first-child {
		border-left: 0.2rem solid ${colors.border};
	}
`

const Value = styled.div`
	text-align: center;
	font-size: 150%;
	padding: 0.2rem 0.5rem;
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	flex: 1;
`

const Production = styled.div<{ negative: boolean }>`
	text-align: center;
	padding: 0.2rem 0.5rem;
	background: ${colors.border};

	${props =>
		props.negative &&
		css`
			color: #ff979e;
			font-weight: bold;
		`}
`

const DiffAnim = styled.div<{ positive: boolean }>`
	position: absolute;
	z-index: 3;
	left: 0;
	top: 0;
	animation-name: ${props => (props.positive ? popIn : popOut)};
	animation-duration: 1500ms;
	animation-timing-function: ease-out;
	opacity: 0;
	color: #fff;
	text-align: center;
	font-size: 150%;
	display: flex;
	align-items: center;
`
