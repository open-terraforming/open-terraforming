import { deepCopy } from '../collections'

test('deepCopy actually makes a copy', () => {
	const testObject = {
		v: {
			i: 0,
		},
		a: [{ i: 10, k: null }, { i: 5 }],
	}

	const d = deepCopy(testObject)
	d.v.i = 5
	d.a[0].i = 3
	d.a[1].i = 3

	expect(testObject.v.i).toEqual(0)
	expect(testObject.a[0].i).toEqual(10)
	expect(testObject.a[1].i).toEqual(5)
})
