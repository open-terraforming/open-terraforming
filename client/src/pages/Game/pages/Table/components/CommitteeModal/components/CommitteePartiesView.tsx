import { CommitteePartyIcon } from '@/components/CommitteePartyIcon'
import { DelegateIcon } from '@/components/DelegateIcon'
import { Flex } from '@/components/Flex/Flex'
import { useAppStore, useGameState } from '@/utils/hooks'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getCommitteeParty } from '@shared/utils'
import { Fragment } from 'react'
import { css, styled } from 'styled-components'
import { StyledSymbols } from '../CommitteeModal'
import { DelegatesView } from './DelegatesView'
import { SeatDef } from './SeatDef'

type Props = {
	width?: number
	height?: number
	selectedCode?: string
	onClick?: (party: string) => void
}

const PARTY_TO_COLORS = {
	mars_first: {
		backgroundColor: '#683f19',
		color: '#fff',
		borderColor: '#85533d',
	},
	kelvinists: {
		backgroundColor: '#333',
		color: '#fff',
		borderColor: '#f86666',
	},
	scientists: {
		backgroundColor: '#504a4a',
		color: '#fff',
		borderColor: '#c0c0c0',
	},
	reds: {
		backgroundColor: '#5e1010',
		color: '#fff',
		borderColor: '#8a2b2b',
	},
	unity: {
		backgroundColor: '#000429',
		color: '#fff',
		borderColor: '#131d74',
	},
	greens: {
		backgroundColor: '#033003',
		color: '#fff',
		borderColor: '#0c500c',
	},
} as Record<
	string,
	{
		backgroundColor: string
		color: string
		borderColor: string
	}
>

export const CommitteePartiesView = ({
	width = 600,
	height = 300,
	selectedCode,
	onClick,
}: Props) => {
	const game = useGameState()
	const playerMap = useAppStore((store) => store.game.playerMap)
	const chairman = game.committee.chairman

	const partiesCount = game.committee.parties.length
	const partyAngle = Math.PI / partiesCount
	const farAngle = partyAngle * 0.9
	const closeAngle = partyAngle * 0.85
	const closeDistance = 20
	const farDistance = 49
	const centerX = 50
	const centerY = 0
	const svgWidth = 100
	const svgHeight = 50
	const svgToHtmlX = width / svgWidth
	const svgToHtmlY = height / svgHeight

	const chairmanX = centerX
	const chairmanY = centerY + 3

	return (
		<Container style={{ width, height }}>
			<StyledSvg viewBox="0 0 100 50">
				<defs>
					<SeatDef />
				</defs>
				<use
					href="#seat"
					x={chairmanX}
					y={chairmanY}
					transform={`rotate(180 ${chairmanX} ${chairmanY})`}
				/>
				{game.committee.parties.map((party, index) => {
					const angle = partyAngle / 2 + index * partyAngle

					const points = [
						[
							centerX + Math.cos(angle - closeAngle / 2) * closeDistance,
							centerY + Math.sin(angle - closeAngle / 2) * closeDistance,
						],
						[
							centerX + Math.cos(angle - farAngle / 2) * farDistance,
							centerY + Math.sin(angle - farAngle / 2) * farDistance,
						],
						[
							centerX + Math.cos(angle + farAngle / 2) * farDistance,
							centerY + Math.sin(angle + farAngle / 2) * farDistance,
						],
						[
							centerX + Math.cos(angle + closeAngle / 2) * closeDistance,
							centerY + Math.sin(angle + closeAngle / 2) * closeDistance,
						],
					]

					const leader = [
						centerX + Math.cos(angle) * closeDistance,
						centerY + Math.sin(angle) * closeDistance,
					]

					return (
						<g
							key={party.code}
							stroke={PARTY_TO_COLORS[party.code].borderColor}
							fill={PARTY_TO_COLORS[party.code].backgroundColor}
						>
							<PartyPath
								$selected={
									selectedCode === undefined
										? undefined
										: selectedCode === party.code
								}
								d={[
									`M ${points[0][0]},${points[0][1]}`,
									`L ${points[1][0]},${points[1][1]}`,
									`A ${centerX} ${centerX} ${farDistance} 0 1 ${points[2][0]},${points[2][1]} `,
									`L ${points[3][0]},${points[3][1]}`,
									`Z`,
								].join(' ')}
								onClick={() => onClick?.(party.code)}
							/>
							<use
								href="#seat"
								x={leader[0]}
								y={leader[1]}
								transform={`rotate(${angle * (180 / Math.PI) - 90} ${leader[0]} ${leader[1]})`}
							/>
						</g>
					)
				})}
			</StyledSvg>

			<HtmlMarkesContainer>
				{chairman && (
					<div
						title={
							chairman.playerId
								? playerMap[chairman.playerId.id].name
								: 'Neutral'
						}
						style={{
							position: 'absolute',
							left: chairmanX * svgToHtmlX,
							top: (chairmanY + 3) * svgToHtmlY,
							color: chairman.playerId
								? playerMap[chairman.playerId.id].color
								: '#aaa',
							transform: 'translate(-50%, -50%)',
							fontSize: '125%',
						}}
					>
						<DelegateIcon playerId={chairman.playerId?.id} type="chairman" />
					</div>
				)}
				{game.committee.parties.map((party, index) => {
					const angle = partyAngle / 2 + index * partyAngle
					const info = getCommitteeParty(party.code)

					const center = [
						centerX +
							Math.cos(angle) *
								(closeDistance + (farDistance - closeDistance) / 2),
						centerY +
							Math.sin(angle) *
								(closeDistance + (farDistance - closeDistance) / 2),
					]

					const leader = [
						centerX + Math.cos(angle) * (closeDistance - 3.5),
						centerY + Math.sin(angle) * (closeDistance - 3.5),
					]

					const effect = [
						centerX + Math.cos(angle) * (farDistance - 3),
						centerY + Math.sin(angle) * (farDistance - 3),
					]

					return (
						<Fragment key={party.code}>
							{party.leader && (
								<DelegateIcon
									playerId={party.leader.playerId?.id}
									type="party-leader"
									style={{
										position: 'absolute',
										left: leader[0] * svgToHtmlX,
										top: leader[1] * svgToHtmlY,
										transform: 'translate(-50%, -50%)',
									}}
								/>
							)}
							<div
								style={{
									position: 'absolute',
									left: effect[0] * svgToHtmlX,
									top: effect[1] * svgToHtmlY,
									transform: `translate(-50%,-50%) rotate(${angle - Math.PI / 2}rad)`,
									color: PARTY_TO_COLORS[party.code].color,
								}}
							>
								{info.policy.active.map((policy, index) => (
									<StyledSymbols key={index} symbols={policy.symbols} />
								))}
								{info.policy.passive.map((policy, index) => (
									<StyledSymbols key={index} symbols={policy.symbols} />
								))}
							</div>
							<PartyMarkers
								$selected={
									selectedCode === undefined
										? undefined
										: selectedCode === party.code
								}
								style={{
									position: 'absolute',
									left: center[0] * svgToHtmlX,
									top: center[1] * svgToHtmlY,
									transform: 'translate(-50%, -50%)',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									flexDirection: 'column',
								}}
							>
								<Flex>
									<CommitteePartyIcon party={party.code} />
									{game.committee.dominantParty === party.code && (
										<DominantIcon>
											<FontAwesomeIcon icon={faStar} />
										</DominantIcon>
									)}
								</Flex>
								<Flex
									gap="0.1rem"
									justify="center"
									wrap="wrap"
									style={{ maxWidth: '4rem' }}
								>
									<DelegatesView
										delegates={party.members.map((m) => m.playerId)}
									/>
								</Flex>
							</PartyMarkers>
						</Fragment>
					)
				})}
			</HtmlMarkesContainer>
		</Container>
	)
}

const DominantIcon = styled.div`
	color: #d9ff30;
`

const Container = styled.div`
	position: relative;
	margin: 1rem auto;
`

const HtmlMarkesContainer = styled.div<{ $selected?: boolean }>`
	position: absolute;
	inset: 0;
	pointer-events: none;

	${({ $selected }) =>
		$selected !== undefined &&
		!$selected &&
		css`
			opacity: 0.5;
		`}
`

const PartyPath = styled.path<{ $selected?: boolean }>`
	cursor: pointer;

	&:hover {
		opacity: 0.7;
	}

	${({ $selected }) =>
		$selected !== undefined &&
		!$selected &&
		css`
			opacity: 0.5;
		`}
`

const StyledSvg = styled.svg`
	stroke: #666;
	stroke-width: 0.5;
	fill: #222;
	position: absolute;
	inset: 0;
`

const PartyMarkers = styled.div<{ $selected?: boolean }>`
	position: absolute;
	transform: translate(-50%, -50%);
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;

	${({ $selected }) =>
		$selected !== undefined &&
		!$selected &&
		css`
			opacity: 0.5;
		`}
`
