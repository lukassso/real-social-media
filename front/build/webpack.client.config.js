const webpack = require('webpack')
const merge = require('webpack-merge')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const vueConfig = require('./vue-loader.config')
const HTMLPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const baseConfig = require('./webpack.base.config.js')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const config = merge(baseConfig, {
  entry: {
    app: './src/client-entry.js',
    vendor: [
      'bootstrap-vue',
      'sockjs-client',
      'es6-promise',
      'vue',
      'vue-router'
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  resolve: {
    alias: Object.assign({}, baseConfig.resolve.alias, {
      'create-dao': './create-dao-client.js',
      'analytics': './analytics-client.js'
    })
  },
  plugins: (baseConfig.plugins || []).concat([
    // strip comments in Vue code
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"'
    }),
    /*// generate output HTML
    new HTMLPlugin({
      template: 'src/index.template.html',
      chunksSortMode: function(a, b) {
        var order = ["vendor", "app"];
        return order.indexOf(a.names[0]) - order.indexOf(b.names[0]);
      }
    })*/
    new VueLoaderPlugin(),
    new VueSSRClientPlugin()
  ])
})

console.log("CLIENT CONFIG", config.module.rules[0])

if (process.env.NODE_ENV === 'production') {
  // Use ExtractTextPlugin to extract CSS into a single file
  // so it's applied on initial render.
  // vueConfig is already included in the config via LoaderOptionsPlugin
  // here we overwrite the loader config for <style lang="stylus">
  // so they are extracted.
  vueConfig.loaders = {

  }

  config.plugins.push(
   // new ExtractTextPlugin('styles.[hash].css'),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
/*    new UglifyJSPlugin({

    }),*/
    new SWPrecachePlugin({
      cacheId: 'vue-hn',
      filename: 'service-worker.js',
      dontCacheBustUrlsMatching: /./,
      staticFileGlobsIgnorePatterns: [/index\.html$/, /\.map$/]
    }),
    //new BundleAnalyzerPlugin()
  )
}

module.exports = config
