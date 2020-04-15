module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleNameMapper: {
		'^@shared/(.*)$': '<rootDir>../shared/src/$1',
		'^@/(.*)$': '<rootDir>/src/$1'
	}
}
