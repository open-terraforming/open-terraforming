import React, { useRef, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { rgba } from 'polished'
import { Portal } from '@/components'

type Props = {
	children: React.ReactNode
	color?: string
	textColor?: string
	onDone: () => void
}

export const CenteredText = ({
	children,
	onDone,
	color = '#4267B2',
	textColor = '#fff'
}: Props) => {
	const mounted = useRef(true)
	const doneRef = useRef(onDone)
	doneRef.current = onDone

	useEffect(() => {
		mounted.current = true

		return () => {
			mounted.current = false
		}
	}, [])

	useEffect(() => {
		setTimeout(() => {
			if (mounted.current) {
				doneRef.current()
			}
		}, 1500)
	}, [])

	return (
		<Portal>
			<CenteredContainer>
				<CenteredTitle textColor={textColor} color={color}>
					{children}
				</CenteredTitle>
			</CenteredContainer>
		</Portal>
	)
}

const CenteredContainer = styled.div`
	/*
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1000;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.2);

	animation-name: bg-in-out;
	animation-duration: 1500ms;
	animation-fill-mode: forwards;

	@keyframes bg-in-out {
		0% {
			opacity: 0;
		}
		5% {
			opacity: 1;
		}
		80% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
	*/
`

const CenteredTitle = styled.div<{ color: string; textColor: string }>`
	position: fixed;
	top: 20%;
	left: 2%;
	right: 2%;
	padding: 2rem;
	text-align: center;
	font-size: 200%;
	text-transform: uppercase;

	z-index: 1000;

	${props => css`
		color: ${props.textColor};
		background: linear-gradient(
			to right,
			${rgba(props.color, 0)} 0%,
			${rgba(props.color, 1)} 20%,
			${rgba(props.color, 1)} 80%,
			${rgba(props.color, 0)} 100%
		);
	`}

	animation-name: in-out;
	animation-duration: 1500ms;
	animation-fill-mode: forwards;

	@keyframes in-out {
		0% {
			top: -20%;
		}
		10% {
			top: 30%;
		}
		20% {
			top: 20%;
		}
		80% {
			opacity: 1;
			transform: scale(1);
		}
		100% {
			opacity: 0;
			transform: scale(2);
		}
	}
`
