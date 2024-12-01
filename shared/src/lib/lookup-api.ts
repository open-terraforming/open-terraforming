export const lookupApi = <T extends { code: string }>(list: T[]) => {
	let map: ReadonlyMap<string, T> | null = null
	let mapSourceLength = 0

	return {
		list,
		get data() {
			if (!map || mapSourceLength !== list.length) {
				map = new Map(list.map((c) => [c.code, c]))
				mapSourceLength = list.length
			}

			return map
		},

		get(code: string): T {
			const c = this.getOptional(code)

			if (c === undefined) {
				throw new Error(`Unknown item ${code}`)
			}

			return c
		},

		getOptional(code: string): T | undefined {
			return this.data.get(code)
		},
	}
}
