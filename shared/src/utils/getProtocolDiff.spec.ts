import { getProtocolDiff } from './getProtocolDiff'

describe(getProtocolDiff.name, () => {
	it('returns difference', () => {
		type TestType = {
			a: number
			b: number
			c?: number
			d?: number | null
			e: { a: number; b: number; c?: number | null }
		}

		const objA: TestType = {
			a: 1,
			b: 2,
			c: 3,
			e: { a: 1, b: 2, c: null },
		}

		const objB: TestType = {
			a: 1,
			b: 3,
			d: null,
			e: { a: 2, b: 2 },
		}

		const diff = getProtocolDiff(objA, objB)

		expect(diff).toEqual({
			b: { v: 3 },
			c: null,
			d: { v: null },
			e: { v: { a: { v: 2 }, c: null } },
		})
	})

	describe('arrays', () => {
		it('order changed', () => {
			type TestType = { a: number[] }

			const objA: TestType = {
				a: [1, 2, 3],
			}

			const objB: TestType = {
				a: [2, 3, 4],
			}

			const diff = getProtocolDiff(objA, objB)

			expect(diff).toEqual({
				a: {
					v: {
						0: { v: 2 },
						1: { v: 3 },
						2: { v: 4 },
					},
				},
			})
		})

		it('removed item', () => {
			type TestType = { a: number[] }

			const objA: TestType = {
				a: [1, 2, 3],
			}

			const objB: TestType = {
				a: [1, 2],
			}

			const diff = getProtocolDiff(objA, objB)

			expect(diff).toEqual({
				a: {
					v: {
						2: null,
						length: { v: 2 },
					},
				},
			})
		})
	})
})
