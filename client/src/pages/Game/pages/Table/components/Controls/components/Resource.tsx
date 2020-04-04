import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { popOut } from '@/styles/animations'
import { colors } from '@/styles'

export const Resource = ({
	name,
	value = 0,
	production = 0
}: {
	name: string
	value: number | undefined
	production: number | undefined
}) => {
	const [lastValue, setLastValue] = useState(value)
	const [lastProduction, setLastProduction] = useState(production)
	const [valueDiff, setValueDiff] = useState(0)
	const [productionDiff, setProductionDiff] = useState(0)

	useEffect(() => {
		const diff = value - lastValue
		setLastValue(lastValue)
		setValueDiff(diff)

		if (diff !== 0) {
			setTimeout(() => {
				setValueDiff(0)
			}, 500)
		}
	}, [value])

	useEffect(() => {
		const diff = production - lastProduction
		setLastProduction(lastProduction)
		setProductionDiff(diff)

		if (diff !== 0) {
			setTimeout(() => {
				setProductionDiff(0)
			}, 500)
		}
	}, [production])

	return (
		<Container>
			<Name>{name}</Name>
			<Value>{value}</Value>
			<Production negative={production < 0}>
				{production >= 0 ? `+${production}` : production}
			</Production>
			{valueDiff !== 0 && <DiffAnim positive={valueDiff > 0} />}
			{productionDiff !== 0 && <DiffAnim positive={productionDiff > 0} />}
		</Container>
	)
}

const Container = styled.div`
	border-right: 0.2rem solid ${colors.background};
	position: relative;
	width: 3.5rem;
`

const Name = styled.div`
	text-align: center;
	background: ${colors.background};
	padding: 0.2rem 0.5rem;
`

const Value = styled.div`
	text-align: center;
	font-size: 150%;
	padding: 0.2rem 0.5rem;
`

const Production = styled.div<{ negative: boolean }>`
	text-align: center;
	padding: 0.2rem 0.5rem;
	background: ${colors.background};

	${props =>
		props.negative &&
		css`
			color: #ff979e;
			font-weight: bold;
		`}
`

const DiffAnim = styled.div<{ positive: boolean }>`
	position: absolute;
	height: 0;
	padding-bottom: 100%;
	left: 0;
	top: 0;
	right: 0;
	background: ${props => (props.positive ? '#fff' : '#FF2F3F')};
	animation-name: ${popOut};
	animation-duration: 200ms;
	animation-timing-function: ease-in;
	opacity: 0;
	border-radius: 50%;
`
