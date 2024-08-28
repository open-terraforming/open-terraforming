import { Counter, Gauge, Histogram } from 'prom-client'

const HTTP_METRIC_LABEL_NAMES = ['route', 'method', 'status']

export const httpRequestDuration = new Histogram({
	name: 'http_request_duration_seconds',
	help: 'Duration of HTTP requests in seconds',
	labelNames: HTTP_METRIC_LABEL_NAMES,
})

export const httpRequestCount = new Counter({
	name: 'http_requests_total',
	help: 'Total number of HTTP requests',
	labelNames: HTTP_METRIC_LABEL_NAMES,
})

export const runningGamesGauge = new Gauge({
	name: 'running_games',
	help: 'Number of running games',
})

export const playerCountGauge = new Gauge({
	name: 'player_count',
	help: 'Number of players',
})
