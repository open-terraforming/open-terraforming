import { media } from '@/styles/media'
import { CardType } from '@shared/cards'
import { rgba, lighten, darken } from 'polished'
import styled, { css } from 'styled-components'
import { Symbols } from './components/Symbols'
import mars from '@/assets/mars-icon.png'

export const Head = styled.div`
	display: flex;
	align-items: center;
	height: 2rem;
`

export const HeadSymbols = styled(Symbols)`
	border: 0.2rem solid #ff3333;
	margin-left: 2.5rem;
	background-color: rgba(255, 0, 0, 0.5);

	> div {
		padding-top: 0.1rem;
		padding-bottom: 0.1rem;
	}
`

export const Action = styled.div<{
	$hasSymbols: boolean
	$highlight?: boolean
}>`
	padding: 0.5rem;

	${({ theme, $highlight }) =>
		$highlight
			? css`
					background: ${rgba(lighten(0.05, theme.colors.background), 1)};
					border: 0.2rem solid ${lighten(0.1, theme.colors.border)};
				`
			: css`
					border: 0.1rem solid ${theme.colors.border};
					background: ${rgba(theme.colors.background, 1)};
				`};

	&& {
		margin-bottom: ${({ $hasSymbols }) =>
			$hasSymbols ? '0.25rem' : '0.75rem'};
	}
`

export const ActionTitle = styled.div<{ $highlight?: boolean }>`
	margin-left: auto;
	margin-right: auto;
	width: 5rem;
	margin-top: -1rem;
	text-align: center;
	padding: 0.1rem 0;
	margin-bottom: 0.2rem;

	${({ theme, $highlight }) =>
		$highlight
			? css`
					background: ${rgba(lighten(0.05, theme.colors.background), 1)};
					border: 0.2rem solid ${lighten(0.1, theme.colors.border)};
				`
			: css`
					border: 0.1rem solid ${theme.colors.border};
					background: ${rgba(theme.colors.background, 1)};
				`};
`

export const Cost = styled.div<{ affordable: boolean }>`
	height: 2rem;

	> div {
		background: ${({ theme }) => rgba(theme.colors.background, 1)};

		position: absolute;

		${(props) =>
			props.affordable
				? css`
						border: 2px solid rgb(255, 255, 104);
						color: rgb(255, 255, 104);
					`
				: css`
						border: 2px solid rgba(255, 135, 135, 1);
						color: rgba(255, 135, 135, 1);
					`}

		width: 2.5rem;
		height: 2.5rem;
		line-height: 2.5rem;
		text-align: center;
		border-radius: 4px;
		font-size: 150%;
		float: left;
		margin-top: -0.5rem;
		margin-left: -0.5rem;
	}
`

export const Categories = styled.div`
	margin-left: auto;
	display: flex;
	align-items: center;
`

export const Title = styled.div`
	padding: 0.5rem 0.5rem;
	text-align: center;
	color: #f0f0f0;
	text-transform: uppercase;
	font-size: 100%;
`

export const Description = styled.div`
	padding: 0.5rem 0.5rem 0.5rem 0.5rem;
	overflow: auto;
	min-height: 0;
	flex-grow: 1;
	font-size: 85%;
	text-align: center;

	> div {
		margin-bottom: 0.25rem;
	}
`

export const Played = styled.div`
	color: #f12e41;
`

export const VP = styled.div<{ $corporation?: boolean }>`
	${(props) =>
		props.$corporation
			? css`
					position: absolute;
					top: 2.5rem;
					right: 0.5rem;
				`
			: css`
					clear: both;
					float: right;
					margin-right: 0.1rem;
					margin-top: 0.5rem;
				`}

	border-radius: 50%;
	width: 3rem;
	height: 3rem;
	line-height: 3rem;
	text-align: center;
	font-size: 200%;
	color: #fff;

	border-top: 2px solid rgb(221, 221, 221);
	border-left: 2px solid rgb(221, 221, 221);
	border-bottom: 2px solid rgb(137, 137, 137);
	border-right: 2px solid rgb(137, 137, 137);

	background-image: url('${mars}');
	background-size: 100% 100%;
`

export const Image = styled.div`
	height: 30%;
	background-position: center center;
	background-size: 100% auto;
	background-repeat: no-repeat;
	flex-shrink: 0;
	flex-grow: 0;
`

type ContainerCtx = {
	selected: boolean
	playable: boolean
	played: boolean
	hover: boolean
	type: CardType
	$faded: boolean
}

export const Container = styled.div<ContainerCtx>`
	border: 0.2rem solid
		${(props) =>
			darken(props.$faded ? 0.2 : 0, props.theme.colors.cards[props.type])};
	background: ${({ theme }) => rgba(theme.colors.background, 1)};
	width: 240px;
	flex-shrink: 0;
	min-width: 0;
	height: 350px;
	max-height: 350px;
	overflow: visible;
	margin: 0.5rem 0.5rem;
	display: flex;
	flex-direction: column;
	position: relative;
	overflow: visible;

	${Title} {
		background: ${(props) =>
			darken(props.$faded ? 0.2 : 0, props.theme.colors.cards[props.type])};
	}

	${(props) =>
		props.$faded &&
		css`
			${Categories}, ${Image}, ${Cost} {
				opacity: 0.5;
			}
		`}

	${media.medium} {
		width: 150px;
		height: 200px;
	}

	${(props) =>
		props.type === CardType.Corporation &&
		css`
			width: 300px;
			height: 200px;
			max-height: 200px;
			display: block;

			${Title} {
				float: left;
			}

			${Head} {
				float: right;
			}

			${Description} {
				clear: both;
				max-height: 150px;
			}
		`}

	${(props) =>
		!props.playable
			? css`
					opacity: 0.6;
				`
			: props.hover &&
				css`
					cursor: pointer;
					transition: all 0.1s;

					&:hover {
						/*box-shadow: 0px 0px 3px 3px ${props.theme.colors.border};*/
						transform: scale(1.03);
					}
				`}

	${(props) =>
		props.selected &&
		css`
			background: ${rgba(lighten(0.1)(props.theme.colors.background), 1)};
			box-shadow: 0px 0px 0px 4px #ffffa6;
			transform: scale(1.01);
		`}

	${(props) =>
		props.played &&
		css`
			transform: rotate(1deg);
		`}
`

export const FadedSymbols = styled(Symbols)`
	opacity: 0.5;
`
