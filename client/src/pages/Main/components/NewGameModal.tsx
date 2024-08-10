import { createGame } from '@/api/rest'
import { Button, MessageModal } from '@/components'
import { Input } from '@/components/Input/Input'
import { Modal } from '@/components/Modal/Modal'
import { ApiState, setApiState } from '@/store/modules/api'
import { useAppDispatch } from '@/utils/hooks'
import { faTimes, faRobot } from '@fortawesome/free-solid-svg-icons'
import { GameModes } from '@shared/modes'
import { GameModeType } from '@shared/modes/types'
import React, { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { NumberInput } from '@/components/NumberInput/NumberInput'
import { Flex } from '@/components/Flex/Flex'
import { MapType } from '@shared/map'
import { MapsList } from '@shared/maps'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { Expansions } from '@shared/expansions'
import { ExpansionType } from '@shared/expansions/types'
import { MultiSelect } from '@/components/MultiSelect/MultiSelect'

type Props = {
	onClose: () => void
}

const availableExpansions = [ExpansionType.Prelude, ExpansionType.Venus]

export const NewGameModal = ({ onClose }: Props) => {
	const dispatch = useAppDispatch()
	const [error, setError] = useState(null as string | null)
	const [name, setName] = useState('')
	const [mode, setMode] = useState(GameModeType.Standard)
	const [map, setMap] = useState(MapType.Standard)
	const [isPublic, setPublic] = useState(true)
	const [spectators, setSpectators] = useState(true)
	const [draft, setDraft] = useState(false)
	const [bots, setBots] = useState(0)
	const [solarPhase, setSolarPhase] = useState(true)

	const [expansions, setExpansions] = useState([
		ExpansionType.Prelude,
		ExpansionType.Venus
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
				solarPhase
			})

			if (res.id) {
				dispatch(
					setApiState({
						state: ApiState.Connecting,
						gameId: res.id
					})
				)
			} else {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const errors = res as any

				if (errors.errors) {
					throw new Error(
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						errors.errors.map((e: any) => `${e.param}: ${e.msg}`).join(', ')
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
				footer={close => (
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
						<Input value={name} onChange={v => setName(v)} autoFocus />
					</Field>

					<Field>
						<label>Board</label>
						<select
							onChange={e => setMap((e.target.value as unknown) as MapType)}
						>
							{MapsList.map(item => (
								<option key={item.type} value={item.type}>
									{item.name}
								</option>
							))}
						</select>
					</Field>

					<Field>
						<label>Bots</label>
						<NumberInput
							min={0}
							max={4}
							value={bots}
							onChange={v => setBots(v)}
							icon={faRobot}
						/>
					</Field>
				</Flex>

				<Field>
					<Checkbox
						checked={isPublic}
						onChange={v => setPublic(v)}
						label="Public (Allow players to join using server browser)"
					/>

					<Checkbox
						checked={spectators}
						onChange={v => setSpectators(v)}
						label="Allow spectators"
					/>
				</Field>

				<Field>
					<label>Mode</label>
					{Object.values(GameModes).map(item => (
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
						onChange={v => setDraft(v)}
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
						onChange={v => setSolarPhase(v)}
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
					<MultiSelect
						value={expansions}
						options={availableExpansions.map(e => ({
							value: e,
							label: Expansions[e].name
						}))}
						onChange={v => setExpansions(v)}
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

	${props =>
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
