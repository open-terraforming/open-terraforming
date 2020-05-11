import React, { useMemo } from 'react'
import { Resource } from '@shared/cards'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { resourceColors } from '@/styles/resource-colors'
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
import { readableColor } from 'polished'

type Props = {
	res: Resource
	size?: SizeProp
	production?: boolean
	fixedWidth?: boolean
	margin?: boolean
}

export const ResourceIcon = ({
	res,
	size,
	production,
	fixedWidth,
	margin
}: Props) => {
	const icon = useMemo(() => {
		switch (res) {
			case 'money':
				return (
					<FontAwesomeIcon
						icon={faDollarSign}
						size={size}
						fixedWidth={fixedWidth}
					/>
				)

			case 'ore':
				return (
					<FontAwesomeIcon
						icon={faHammer}
						size={size}
						fixedWidth={fixedWidth}
					/>
				)

			case 'titan':
				return (
					<FontAwesomeIcon icon={faStar} size={size} fixedWidth={fixedWidth} />
				)

			case 'plants':
				return (
					<FontAwesomeIcon
						icon={faSeedling}
						size={size}
						fixedWidth={fixedWidth}
					/>
				)

			case 'energy':
				return (
					<FontAwesomeIcon icon={faBolt} size={size} fixedWidth={fixedWidth} />
				)

			case 'heat':
				return (
					<FontAwesomeIcon icon={faFire} size={size} fixedWidth={fixedWidth} />
				)
		}
	}, [res, size])

	return (
		<E production={production} res={res} margin={margin}>
			{icon}
		</E>
	)
}

const E = styled.div<{ production?: boolean; res: Resource; margin?: boolean }>`
	display: inline-block;

	${props =>
		props.margin &&
		css`
			margin: 0 0.3rem;
		`}

	${props =>
		props.production
			? css`
					background: ${resourceColors[props.res]};
					color: ${readableColor(resourceColors[props.res])};
					border-radius: 50%;
					width: 1.25em;
					height: 1.25em;
					display: inline-flex;
					justify-content: center;
					align-items: center;

					svg {
						width: 0.8em !important;
						height: 0.8em !important;
					}
			  `
			: css`
					color: ${resourceColors[props.res]};
			  `}
`
