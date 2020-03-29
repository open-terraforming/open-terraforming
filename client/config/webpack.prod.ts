import baseConfig from './webpack.base'

process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

export default baseConfig('production')
