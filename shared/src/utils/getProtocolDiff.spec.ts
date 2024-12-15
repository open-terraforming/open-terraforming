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
			b: { s: 3 },
			c: null,
			d: { s: null },
			e: { v: { a: { s: 2 }, c: null } },
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
						0: { s: 2 },
						1: { s: 3 },
						2: { s: 4 },
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

		it('new object item', () => {
			type TestType = { a: { b: number }[] }

			const objA: TestType = {
				a: [{ b: 1 }, { b: 2 }],
			}

			const objB: TestType = {
				a: [
					{ b: 1 },
					{ b: 3 },
					{
						b: 4,
					},
				],
			}

			const diff = getProtocolDiff(objA, objB)

			expect(diff).toEqual({
				a: {
					v: {
						1: { v: { b: { s: 3 } } },
						2: { s: { b: 4 } },
						length: { v: 3 },
					},
				},
			})
		})
	})
})
