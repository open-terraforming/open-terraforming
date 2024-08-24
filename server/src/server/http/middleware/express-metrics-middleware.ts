import { globalConfig } from '@/config'
import { httpRequestCount, httpRequestDuration } from '@/utils/metrics'
import { NextFunction, Request, Response } from 'express'

type AppResponse = Response & {
	[START_TIME_SYMBOL]?: number
}

const START_TIME_SYMBOL = Symbol('startTime')

function onRequestEnd(this: AppResponse) {
	const time = Date.now() - (this[START_TIME_SYMBOL] ?? Date.now())

	this.removeListener('finish', onRequestEnd)
	this.removeListener('error', onRequestEnd)

	const route = this.req?.originalUrl ?? undefined

	if (route !== globalConfig.metrics.endpoint) {
		const status = this.statusCode

		const labels = {
			route,
			method: this.req?.method,
			status,
		}

		httpRequestCount.inc(labels)

		// observe normalizing to seconds
		httpRequestDuration.observe(labels, time / 1000)
	}
}

export const expressMetricsMiddleware = (
	_req: Request,
	res: AppResponse,
	next: NextFunction,
) => {
	res[START_TIME_SYMBOL] = Date.now()

	res.on('finish', onRequestEnd)
	res.on('error', onRequestEnd)

	next()
}
