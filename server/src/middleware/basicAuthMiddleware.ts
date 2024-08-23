import { NextFunction, Request, Response } from 'express'

export const basicAuthMiddleware =
	(auth: { username: string; password: string }) =>
	(req: Request, res: Response, next: NextFunction) => {
		const b64auth = (req.headers.authorization || '').split(' ')[1] || ''

		const [username, password] = Buffer.from(b64auth, 'base64')
			.toString()
			.split(':')

		if (
			!username ||
			!password ||
			username !== auth.username ||
			password !== auth.password
		) {
			res.set('WWW-Authenticate', 'Basic realm="401"')
			res.status(401).send('Authentication required.')

			return
		}

		next()
	}
