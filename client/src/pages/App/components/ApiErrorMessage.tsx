import React from 'react'
import { MessageModal } from '@/components/MessageModal/MessageModal'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import { setApiError } from '@/store/modules/api'

export const ApiErrorMessage = () => {
	const dispatch = useAppDispatch()
	const error = useAppStore((state) => state.api.error)

	return (
		<>
			{error && (
				<MessageModal
					opened={true}
					onClose={() => dispatch(setApiError(null))}
					type="error"
					title={'ERROR'}
					message={error}
				/>
			)}
		</>
	)
}
