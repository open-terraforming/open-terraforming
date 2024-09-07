import { createGame } from '@/api/rest'
import { Button, MessageModal } from '@/components'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { Flex } from '@/components/Flex/Flex'
import { Input } from '@/components/Input/Input'
import { Modal } from '@/components/Modal/Modal'
import { MultiSelect } from '@/components/MultiSelect/MultiSelect'
import { NumberInput } from '@/components/NumberInput/NumberInput'
import { ApiState, setApiState } from '@/store/modules/api'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import { faRobot, faTimes } from '@fortawesome/free-solid-svg-icons'
import { ExpansionType } from '@shared/expansions/types'
import { MapType } from '@shared/map'
import { MapsList } from '@shared/maps'
import { GameModes } from '@shared/modes'
import { GameModeType } from '@shared/modes/types'
import { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'

type Props = {
	onClose: () => void
}

const EXPANSIONS_OPTIONS = [
	{
		value: ExpansionType.Prelude,
		label: 'Prelude',
		description:
			'At the start of the game, you get to pick 2 prelude cards which bootstrap your corporation making the game faster.',
	},
	{
		value: ExpansionType.Venus,
		label: 'Venus',
		description:
			'Adds a new global parameter to increase: Venus scale. It also adds new cards and corporations.',
	},
]

export const NewGameModal = ({ onClose }: Props) => {
	const dispatch = useAppDispatch()
	const [error, setError] = useState(null as string | null)
	const [name, setName] = useState('')
	const [mode, setMode] = useState(GameModeType.Standard)
	const [map, setMap] = useState(MapType.Standard)
	const [isPublic, setPublic] = useState(false)
	const [spectators, setSpectators] = useState(true)
	const [draft, setDraft] = useState(false)
	const [bots, setBots] = useState(0)
	const [solarPhase, setSolarPhase] = useState(true)
	const [fastBots, setFastBots] = useState(false)

	const [
		disablePlayersAfterDisconnecting,
		setDisablePlayersAfterDisconnecting,
	] = useState(true)

	const [
		disablePlayersAfterDisconnectingInSeconds,
		setDisablePlayersAfterDisconnectingInSeconds,
	] = useState(60)

	const serverInfo = useAppStore((app) => app.api.info)

	const [expansions, setExpansions] = useState([
		ExpansionType.Prelude,
		ExpansionType.Venus,
	])

	const [loading, setLoading] = useState(false)

	const valid = useMemo(() => {
		if (name.length < 3 || name.length > 20) {
			return false
		}

		if (!mode) {
			return false
		}

		return true
	}, [name, mode])

	const handleCreate = async () => {
		if (!valid || loading) {
			return
		}

		setLoading(true)

		try {
			const res = await createGame({
				name,
				mode,
				map,
				bots,
				public: isPublic,
				spectatorsAllowed: spectators,
				expansions,
				draft,
				solarPhase,
				fastBots,
				disablePlayersAfterDisconnectingInSeconds:
					disablePlayersAfterDisconnecting
						? disablePlayersAfterDisconnectingInSeconds
						: undefined,
			})

			if (res.id) {
				dispatch(
					setApiState({
						state: ApiState.Connecting,
						gameId: res.id,
					}),
				)
			} else {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const errors = res as any

				if (errors.errors) {
					throw new Error(
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						errors.errors.map((e: any) => `${e.param}: ${e.msg}`).join(', '),
					)
				} else if (errors.error) {
					throw new Error(errors.error)
				} else {
					throw new Error(JSON.stringify(res))
				}
			}
		} catch (e) {
			setError((e as Error).message)
		}

		setLoading(false)
	}

	return (
		<>
			<Modal
				open={true}
				onClose={onClose}
				header="Start a new game"
				footer={(close) => (
					<>
						<Button
							disabled={!valid}
							isLoading={loading}
							onClick={handleCreate}
						>
							Create
						</Button>
						<Button icon={faTimes} onClick={close} schema="transparent">
							Cancel
						</Button>
					</>
				)}
			>
				<Flex>
					<Field>
						<label>Game name</label>
						<Input value={name} onChange={(v) => setName(v)} autoFocus />
					</Field>

					<Field>
						<label>Board</label>
						<select
							onChange={(e) => setMap(e.target.value as unknown as MapType)}
						>
							{MapsList.map((item) => (
								<option key={item.type} value={item.type}>
									{item.name}
								</option>
							))}
						</select>
					</Field>

					{serverInfo?.bots.enabled && (
						<Field>
							<label>Bots</label>
							<NumberInput
								min={0}
								max={serverInfo.bots.max}
								value={bots}
								onChange={(v) => setBots(v)}
								icon={faRobot}
							/>
						</Field>
					)}
				</Flex>

				<Field>
					{bots > 0 && (
						<>
							<Checkbox
								checked={fastBots}
								onChange={(v) => setFastBots(v)}
								label="Fast bots"
							/>
							<Hint>
								Bots will execute their actions instantly without simulated
								delay
							</Hint>
						</>
					)}

					{serverInfo?.publicGames.enabled && (
						<>
							<Checkbox
								checked={isPublic}
								onChange={(v) => setPublic(v)}
								label="Public"
							/>
							<Hint>Public games will be visible in the server browser</Hint>
						</>
					)}

					<Checkbox
						checked={spectators}
						onChange={(v) => setSpectators(v)}
						label="Allow spectators"
					/>

					<Hint>
						{'Allows others to join and watch the game without playing'}
					</Hint>

					<Checkbox
						checked={disablePlayersAfterDisconnecting}
						onChange={(v) => setDisablePlayersAfterDisconnecting(v)}
						label="Disable players after disconnecting"
					/>

					<Hint>
						{
							"When players disconnects, they'll be disabled and their turns skipped"
						}
					</Hint>

					{disablePlayersAfterDisconnecting && (
						<TimeoutField align="center" gap={'0.5rem'}>
							<div>After</div>
							<TimeoutInput
								value={disablePlayersAfterDisconnectingInSeconds?.toString()}
								onChange={(v) =>
									setDisablePlayersAfterDisconnectingInSeconds(+v)
								}
								type="number"
								step="1"
								min="5"
								max="216000"
							/>
							<div>seconds</div>
						</TimeoutField>
					)}
				</Field>

				<Field>
					<label>Mode</label>
					{Object.values(GameModes).map((item) => (
						<SelectItem
							key={item.type}
							onClick={() => setMode(item.type)}
							selected={item.type === mode}
						>
							<SelectItemHead>
								<input type="radio" checked={item.type === mode} readOnly />
								<div>{item.name}</div>
							</SelectItemHead>
							<SelectItemDesc>{item.description}</SelectItemDesc>
						</SelectItem>
					))}
				</Field>

				<Field>
					<Checkbox
						checked={draft}
						onChange={(v) => setDraft(v)}
						label="Enable Draft"
					/>

					<SelectItemDesc style={{ maxWidth: '30rem' }}>
						Each player will receive 4 random cards at the start of a
						generation, but instead of picking which to research, each player
						will pick one to keep and pass the rest to next player. Once
						there&apos;s no card left to pass, players pick which cards to
						research from the 4 cards they picked. This option is not
						recommended for beginners.
					</SelectItemDesc>
				</Field>

				<Field>
					<Checkbox
						checked={solarPhase}
						onChange={(v) => setSolarPhase(v)}
						label="Enable Solar Phase"
					/>

					<SelectItemDesc style={{ maxWidth: '30rem' }}>
						Adds a new game phase after the production phase. In this phase, the
						current player will be able to increase one global terraforming
						parameter. The player is acting on WG behalf so they won&apos;t
						receive any TR nor resources for the action. This option speeds up
						the game a little and is recommended with Venus expansion.
					</SelectItemDesc>
				</Field>

				<Field>
					<label>Expansions</label>
					<ExpansionsMultiSelect
						value={expansions}
						options={EXPANSIONS_OPTIONS}
						onChange={(v) => setExpansions(v)}
					/>
				</Field>
			</Modal>

			{error && (
				<MessageModal
					type="error"
					title="Error occurred"
					message={error}
					onClose={() => setError(null)}
				/>
			)}
		</>
	)
}

const SelectItem = styled.div<{ selected: boolean }>`
	cursor: pointer;
	margin: 0.5rem 0;
	padding: 0.5rem;
	max-width: 30rem;
	transition: background-color 0.2s;

	${(props) =>
		props.selected &&
		css`
			background-color: ${({ theme }) => theme.colors.border};
		`}
`

const SelectItemHead = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 0.3rem;

	> div {
		margin-left: 0.3rem;
	}
`

const Field = styled.div`
	padding: 0.5rem;
	margin: 0.5rem 0;

	label {
		margin-bottom: 0.5rem;
	}
`

const SelectItemDesc = styled.div`
	padding: 0.3rem 1rem;
`

const ExpansionsMultiSelect = styled(MultiSelect)`
	max-width: 30rem;
` as typeof MultiSelect

const TimeoutField = styled(Flex)`
	margin-left: 1rem;
`

const TimeoutInput = styled(Input)`
	width: 6rem;
`

const Hint = styled.div`
	margin-left: 1rem;
	margin-bottom: 1rem;
	opacity: 0.75;
`
