import React from 'react'
import styled from 'styled-components'

export const Resource = ({
	name,
	value = 0,
	production = 0
}: {
	name: string
	value: number | undefined
	production: number | undefined
}) => {
	return (
		<Container>
			<Name>{name}</Name>
			<Value>{value}</Value>
			<Production>{production >= 0 ? `+${production}` : production}</Production>
		</Container>
	)
}

const Container = styled.div`
	border-right: 0.2rem solid rgba(14, 129, 214, 0.8);
`

const Name = styled.div`
	text-align: center;
	background: rgba(14, 129, 214, 0.8);
	padding: 0.2rem 0.5rem;
`

const Value = styled.div`
	text-align: center;
	font-size: 150%;
	padding: 0.2rem 0.5rem;
`

const Production = styled.div`
	text-align: center;
	padding: 0.2rem 0.5rem;
`
