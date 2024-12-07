import { useAnimatedNumber } from '@/utils/hooks'

type Props = {
	value: number
	initialValue?: number
	delay?: number
}

export const AnimatedNumber = ({ value, initialValue, delay }: Props) => {
	return <span>{useAnimatedNumber(value, delay, initialValue)}</span>
}
