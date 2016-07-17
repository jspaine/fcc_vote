import webpack from 'webpack'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import HtmlWebpackTemplate from 'html-webpack-template'

const devServerPort = 8080

const vendor = ['react', 'react-dom', 'react-hot-loader', 'react-router']

const common = {
  entry: {
    app: [
      'react-hot-loader/patch',
      path.join(__dirname, 'app', 'app.js')
    ],
    vendor: [
      'react-hot-loader/patch',
      ...vendor
    ]
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].[hash].js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0', 'react'],
          plugins: ['react-hot-loader/babel']
        }
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new HtmlWebpackPlugin({ 
      title: 'Koa Vote',
      template: 'node_modules/html-webpack-template/index.ejs',
      appMountId: 'app',
      inject: false,
      filename: './index.html'
    }),
  ]
}

const dev = {
  ...common,
  entry: {
    hot: [
      'react-hot-loader/patch',
      `webpack-dev-server/client?http://localhost:${devServerPort}`,
      'webpack/hot/only-dev-server'
    ],
    ...common.entry
  },
  output: {
    ...common.output,
    filename: '[name].js'
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    stats: { 
      colors: true,
      chunks: false
    },
    port: devServerPort
  },
  devtool: 'eval-source-map'
}

const prod = {
  ...common,
  devtool: 'source-map'
}

let config

if (process.env.NODE_ENV === 'production')
  config = prod
else
  config = dev

export default config