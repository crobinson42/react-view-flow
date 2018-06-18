const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const webpackConfig = require('./webpack.config')

module.exports = {
  entry: path.join(__dirname, '/example/src/index.jsx'),

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080,
  },

  mode: 'development',

  module: webpackConfig.module,

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/example/src/index.html'),
    }),
  ],

  resolve: webpackConfig.resolve,
}
