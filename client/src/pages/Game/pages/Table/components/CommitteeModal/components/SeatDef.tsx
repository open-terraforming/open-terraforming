type Props = {
	id?: string
}

export const SeatDef = ({ id = 'seat' }: Props) => {
	return (
		<g id={id} stroke="#444">
			<rect
				x="-2"
				y="-2"
				width="4"
				height="4"
				fill="#919191"
				strokeWidth=".25"
			/>
			<g fill="#686868">
				<rect x="-2.5" y="1" width="5" height="1" strokeWidth=".25" />
				<rect x="-2.5" y="-1.5" width=".9" height="2.5" strokeWidth=".25" />
				<rect x="1.6" y="-1.5" width=".9" height="2.5" strokeWidth=".25" />
			</g>
		</g>
	)
}
