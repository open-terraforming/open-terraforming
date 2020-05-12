module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/__tests__/**/*.test.ts?(x)'],
	moduleNameMapper: {
		'^@shared/(.*)$': '<rootDir>../shared/src/$1',
		'^@/(.*)$': '<rootDir>/src/$1'
	}
}
