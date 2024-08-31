import { useToggle } from '@/utils/hooks'
import { ReactNode } from 'react'
import { Button, ButtonProps } from '../Button/Button'

type Props = {
	/** Dialog renderer callback */
	dialog: (onClose: () => void) => ReactNode
} & ButtonProps

export const DialogButton = ({ dialog, ...props }: Props) => {
	const [show, toggleShow] = useToggle()

	return (
		<>
			<Button onClick={toggleShow} {...props} />
			{show && dialog(toggleShow)}
		</>
	)
}
