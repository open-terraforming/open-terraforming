import { DialogButton } from '@/components/DialogButton/DialogButton'
import { ExportSavedGamesButton } from '@/components/ExportSavedGamesButton/ExportSavedGamesButton'
import { Flex } from '@/components/Flex/Flex'
import { ImportSavedGamesModal } from '@/components/ImportSavedGamesModal/ImportSavedGamesModal'
import { Modal } from '@/components/Modal/Modal'
import { Switch } from '@/components/Switch/Switch'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { ChangeEvent } from 'react'
import styled from 'styled-components'

type Props = {
	onClose: () => void
}

export const SettingsModal = ({ onClose }: Props) => {
	const dispatch = useAppDispatch()

	const settings = useAppStore((state) => state.settings.data)

	const handleSettingsChange =
		(key: keyof typeof settings, asNumber = false) =>
		(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			dispatch({
				type: 'SET_SETTINGS',
				data: {
					[key]:
						e.target.type === 'checkbox'
							? e.target.checked
							: asNumber
								? +e.target.value
								: e.target.value,
				},
			})
		}

	const handleSettingsRawChange =
		<TKey extends keyof typeof settings>(key: TKey) =>
		(value: (typeof settings)[TKey]) => {
			dispatch({
				type: 'SET_SETTINGS',
				data: {
					[key]: value,
				},
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
				<Flex className="field">
					<label>Browser notifications</label>
					<Switch
						value={settings.enableBrowserNotifications}
						onChange={handleSettingsRawChange('enableBrowserNotifications')}
					/>
				</Flex>

				<Flex className="field">
					<label>Animations</label>
					<Switch
						value={settings.enableAnimations}
						onChange={handleSettingsRawChange('enableAnimations')}
					/>
				</Flex>

				<Flex className="field">
					<label>Audio</label>
					<Switch
						value={settings.enableAudio}
						onChange={handleSettingsRawChange('enableAudio')}
					/>
				</Flex>

				<Flex className="field">
					<label>Volume</label>
					<input
						type="range"
						min={0}
						max={1}
						step={0.1}
						value={settings.audioVolume}
						onChange={handleSettingsChange('audioVolume', true)}
					/>
				</Flex>

				<Flex className="field">
					<label>Theme</label>
					<select
						value={settings.theme}
						onChange={handleSettingsChange('theme')}
					>
						<option value="default">Default</option>
						<option value="green">Green</option>
						<option value="red">Red</option>
					</select>
				</Flex>
			</FormContainer>

			<Flex justify="center" gap="0.5rem">
				<ExportSavedGamesButton />
				<DialogButton
					dialog={(onClose) => <ImportSavedGamesModal onClose={onClose} />}
					icon={faUpload}
				>
					Import sessions
				</DialogButton>
			</Flex>
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

		label {
			flex: 1;
		}

		select,
		input {
			flex: 2;
			box-sizing: border-box;
		}
	}
`
