import { default as configData } from '../config'
import { join } from 'path'

export const config = configData

export const cachePath = join(__dirname, '..', '.cache')
