import { ColoniesModal } from '@/pages/Game/pages/Table/components/ColoniesModal/ColoniesModal'
import { ColonyTradeModal } from '@/pages/Game/pages/Table/components/ColoniesModal/components/ColonyTradeModal'
import { CardModal } from '@/pages/Game/pages/Table/components/EventList/components/CardModal'
import { ColonyState } from '@shared/gameState'
import { createContext, ReactNode, useContext, useMemo, useState } from 'react'

type Props = {
	children: ReactNode
}

type TradeWithColonyProps = {
	colony: ColonyState
	colonyIndex: number
}

type GameModalsContextType = {
	openCardModal: (cardCode: string) => void
	openColoniesModal: () => void
	openTradeWithColonyModal: (props: TradeWithColonyProps) => void
}

const GameModalsContext = createContext<GameModalsContextType | null>(null)

export const GameModalsProvider = ({ children }: Props) => {
	const [openedCardModals, setOpenedCardModals] = useState<string[]>([])
	const [showColonies, setColoniesShown] = useState(false)

	const [showTradeWithColony, setTradeWithColonyShown] =
		useState<TradeWithColonyProps>()

	const context = useMemo((): GameModalsContextType => {
		const openCardModal = (cardCode: string) => {
			setOpenedCardModals((prev) => [...prev, cardCode])
		}

		return {
			openCardModal,
			openColoniesModal: () => setColoniesShown(true),
			openTradeWithColonyModal: (props) => setTradeWithColonyShown(props),
		}
	}, [])

	return (
		<GameModalsContext.Provider value={context}>
			{openedCardModals.map((cardCode) => (
				<CardModal
					key={cardCode}
					card={cardCode}
					onClose={() =>
						setOpenedCardModals((prev) => prev.filter((c) => c !== cardCode))
					}
				/>
			))}

			{showColonies && (
				<ColoniesModal onClose={() => setColoniesShown(false)} />
			)}

			{showTradeWithColony && (
				<ColonyTradeModal
					{...showTradeWithColony}
					onClose={() => setTradeWithColonyShown(undefined)}
				/>
			)}

			{children}
		</GameModalsContext.Provider>
	)
}

export const useGameModals = () => {
	const context = useContext(GameModalsContext)

	if (!context) {
		throw new Error('useGameModals must be used within a GameModalsProvider')
	}

	return context
}
