import mars from '@/assets/mars-icon.png'
import { media } from '@/styles/media'
import { CardType } from '@shared/cards'
import { darken, lighten, rgba } from 'polished'
import styled, { css, keyframes } from 'styled-components'
import { Symbols } from './components/Symbols'

export const Head = styled.div`
	display: flex;
	align-items: center;
	height: 2rem;
	position: relative;

	&::before {
		content: '';
		position: absolute;
		inset: 0;
		background: ${({ theme }) => rgba(theme.colors.background, 1)};
		clip-path: polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 0 100%);
	}
`

export const HeadSymbols = styled(Symbols)<{ $ok?: boolean }>`
	border: 0.2rem solid ${({ $ok }) => ($ok ? '#225e34' : '#ff3333')};
	margin-left: 0.2rem;
	background-color: ${({ $ok }) =>
		$ok ? rgba(0, 255, 0, 0.1) : 'rgba(255, 0, 0, 0.5)'};

	> div {
		padding-top: 0.1rem;
		padding-bottom: 0.1rem;
	}

	position: relative;
	z-index: 2;
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
					animation-name: ${actionPop};
					animation-duration: 0.5s;
					animation-iteration-count: 1;
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

const actionPop = keyframes`
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.05);
	}
	100% {
		transform: scale(1);
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

const CostBase = styled.div`
	background: ${({ theme }) => rgba(theme.colors.background, 1)};
	width: 2.5rem;
	height: 2.5rem;
	line-height: 2.5rem;
	text-align: center;
	border-radius: 4px;
	font-size: 150%;
	margin-top: -0.5rem;
	margin-left: -0.5rem;
`

export const AdjustedCost = styled(CostBase)<{ $affordable: boolean }>`
	position: relative;
	z-index: 2;

	${(props) =>
		props.$affordable
			? css`
					border: 2px solid rgb(255, 255, 104);
					color: rgb(255, 255, 104);
				`
			: css`
					border: 2px solid rgba(255, 135, 135, 1);
					color: rgba(255, 135, 135, 1);
				`}
`

export const OriginalCost = styled(CostBase)<{
	$affordable: boolean
	$isAdjusted: boolean
}>`
	position: relative;
	z-index: 1;

	${(props) =>
		props.$affordable
			? css`
					border: 2px solid rgb(255, 255, 104);
					color: rgb(255, 255, 104);
				`
			: css`
					border: 2px solid rgba(255, 135, 135, 1);
					color: rgba(255, 135, 135, 1);
				`}

	${(props) =>
		props.$isAdjusted &&
		(props.$affordable
			? css`
					border: 2px solid rgb(121, 121, 51);
					color: rgb(121, 121, 51);
				`
			: css`
					border: 2px solid #b45050;
					color: #b45050;
				`)}
`

export const Cost = styled.div`
	height: 2rem;
	position: relative;
	z-index: 2;
`

export const Categories = styled.div`
	margin-left: auto;
	display: flex;
	align-items: center;
	z-index: 2;
`

export const Title = styled.div`
	padding: 0.5rem 0.5rem;
	text-align: center;
	color: #f0f0f0;
	text-transform: uppercase;
	font-size: 100%;
	margin-left: -1px;
	margin-right: -1px;
	position: relative;
	z-index: 1;
`

export const Description = styled.div`
	padding: 0.5rem 0.5rem 0.5rem 0.5rem;
	overflow: auto;
	min-height: 0;
	flex-grow: 1;
	font-size: 85%;
	text-align: center;
	background: ${({ theme }) => rgba(theme.colors.background, 1)};
	clip-path: polygon(0 0, 100% 0, 100% 100%, 7px 100%, 0 calc(100% - 7px));

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
					float: right;
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
	position: relative;
	z-index: 1;
	margin-bottom: 0.2rem;
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
	padding: 0.2rem;
	position: relative;

	&::before {
		content: '';
		position: absolute;
		inset: 0;
		background: ${(props) =>
			darken(props.$faded ? 0.3 : 0, props.theme.colors.cards[props.type])};
		clip-path: polygon(
			0 0,
			calc(100% - 7px) 0,
			100% 7px,
			100% 100%,
			7px 100%,
			0 calc(100% - 7px)
		);
		z-index: 0;
	}

	z-index: 1;
	box-sizing: border-box;
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
			${Categories}, ${Cost}, ${Title} {
				opacity: 0.2;
			}

			${Image} {
				background-color: rgba(0, 0, 0, 0.8);
				background-blend-mode: darken;
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

			${Title} {
				margin-left: -1px;
				margin-top: -1px;
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

export const CorporationTitle = styled.div`
	display: flex;

	${Head} {
		flex: 1;
	}
`
