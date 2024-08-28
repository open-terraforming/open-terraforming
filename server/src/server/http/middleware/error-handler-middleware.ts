import { Request, Response } from 'express'

export const errorHandlerMiddleware = (
	err: Error,
	_req: Request,
	res: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	next: () => void,
) => {
	// TODO: logger.error(err)

	res.status(500).json({
		error: err.message,
	})
}
