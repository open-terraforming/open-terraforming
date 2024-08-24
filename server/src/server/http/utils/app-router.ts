import { NextFunction, Request, Response, Router } from 'express'

type RouteHandler = (
	req: Request,
	res: Response,
	next: NextFunction,
) => void | Promise<void>

const asyncRouteWrapper =
	(handler: RouteHandler) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await handler(req, res, next)
		} catch (err) {
			next(err)
		}
	}

/**
 * A class that wraps the express Router to provide a async API.
 */
export class AppRouter {
	private router = Router({ mergeParams: true })

	get(route: string, handler: RouteHandler) {
		this.router.get(route, asyncRouteWrapper(handler))
	}

	post(route: string, handler: RouteHandler) {
		this.router.post(route, asyncRouteWrapper(handler))
	}

	put(route: string, handler: RouteHandler) {
		this.router.put(route, asyncRouteWrapper(handler))
	}

	delete(route: string, handler: RouteHandler) {
		this.router.delete(route, asyncRouteWrapper(handler))
	}

	use(
		middleware: (
			req: Request,
			res: Response,
			next: NextFunction,
		) => void | Promise<void>,
	) {
		this.router.use(middleware)
	}

	getNativeRouter() {
		return this.router
	}
}
