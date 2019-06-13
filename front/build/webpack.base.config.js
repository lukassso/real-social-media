const path = require('path')
const vueConfig = require('./vue-loader.config')

const webpack = require('webpack')

module.exports = {
  devtool: '#source-map',
  entry: {
    app: './src/client-entry.js'
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  plugins: [
    new webpack.DefinePlugin({
      GRECAPTCHA_SITE_KEY: JSON.stringify(process.env.GRECAPTCHA_SITE_KEY ||
          "6LfTWaIUAAAAAJEl6FKCDfFM5qfWPj-Dx1DNB48Y")
    })
  ],
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: '[name].[hash].js'
  },
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.json', ".vue"],
    aliasFields: ["browser"],
    alias: {
      "@": path.resolve(__dirname, '../src'),
      "api": path.resolve(__dirname, '../src/api/index.js'),
      'i18n': path.resolve(__dirname, '../../i18n')
    }
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueConfig
      },
      {
        test: /\.js$/,
       // include: ['src', 'node_modules'],
        exclude: /node_modules\/(?!((reactive-dao)|(reactive-dao-vue)|(gl-matrix)))/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.ejs$/,
        loader: 'ignore-loader'
      }
    ]
  },
  optimization: {
    //minimize: false
  }
}
