import { Router } from 'express'
import { HttpContext } from '../http-context'
import { AppRouter } from './app-router'

export const appController =
	(url: string, builder: (router: AppRouter, context: HttpContext) => void) =>
	(target: Router, context: HttpContext) => {
		const router = new AppRouter()

		builder(router, context)

		target.use(url, router.getNativeRouter())
	}
