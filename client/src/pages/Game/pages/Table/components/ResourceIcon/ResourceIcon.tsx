import React from 'react'
import { Resource } from '@shared/cards'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { resourceColors } from '@/styles/resourceColors'
import {
	faMoneyBill,
	faHammer,
	faStar,
	faSeedling,
	faBolt,
	faFire
} from '@fortawesome/free-solid-svg-icons'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'

type Props = {
	res: Resource
	size?: SizeProp
}

export const ResourceIcon = ({ res, size }: Props) => {
	switch (res) {
		case 'money':
			return (
				<FontAwesomeIcon
					icon={faMoneyBill}
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
}
