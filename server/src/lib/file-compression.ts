import { gunzip, gzip } from 'zlib'

export const fileCompression = {
	encode: (data: string) =>
		new Promise<Buffer>((resolve, reject) => {
			gzip(data, (err, compressed) => {
				if (err) {
					reject(err)
				}

				resolve(compressed)
			})
		}),
	decode: (data: Buffer) =>
		new Promise<string>((resolve, reject) => {
			gunzip(data, (err, decompressed) => {
				if (err) {
					reject(err)
				}

				resolve(decompressed.toString('utf-8'))
			})
		}),
}
