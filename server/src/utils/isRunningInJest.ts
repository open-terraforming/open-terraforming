export const isRunningInJest = () => {
	return process.env.JEST_WORKER_ID !== undefined
}
