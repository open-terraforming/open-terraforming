import React, { useMemo } from 'react'
import { Resource } from '@shared/cards'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { resourceColors } from '@/styles/resourceColors'
import {
	faHammer,
	faStar,
	faSeedling,
	faBolt,
	faFire,
	faDollarSign
} from '@fortawesome/free-solid-svg-icons'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'
import styled, { css } from 'styled-components'

type Props = {
	res: Resource
	size?: SizeProp
	production?: boolean
}

export const ResourceIcon = ({ res, size, production }: Props) => {
	const icon = useMemo(() => {
		switch (res) {
			case 'money':
				return (
					<FontAwesomeIcon
						icon={faDollarSign}
						color={resourceColors.money}
						size={size}
					/>
				)

			case 'ore':
				return (
					<FontAwesomeIcon
						icon={faHammer}
						color={resourceColors.ore}
						size={size}
					/>
				)

			case 'titan':
				return (
					<FontAwesomeIcon
						icon={faStar}
						color={resourceColors.titan}
						size={size}
					/>
				)

			case 'plants':
				return (
					<FontAwesomeIcon
						icon={faSeedling}
						color={resourceColors.plants}
						size={size}
					/>
				)

			case 'energy':
				return (
					<FontAwesomeIcon
						icon={faBolt}
						color={resourceColors.energy}
						size={size}
					/>
				)

			case 'heat':
				return (
					<FontAwesomeIcon
						icon={faFire}
						color={resourceColors.heat}
						size={size}
					/>
				)
		}
	}, [res, size])

	return <E production={production}>{icon}</E>
}

const E = styled.div<{ production?: boolean }>`
	display: inline-block;

	${props =>
		props.production &&
		css`
			border: 2px solid #ff6262;
			padding: 0.1rem;
		`}
`
