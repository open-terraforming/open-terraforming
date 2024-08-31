import styled, { useTheme } from 'styled-components'

type Props = {
	value: boolean
	onChange: (value: boolean) => void
}

export const Switch = ({ value, onChange }: Props) => {
	const theme = useTheme()

	const handleChange = () => {
		onChange(!value)
	}

	return (
		<Container
			onClick={handleChange}
			style={
				value
					? {
							backgroundColor: theme.colors.primary.base,
						}
					: {
							backgroundColor: '#333',
						}
			}
		>
			<Label
				style={
					value
						? { marginRight: '1.5rem', paddingLeft: '0.5rem' }
						: { marginLeft: '1.75rem' }
				}
			>
				{value ? 'ON' : 'OFF'}
			</Label>
			<Knob
				style={
					value
						? { left: '100%', transform: 'translate(-1.55rem, 0)' }
						: { left: '0.05rem' }
				}
			/>
		</Container>
	)
}

const Container = styled.div`
	border-radius: 0.5rem;
	background-color: #333;
	width: 3.5rem;
	position: relative;
	height: 1.5rem;
	border-radius: 1.5rem;
	transition: background-color 0.2s;
	cursor: pointer;
`

const Knob = styled.div`
	width: 1.4rem;
	height: 1.4rem;
	border-radius: 50%;
	background-color: ${({ theme }) => theme.colors.primary.light};
	position: absolute;
	top: 0.05rem;
	transition: all 0.2s;
`

const Label = styled.div`
	line-height: 1.5rem;
`
