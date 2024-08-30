/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Logger {
	log(...args: any[]): void
	info(...args: any[]): void
	warn(...args: any[]): void
	trace(...args: any[]): void
	error(...args: any[]): void
	group(...args: any[]): void
	groupCollapsed(...args: any[]): void
	groupEnd(): void
	child(category: string): Logger
	duplicate(category: string): Logger
	setCategory(category: string): void
}
