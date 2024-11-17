import { CommitteePartyIcon } from '@/components/CommitteePartyIcon'
import { Flex } from '@/components/Flex/Flex'
import { Modal } from '@/components/Modal/Modal'
import { useLocale } from '@/context/LocaleContext'
import { useAppStore, useGameState } from '@/utils/hooks'
import { faUserTie } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getRulingParty } from '@shared/expansions/turmoil/utils/getRulingParty'
import { Fragment } from 'react'
import { styled } from 'styled-components'
import { Symbols } from '../CardView/components/Symbols'
import { SeatDef } from './components/SeatDef'

type Props = {
	onClose: () => void
}

const PARTY_TO_COLORS = {
	mars_first: {
		backgroundColor: '#683f19',
		color: '#c5957f',
		borderColor: '#85533d',
	},
	kelvinists: {
		backgroundColor: '#333',
		color: '#f53030',
		borderColor: '#f86666',
	},
	scientists: {
		backgroundColor: '#adadad',
		color: '#444444',
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
		color: '#000',
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

export const CommitteeModal = ({ onClose }: Props) => {
	const game = useGameState()
	const playerMap = useAppStore((store) => store.game.playerMap)
	const t = useLocale()
	const rulingParty = getRulingParty(game)
	const chairman = game.committee.chairman

	const partiesCount = game.committee.parties.length
	const partyAngle = Math.PI / partiesCount
	const farAngle = partyAngle * 0.9
	const closeAngle = partyAngle * 0.85
	const closeDistance = 20
	const farDistance = 49
	const centerX = 50
	const centerY = 0
	const width = 600
	const height = 300
	const svgWidth = 100
	const svgHeight = 50
	const svgToHtmlX = width / svgWidth
	const svgToHtmlY = height / svgHeight

	return (
		<Modal open onClose={onClose} header="Committee">
			<div>
				Chairman:{' '}
				{chairman
					? chairman.playerId
						? playerMap[chairman.playerId.id].name
						: 'Neutral'
					: 'None'}
			</div>

			{rulingParty && (
				<div style={{ width: '50%' }}>
					<div>Ruling party: {t.committeeParties[rulingParty.code]}</div>
					<div>
						Ruling Policy:{' '}
						{rulingParty.policy.active.map((policy, index) => (
							<div key={index}>
								<StyledSymbols symbols={policy.symbols} />
								{policy.description}
							</div>
						))}
						{rulingParty.policy.passive.map((policy, index) => (
							<div key={index}>
								<StyledSymbols symbols={policy.symbols} />
								{policy.description}
							</div>
						))}
					</div>
				</div>
			)}

			<div style={{ position: 'relative', width, height }}>
				<StyledSvg viewBox="0 0 100 50">
					<defs>
						<SeatDef />
					</defs>
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
								<path
									d={[
										`M ${points[0][0]},${points[0][1]}`,
										`L ${points[1][0]},${points[1][1]}`,
										`A ${centerX} ${centerX} ${farDistance} 0 1 ${points[2][0]},${points[2][1]} `,
										`L ${points[3][0]},${points[3][1]}`,
										`Z`,
									].join(' ')}
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

				<div style={{ position: 'absolute', inset: 0 }}>
					{game.committee.parties.map((party, index) => {
						const angle = partyAngle / 2 + index * partyAngle

						const center = [
							centerX +
								Math.cos(angle) *
									(closeDistance + (farDistance - closeDistance) / 2),
							centerY +
								Math.sin(angle) *
									(closeDistance + (farDistance - closeDistance) / 2),
						]

						const leader = [
							centerX + Math.cos(angle) * (closeDistance - 1.5),
							centerY + Math.sin(angle) * (closeDistance - 1.5),
						]

						return (
							<Fragment key={party.code}>
								{party.leader && (
									<div
										title={
											party.leader.playerId
												? playerMap[party.leader.playerId.id].name
												: 'Neutral delegate'
										}
										style={{
											position: 'absolute',
											left: leader[0] * svgToHtmlX,
											top: leader[1] * svgToHtmlY,
											color: party.leader.playerId
												? playerMap[party.leader.playerId.id].color
												: '#aaa',
											transform: 'translate(-50%, -50%)',
										}}
									>
										<FontAwesomeIcon icon={faUserTie} />
									</div>
								)}
								<div
									style={{
										position: 'absolute',
										left: center[0] * svgToHtmlX,
										top: center[1] * svgToHtmlY,
										transform: 'translate(-50%, -50%)',
									}}
								>
									<CommitteePartyIcon party={party.code} />
									<Flex gap="0.1rem" justify="center">
										{party.members
											.sort(
												(a, b) => (a.playerId?.id ?? 0) - (b.playerId?.id ?? 0),
											)
											.map((m, i) => (
												<div
													key={i}
													title={
														m.playerId
															? playerMap[m.playerId.id].name
															: 'Neutral delegate'
													}
													style={{
														color: m.playerId
															? playerMap[m.playerId.id].color
															: '#aaa',
													}}
												>
													<FontAwesomeIcon icon={faUserTie} />
												</div>
											))}
									</Flex>
								</div>
							</Fragment>
						)
					})}
				</div>
			</div>
		</Modal>
	)
}

const StyledSvg = styled.svg`
	stroke: #666;
	stroke-width: 0.5;
	fill: #222;
	position: absolute;
	inset: 0;
`

const StyledSymbols = styled(Symbols)`
	justify-content: flex-start;
`
