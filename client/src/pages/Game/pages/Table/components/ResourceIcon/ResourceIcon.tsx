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

type Props = {
	res: Resource
}

export const ResourceIcon = ({ res }: Props) => {
	switch (res) {
		case 'money':
			return <FontAwesomeIcon icon={faMoneyBill} color={resourceColors.money} />

		case 'ore':
			return <FontAwesomeIcon icon={faHammer} color={resourceColors.ore} />

		case 'titan':
			return <FontAwesomeIcon icon={faStar} color={resourceColors.titan} />

		case 'plants':
			return <FontAwesomeIcon icon={faSeedling} color={resourceColors.plants} />

		case 'energy':
			return <FontAwesomeIcon icon={faBolt} color={resourceColors.energy} />

		case 'heat':
			return <FontAwesomeIcon icon={faFire} color={resourceColors.heat} />
	}
}
