import { Modal } from '@/components/Modal/Modal'
import React from 'react'
import { CheatsResources } from './components/CheatsResources'
import { CheatsProduction } from './components/CheatsProduction'
import { CheatsProgress } from './components/CheatsProgress'
import { CheatsCards } from './components/CheatsCards'
import { CheatsCorporation } from './components/CheatsCorporation'

type Props = {
	open: boolean
	onClose: () => void
}

export const CheatsModal = ({ open, onClose }: Props) => {
	return (
		<Modal header="Cheats" open={open} onClose={onClose}>
			<CheatsProgress />

			<CheatsCards />
			<CheatsCorporation />
			<CheatsResources />
			<CheatsProduction />
		</Modal>
	)
}
