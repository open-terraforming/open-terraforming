import { applyProtocolDiff } from './applyProtocolDiff'
import { ProtocolDiff } from './getProtocolDiff'

describe(applyProtocolDiff.name, () => {
	it('applies difference', () => {
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

		const diff: ProtocolDiff<TestType> = {
			b: { v: 3 },
			c: null,
			d: { v: null },
			e: { v: { a: { v: 2 }, c: null } },
		}

		applyProtocolDiff(objA, diff)

		expect(objA).toEqual({
			a: 1,
			b: 3,
			d: null,
			e: { a: 2, b: 2 },
		})
	})

	describe('arrays', () => {
		it('changes order', () => {
			type TestType = { a: number[] }

			const objA: TestType = {
				a: [1, 2, 3],
			}

			const diff: ProtocolDiff<TestType> = {
				a: {
					v: {
						0: { v: 2 },
						1: { v: 3 },
						2: { v: 4 },
					},
				},
			}

			applyProtocolDiff(objA, diff)

			expect(objA).toEqual({
				a: [2, 3, 4],
			})
		})

		it('removes items', () => {
			type TestType = { a: number[] }

			const objA: TestType = {
				a: [1, 2, 3],
			}

			const diff: ProtocolDiff<TestType> = {
				a: {
					v: {
						length: { v: 2 },
						2: null,
					},
				},
			}

			applyProtocolDiff(objA, diff)

			expect(objA).toEqual({
				a: [1, 2],
			})

			expect(objA.a).toHaveLength(2)
		})
	})
})
