import { useLocale } from '@/context/LocaleContext'
import { StatelessCardView } from '@/pages/Game/pages/Table/components/CardView/StatelessCardView'
import { media } from '@/styles/media'
import { useAppStore } from '@/utils/hooks'
import {
	CardCategory,
	CardsLookupApi,
	CardSpecial,
	CardType,
} from '@shared/cards'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useDebouncedValue } from '../../utils/useDebouncedValue'
import { Flex } from '../Flex/Flex'
import { Modal } from '../Modal/Modal'
import { CardsSpecialFilter } from './components/CardsSpecialFilter'
import { CardsTagsFilter } from './components/CardsTagsFilter'
import { CardsTypeFilter } from './components/CardsTypeFilter'
import { CardCheatAddModal } from './components/CardCheatAddModal'
import { darkStripedBackground } from '@/styles/mixins'

type Props = {
	onClose: () => void
}

export const CardsViewer = ({ onClose }: Props) => {
	const locale = useLocale()
	const [search, setSearch] = useState('')
	const [tags, setTags] = useState<CardCategory[]>([])
	const [specials, setSpecials] = useState<CardSpecial[]>([])
	const [types, setTypes] = useState<CardType[]>([])
	const [cheatAddCardCode, setCheatAddCardCode] = useState<string>()

	const player = useAppStore((state) => state.game.player)
	const isAdmin = player.admin

	const debouncedSearch = useDebouncedValue(search, 100)

	const allCards = useMemo(() => Object.values(CardsLookupApi.data()), [])

	const filteredCards = useMemo(
		() =>
			allCards
				.filter((card) => {
					if (
						debouncedSearch.length > 0 &&
						!locale.cards[card.code]
							.toLowerCase()
							.includes(debouncedSearch.toLowerCase())
					) {
						return false
					}

					if (
						tags.length > 0 &&
						!card.categories.some((cat) => tags.includes(cat))
					) {
						return false
					}

					if (
						specials.length > 0 &&
						!card.special.some((s) => specials.includes(s))
					) {
						return false
					}

					if (types.length > 0 && !types.includes(card.type)) {
						return false
					}

					return true
				})
				.sort((a, b) => {
					const typeToScore = (type: CardType) => {
						switch (type) {
							case CardType.Corporation:
								return 0
							case CardType.Prelude:
								return 1
							default:
								return 2
						}
					}

					const aTypeScore = typeToScore(a.type)
					const bTypeScore = typeToScore(b.type)

					const diff = bTypeScore - aTypeScore

					if (diff !== 0) {
						return diff
					}

					return locale.cards[a.code].localeCompare(locale.cards[b.code])
				}),
		[allCards, debouncedSearch, tags, specials, types],
	)

	const handleCardClick = (code: string) => {
		if (!isAdmin) {
			return
		}

		setCheatAddCardCode(code)
	}

	return (
		<Modal
			open
			header={'Cards viewer'}
			onClose={onClose}
			contentStyle={{ minWidth: '1100px', maxWidth: '1100px' }}
			headerStyle={{ borderBottom: 'none' }}
			bodyStyle={{
				padding: 0,
				display: 'flex',
				flexDirection: 'column',
				overflow: 'auto',
			}}
		>
			{cheatAddCardCode && (
				<CardCheatAddModal
					code={cheatAddCardCode}
					onClose={() => setCheatAddCardCode(undefined)}
				/>
			)}

			<StyledFlex gap="1.5rem">
				<div style={{ flex: 1 }}>
					<SearchField
						type="text"
						placeholder="Search"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>

					<CardsTypeFilter types={types} setTypes={setTypes} />
				</div>

				<div>
					<CardsTagsFilter tags={tags} setTags={setTags} />

					<CardsSpecialFilter specials={specials} setSpecials={setSpecials} />
				</div>
			</StyledFlex>

			<StyledContainer>
				{filteredCards.map((card) => (
					<StatelessCardView
						key={card.code}
						card={card}
						affordable={true}
						isPlayable={true}
						evaluate={false}
						onClick={isAdmin ? () => handleCardClick(card.code) : undefined}
					/>
				))}
			</StyledContainer>
		</Modal>
	)
}

const StyledContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	flex: 1;
	overflow: auto;
	padding: 1rem;
`

const SearchField = styled.input`
	width: 100%;
	box-sizing: border-box;
`

const StyledFlex = styled(Flex)`
	flex-grow: 0;
	flex-shrink: 0;
	padding: 0.25rem 1rem;
	border-bottom: 2px solid ${({ theme }) => theme.colors.border};

	${darkStripedBackground}

	${media.medium} {
		flex-direction: column;
	}
`
