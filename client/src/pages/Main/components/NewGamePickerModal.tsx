import { Box } from '@/components/Box'
import { ClippedBox } from '@/components/ClippedBox'
import { ClippedBoxTitle } from '@/components/ClippedBoxTitle'
import { Flex } from '@/components/Flex/Flex'
import { Modal } from '@/components/Modal/Modal'
import { faCompactDisc, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { lighten } from 'polished'
import { useState } from 'react'
import styled from 'styled-components'
import { NewGameModal } from './NewGameModal'

type Props = {
	onClose: () => void
}

enum NewGameMode {
	Local = 'local',
	Online = 'online',
}

export const NewGamePickerModal = ({ onClose }: Props) => {
	const [mode, setMode] = useState<NewGameMode>()

	return (
		<>
			<ModalNoBackground
				open={mode === undefined}
				onClose={onClose}
				contentStyle={{ background: 'none' }}
				header={<ModalTitle innerSpacing>New game</ModalTitle>}
				hideClose
			>
				<Box align="stretch" gap="0.5rem">
					<ModeChoice onClick={() => setMode(NewGameMode.Local)}>
						<ClippedBoxTitle $spacing>
							<Flex gap="0.25rem">
								<FontAwesomeIcon icon={faCompactDisc} /> Local game
							</Flex>
						</ClippedBoxTitle>
						<Box $p={2}>
							Game is saved in your browser and playable offline, but no other
							player can watch it or join it. Not limited by number of server
							slots.
						</Box>
					</ModeChoice>
					<ModeChoice onClick={() => setMode(NewGameMode.Online)}>
						<ClippedBoxTitle $spacing>
							<Flex gap="0.25rem">
								<FontAwesomeIcon icon={faGlobe} /> Online game
							</Flex>
						</ClippedBoxTitle>

						<Box $p={2}>
							Game is saved online so other players can join or watch it.
							Limited by number of server slots.
						</Box>
					</ModeChoice>
				</Box>
			</ModalNoBackground>
			{mode === NewGameMode.Local && <NewGameModal onClose={onClose} local />}
			{mode === NewGameMode.Online && <NewGameModal onClose={onClose} />}
		</>
	)
}

const ModalNoBackground = styled(Modal)`
	.modal-popup > .inner {
		background: none;
	}
`

const ModalTitle = styled(ClippedBox)`
	flex: 1;
	text-transform: uppercase;
	text-align: center;
`

const ModeChoice = styled(ClippedBox)`
	flex: 1;
	width: 20rem;
	cursor: pointer;

	&:hover {
		background-color: ${({ theme }) => lighten(0.1, theme.colors.border)};

		${ClippedBoxTitle} {
			background-color: ${({ theme }) => lighten(0.1, theme.colors.border)};
		}

		.inner {
			background-color: ${({ theme }) => lighten(0.5, theme.colors.background)};
		}
	}
`
