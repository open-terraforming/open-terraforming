import { Input } from '@/components/Input/Input'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRef } from 'react'
import styled from 'styled-components'

type Props = {
	id: string
}

export const LobbyInviteLink = ({ id }: Props) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const inviteLink = `${window.location.origin}/#${id}`

	const handleCopy = () => {
		inputRef.current?.select()

		inputRef.current?.select()
		inputRef.current?.setSelectionRange(0, 99999)

		navigator.clipboard.writeText(inviteLink)
	}

	return (
		<InviteLink>
			<div>Invite link</div>
			<InviteInput ref={inputRef} value={inviteLink} readOnly />
			<Copy onClick={handleCopy}>
				<FontAwesomeIcon icon={faCopy} />{' '}
			</Copy>
		</InviteLink>
	)
}

const InviteLink = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-bottom: 1rem;
`

const InviteInput = styled(Input)`
	flex: 1;
`

const Copy = styled.div`
	cursor: pointer;
`
