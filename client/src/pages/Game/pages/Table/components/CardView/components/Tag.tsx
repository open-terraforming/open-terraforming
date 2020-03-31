import React from 'react'
import { CardCategory } from '@shared/cards'

import tagWild from '@/assets/tag-wild.png'
import tagBuilding from '@/assets/tag-building.png'
import tagSpace from '@/assets/tag-space.png'
import tagPower from '@/assets/tag-power.png'
import tagJovian from '@/assets/tag-jovian.png'
import tagVenus from '@/assets/tag-venus.png'
import tagEarth from '@/assets/tag-earth.png'
import tagCity from '@/assets/tag-city.png'
import tagMicrobe from '@/assets/tag-microbe.png'
import tagPlant from '@/assets/tag-plant.png'
import tagAnimal from '@/assets/tag-animal.png'
import tagEvent from '@/assets/tag-event.png'
import tagScience from '@/assets/tag-science.png'
import tagNone from '@/assets/tag-none.png'
import styled from 'styled-components'

const categoryToImage = {
	[CardCategory.Building]: tagBuilding,
	[CardCategory.Space]: tagSpace,
	[CardCategory.Power]: tagPower,
	[CardCategory.Jupiter]: tagJovian,
	[CardCategory.Earth]: tagEarth,
	[CardCategory.City]: tagCity,
	[CardCategory.Microbe]: tagMicrobe,
	[CardCategory.Plant]: tagPlant,
	[CardCategory.Animal]: tagAnimal,
	[CardCategory.Event]: tagEvent,
	[CardCategory.Science]: tagScience
} as const

type Props = {
	tag: CardCategory
}

export const Tag = ({ tag }: Props) => {
	return (
		<Category title={CardCategory[tag]}>
			<img src={categoryToImage[tag]} />
		</Category>
	)
}

const Category = styled.div`
	margin-right: 0.5rem;
	width: 2rem;
	height: 2rem;
	border-radius: 50%;
	overflow: hidden;

	img {
		width: 100%;
		height: 100%;
	}
`
