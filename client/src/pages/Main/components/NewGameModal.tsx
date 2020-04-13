import { createGame } from '@/api/rest'
import { Button, MessageModal } from '@/components'
import { Input } from '@/components/Input/Input'
import { Modal } from '@/components/Modal/Modal'
import { ApiState, setApiState } from '@/store/modules/api'
import { useAppDispatch } from '@/utils/hooks'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { GameModes } from '@shared/modes'
import { GameModeType } from '@shared/modes/types'
import React, { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { colors } from '@/styles'

type Props = {
	onClose: () => void
}

export const NewGameModal = ({ onClose }: Props) => {
	const dispatch = useAppDispatch()
	const [error, setError] = useState(null as string | null)
	const [name, setName] = useState('')

	const [mode, setMode] = useState(GameModeType.Standard)

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
			const res = await createGame(name, mode)

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
			setError(e.message)
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
				<Input
					placeholder="Game name..."
					value={name}
					onChange={v => setName(v)}
					autoFocus
				/>

				{Object.values(GameModes).map(item => (
					<ModeCont
						key={item.type}
						onClick={() => setMode(item.type)}
						selected={item.type === mode}
					>
						<ModeHead>
							<input type="radio" checked={item.type === mode} readOnly />
							<div>{item.name}</div>
						</ModeHead>
						<ModeDesc>{item.description}</ModeDesc>
					</ModeCont>
				))}
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

const ModeCont = styled.div<{ selected: boolean }>`
	cursor: pointer;
	margin: 0.5rem 0;
	padding: 0.5rem;
	max-width: 30rem;

	${props =>
		props.selected &&
		css`
			background-color: ${colors.border};
		`}
`

const ModeHead = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 0.3rem;

	> div {
		margin-left: 0.3rem;
	}
`

const ModeDesc = styled.div`
	padding: 0.3rem 1rem;
`
