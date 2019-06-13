const webpack = require('webpack')
const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const baseConfig = require('./webpack.base.config')

module.exports = merge(baseConfig, {
  target: 'node',
  //devtool: false,
  //devtool: "inline-source-map",
  //devtool: "eval-source-map",
  devtool: "source-map",
  entry: './src/server-entry.js',
  output: Object.assign({}, baseConfig.output, {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  }),
  resolve: {
    alias: Object.assign({}, baseConfig.resolve.alias, {
      'create-dao': './create-dao-server.js',
      'analytics': './analytics-server.js'
    })
  },
  //externals: Object.keys(require('../package.json').dependencies),
  externals: nodeExternals({
    whitelist: /\.css$/
  }),
  plugins: (baseConfig.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"'
    }),
    new VueLoaderPlugin(),
    new VueSSRServerPlugin()
  ])
})
