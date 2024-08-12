import { useLocale } from '@/context/LocaleContext'
import { StatelessCardView } from '@/pages/Game/pages/Table/components/CardView/StatelessCardView'
import { CardCategory, CardsLookupApi, CardSpecial } from '@shared/cards'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useDebouncedValue } from '../../utils/useDebouncedValue'
import { Flex } from '../Flex/Flex'
import { Modal } from '../Modal/Modal'
import { CardsSpecialFilter } from './components/CardsSpecialFilter'
import { CardsTagsFilter } from './components/CardsTagsFilter'
import { media } from '@/styles/media'

type Props = {
	onClose: () => void
}

export const CardsViewer = ({ onClose }: Props) => {
	const locale = useLocale()
	const [search, setSearch] = useState('')
	const [tags, setTags] = useState<CardCategory[]>([])
	const [specials, setSpecials] = useState<CardSpecial[]>([])

	const debouncedSearch = useDebouncedValue(search, 100)

	const allCards = useMemo(() => Object.values(CardsLookupApi.data()), [])

	const filteredCards = useMemo(
		() =>
			allCards.filter(card => {
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
					!card.categories.some(cat => tags.includes(cat))
				) {
					return false
				}

				if (
					specials.length > 0 &&
					!card.special.some(s => specials.includes(s))
				) {
					return false
				}

				return true
			}),
		[allCards, debouncedSearch, tags, specials]
	)

	return (
		<Modal
			open
			header="Cards Viewer"
			onClose={onClose}
			contentStyle={{ minWidth: '1100px', maxWidth: '1100px' }}
		>
			<StyledFlex>
				<div style={{ flex: 1, marginRight: '2rem' }}>
					<SearchField
						type="text"
						placeholder="Search"
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>
				</div>

				<div>
					<CardsTagsFilter tags={tags} setTags={setTags} />

					<CardsSpecialFilter specials={specials} setSpecials={setSpecials} />
				</div>
			</StyledFlex>

			<StyledContainer>
				{filteredCards.map(card => (
					<StatelessCardView
						key={card.code}
						card={card}
						affordable={true}
						isPlayable={true}
						hover={false}
					/>
				))}
			</StyledContainer>
		</Modal>
	)
}

const StyledContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
`

const SearchField = styled.input`
	width: 100%;
	box-sizing: border-box;
`

const StyledFlex = styled(Flex)`
	${media.medium} {
		flex-direction: column;
	}
`
