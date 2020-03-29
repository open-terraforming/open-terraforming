export {}

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			APP_API_URL: string
			NODE_ENV: 'development' | 'production'
		}
	}
}
