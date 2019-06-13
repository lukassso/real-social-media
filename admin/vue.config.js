const path = require('path');

module.exports = {
  devServer: {
    port: 8008,
    proxy: {
      '^/api': {
        target: process.env.API_SERVER || 'http://localhost:8002',
        ws: true
      }
    }
  },
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      alias: {
        "api": path.resolve(__dirname, 'src/api/index.js'),
        'i18n': path.resolve(__dirname, '../i18n')
      },
      symlinks: false
    },
    module: {
      rules: [
        {
          test: /\.ejs$/,
          loader: 'ignore-loader'
        }
      ]
    }
  }
}
