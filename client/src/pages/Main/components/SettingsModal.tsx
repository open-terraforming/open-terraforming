import { Flex } from '@/components/Flex/Flex'
import { Modal } from '@/components/Modal/Modal'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import React from 'react'
import styled from 'styled-components'

type Props = {
	onClose: () => void
}

export const SettingsModal = ({ onClose }: Props) => {
	const dispatch = useAppDispatch()

	const settings = useAppStore(state => state.settings.data)

	const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		dispatch({
			type: 'SET_SETTINGS',
			data: {
				theme: e.target.value
			}
		})
	}

	const handleNotificationsChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		dispatch({
			type: 'SET_SETTINGS',
			data: {
				enableBrowserNotifications: e.target.checked
			}
		})
	}

	return (
		<Modal
			open
			header="Settings"
			onClose={onClose}
			contentStyle={{ minWidth: '20rem' }}
		>
			<FormContainer>
				<label className="with-checkbox field">
					<input
						type="checkbox"
						checked={
							settings.enableBrowserNotifications === true ||
							settings.enableBrowserNotifications === undefined
						}
						onChange={handleNotificationsChange}
					/>{' '}
					Browser notifications
				</label>

				<Flex className="field">
					<label>Theme</label>
					<select value={settings.theme} onChange={handleThemeChange}>
						<option value="default">Default</option>
						<option value="green">Green</option>
						<option value="red">Red</option>
					</select>
				</Flex>
			</FormContainer>
		</Modal>
	)
}

const FormContainer = styled.div`
	label {
		margin-right: 0.5rem;
	}

	label.with-checkbox {
		display: flex;
		align-items: center;

		input[type='checkbox'] {
			margin-right: 0.5rem;
			width: auto;
		}
	}

	.field {
		margin: 1rem 0;

		select,
		input {
			width: 100%;
			box-sizing: border-box;
		}
	}
`
