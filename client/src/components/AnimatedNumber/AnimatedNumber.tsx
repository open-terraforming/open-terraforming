import React from 'react'
import { useAnimatedNumber } from '@/utils/hooks'

type Props = {
	value: number
	delay?: number
}

export const AnimatedNumber = ({ value, delay }: Props) => {
	return <span>{useAnimatedNumber(value, delay)}</span>
}
