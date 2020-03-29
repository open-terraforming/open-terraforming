import baseConfig from './webpack.base'

process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

export default baseConfig('development')
