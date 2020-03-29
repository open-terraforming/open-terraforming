require('ts-node/register')
const loadEnv = require('./config/lib/env').loadEnv

loadEnv()

module.exports = {
	globals: {
		'process.env': process.env,
		'ts-jest': {
			tsConfig: 'tsconfig.test.json'
		}
	},
	roots: ['<rootDir>/src'],
	transform: {
		'^.+\\.tsx?$': 'ts-jest'
	},
	moduleNameMapper: {
		'\\.(css|less)$': '<rootDir>/node_modules/jest-css-modules',
		'^@/(.*)$': '<rootDir>src/$1'
	},
	modulePathIgnorePatterns: ['<rootDir>/.*/__mocks__']
}
