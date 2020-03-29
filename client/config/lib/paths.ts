import path from 'path'

export const rootPath = (...parts: string[]) =>
	path.join(__dirname, '..', '..', ...parts)

export const srcPath = (...parts: string[]) =>
	path.join(__dirname, '..', '..', 'src', ...parts)
