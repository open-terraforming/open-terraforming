import { CenteredText } from './CenteredText'

type Props = {
	onDone: () => void
}

export const GenerationChanged = ({ onDone }: Props) => {
	return <CenteredText onDone={onDone}>New generation</CenteredText>
}
