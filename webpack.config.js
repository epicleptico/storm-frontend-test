const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const pkg = require('./package.json')

module.exports = {
  entry: './src/js/index.js',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].[hash].js'
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `npm.${packageName.replace('@', '')}`;
          },
        }
      }
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(['./build']),
    new HtmlWebpackPlugin({
      title: pkg.name,
      template: './src/index.html',
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      'filename': '[name].[hash].css',
      'chunkFilename': '[id].[hash].css'
    }),
    new CompressionPlugin(),
  ],
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        //{loader: MiniCssExtractPlugin.loader},
        {loader: "style-loader"},
        {loader: "css-loader"},
        {loader: "sass-loader"}
      ]
    },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.(ico)$/,
        use: {
          loader: 'file-loader'
        }
      }]
  }
}
