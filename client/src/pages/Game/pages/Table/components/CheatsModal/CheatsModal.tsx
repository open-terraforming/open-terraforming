import { Modal } from '@/components/Modal/Modal'
import { CheatsResources } from './components/CheatsResources'
import { CheatsProduction } from './components/CheatsProduction'
import { CheatsProgress } from './components/CheatsProgress'
import { CheatsCards } from './components/CheatsCards'
import { CheatsCorporation } from './components/CheatsCorporation'
import { CheatsCardResources } from './components/CheatsCardResources'
import { CheatsCardPlayed } from './components/CheatsCardPlayed'
import { CheatsColonyTradeStep } from './components/CheatsColonyTradeStep'

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
			<CheatsCardResources />
			<CheatsCardPlayed />
			<CheatsColonyTradeStep />
		</Modal>
	)
}
