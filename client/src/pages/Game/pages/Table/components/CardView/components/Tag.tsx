import { useMemo } from 'react'
import { CardCategory } from '@shared/cards'
import styled, { css } from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faPaw,
	faSeedling,
	faAtom,
	faGlobeEurope,
	faArrowDown,
	faBolt,
	faSun,
	faCity,
	faWarehouse,
	faMicroscope,
	faQuestion
} from '@fortawesome/free-solid-svg-icons'
import { Jupiter } from './Jupiter'
import { venusIcon } from '@/icons/venus'

type Props = {
	tag: CardCategory
	size?: 'md' | 'sm'
	className?: string
	onClick?: () => void
}

export const Tag = ({ tag, size = 'md', className, onClick }: Props) => {
	const image = useMemo(() => {
		switch (tag) {
			case CardCategory.Animal:
				return (
					<IconContainer background="#266020">
						<FontAwesomeIcon icon={faPaw} color="#fff" />
					</IconContainer>
				)
			case CardCategory.Plant:
				return (
					<IconContainer background="#09AA09">
						<FontAwesomeIcon icon={faSeedling} color="#fff" />
					</IconContainer>
				)
			case CardCategory.Science:
				return (
					<IconContainer background="#fff">
						<FontAwesomeIcon icon={faAtom} color="#000" />
					</IconContainer>
				)
			case CardCategory.Earth:
				return (
					<IconContainer background="#0F6097">
						<FontAwesomeIcon icon={faGlobeEurope} color="#fff" size="lg" />
					</IconContainer>
				)
			case CardCategory.Event:
				return (
					<IconContainer background="#FFE623">
						<FontAwesomeIcon icon={faArrowDown} color="#000" size="lg" />
					</IconContainer>
				)
			case CardCategory.Power:
				return (
					<IconContainer background="#AE00FF">
						<FontAwesomeIcon icon={faBolt} color="#fff" />
					</IconContainer>
				)
			case CardCategory.Space:
				return (
					<IconContainer background="#000">
						<FontAwesomeIcon icon={faSun} color="#FFFF00" />
					</IconContainer>
				)
			case CardCategory.City:
				return (
					<IconContainer background="#BEBEBE">
						<FontAwesomeIcon icon={faCity} color="#333" />
					</IconContainer>
				)
			case CardCategory.Jupiter:
				return (
					<IconContainer background="transparent">
						<Jupiter />
					</IconContainer>
				)
			case CardCategory.Building:
				return (
					<IconContainer background="#805700">
						<FontAwesomeIcon icon={faWarehouse} color="#493628" />
					</IconContainer>
				)
			case CardCategory.Microbe:
				return (
					<IconContainer background="#BCE444">
						<FontAwesomeIcon icon={faMicroscope} color="#5A703B" />
					</IconContainer>
				)
			case CardCategory.Any:
				return (
					<IconContainer background="#fff">
						<FontAwesomeIcon icon={faQuestion} color="#333" />
					</IconContainer>
				)
			case CardCategory.Venus:
				return (
					<IconContainer background="#5675ad">
						<FontAwesomeIcon icon={venusIcon} color="#fff" />
					</IconContainer>
				)
		}
	}, [tag])

	return (
		<Category
			title={CardCategory[tag]}
			size={size}
			className={className}
			onClick={onClick}
		>
			{image || CardCategory[tag]}
		</Category>
	)
}

const IconContainer = styled.div<{ background: string; size?: Props['size'] }>`
	${props => css`
		background: ${props.background};
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		border-top: 2px solid rgb(221, 221, 221);
		border-left: 2px solid rgb(221, 221, 221);
		border-bottom: 2px solid rgb(137, 137, 137);
		border-right: 2px solid rgb(137, 137, 137);

		overflow: hidden;
	`}
`

const Category = styled.div<{ size?: Props['size'] }>`
	${props =>
		props.size === 'md'
			? css`
					width: 2rem;
					height: 2rem;

					> ${IconContainer} {
						margin-top: -2px;
						margin-left: -2px;
					}
			  `
			: css`
					width: 1.25rem;
					height: 1.25rem;

					font-size: 85%;

					> ${IconContainer} {
						box-sizing: border-box;
					}
			  `}

	img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
`
