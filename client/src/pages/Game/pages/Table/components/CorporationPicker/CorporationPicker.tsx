import React, { useState } from 'react'
import { Modal } from '@/components/Modal/Modal'
import styled from 'styled-components'
import { useApi } from '@/utils/hooks'
import { Button } from '@/components'
import { pickCorporation } from '@shared/index'
import { Corporations, Corporation } from '@shared/corporations'

export const CorporationPicker = () => {
	const api = useApi()

	const [loading, setLoading] = useState(false)

	const handlePick = (c: Corporation) => {
		if (!loading) {
			setLoading(true)
			api.send(pickCorporation(c.code))
		}
	}

	return (
		<Modal open={true}>
			<Container>
				<h2>Pick a corporation</h2>
				{Corporations.map(c => (
					<Button disabled={loading} key={c.code} onClick={() => handlePick(c)}>
						{c.name}
					</Button>
				))}
			</Container>
		</Modal>
	)
}

const Container = styled.div``
