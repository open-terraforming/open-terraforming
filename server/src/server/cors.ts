import { Request, Response } from 'express'

export const corsMiddleware = () => (
	req: Request,
	res: Response,
	next: () => void
) => {
	res.header('Access-Control-Allow-Origin', '*')

	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS, DELETE')

	res.header(
		'Access-Control-Allow-Headers',
		'Accept-Language, ev-user, Content-type'
	)

	if (req.method.toLowerCase() === 'options') {
		res.send()
	} else {
		next()
	}
}
