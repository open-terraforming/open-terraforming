import { Button, Message } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { Lore } from '@/components/Lore'
import { Modal } from '@/components/Modal/Modal'
import { useApi } from '@/context/ApiContext'
import { useAppStore } from '@/utils/hooks'
import { solarPhaseTerraform } from '@shared/actions'
import { GameProgress } from '@shared/cards'
import { PlayerAction } from '@shared/player-actions'

type Props = {
	action: PlayerAction
}

export const SolarPhaseTerraformPicker = ({}: Props) => {
	const api = useApi()
	const game = useAppStore((state) => state.game.state)

	const confirm = (progress: GameProgress) => () => {
		api.send(solarPhaseTerraform(progress))
	}

	return (
		<Modal header="World Government Terraforming" open allowClose={false}>
			<div>
				<Flex direction="column" style={{ gap: 10 }}>
					<Lore>
						With the increasing costs related to the Venus project, WG has
						decided to help you with the terraforming process.
					</Lore>

					<p>Choose a type of terraforming to perform</p>

					{game.temperature < game.map.temperature && (
						<Button onClick={confirm('temperature')}>
							Increase Temperature
						</Button>
					)}
					{game.oxygen < game.map.oxygen && (
						<Button onClick={confirm('oxygen')}>Increase Oxygen</Button>
					)}
					{game.oceans < game.map.oceans && (
						<Button onClick={confirm('oceans')}>Place Ocean</Button>
					)}

					<Message
						type="info"
						message="You won't receive any TR for the terraforming nor will you receive resources when placing an ocean."
						style={{ maxWidth: '30rem' }}
					/>
				</Flex>
			</div>
		</Modal>
	)
}
