import webpack from 'webpack'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import HtmlWebpackTemplate from 'html-webpack-template'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import autoprefixer from 'autoprefixer'

const devServerPort = 8080

const vendor = ['babel-polyfill', 'whatwg-fetch', 'rxjs', 'react',
  'react-dom', 'react-toolbox', 'react-router',  'react-router-redux',
  'redux', 'redux-thunk', 'react-redux', 'redux-form',
  'redux-observable', 'd3', 'react-faux-dom', 'normalizr', 'moment']

const common = {
  entry: {
    app: [
      'babel-polyfill',
      'whatwg-fetch',
      path.join(__dirname, 'app', 'app.js')
    ],
    vendor
  },
  output: {
    path: path.join(__dirname, 'public'),
    publicPath: '/',
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
      },

    ]
  },
  resolve: {
    alias: {
      store: path.resolve(__dirname, 'app', 'store'),
      containers: path.resolve(__dirname, 'app', 'containers'),
      components: path.resolve(__dirname, 'app', 'components')
    }
  },
  sassLoader: {
    data: '@import "theme/_config.scss";',
    includePaths: [path.resolve(__dirname, 'app')]
  },
  postcss: [autoprefixer],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new HtmlWebpackPlugin({
      title: 'Koa Vote',
      template: path.resolve(__dirname, 'app', 'index.ejs'),
      //'node_modules/html-webpack-template/index.ejs',
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
    app: [
      'react-hot-loader/patch',
      ...common.entry.app
    ],
    vendor: [
      'react-hot-loader/patch',
      ...common.entry.vendor
    ],
    ...common.entry
  },
  output: {
    ...common.output,
    filename: '[name].js',
    devtoolModuleFilenameTemplate: '/[absolute-resource-path]'
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
  module: {
    ...common.module,
    loaders: [
      ...common.module.loaders,
      {
        test: /\.css$|\.scss$/,
        loader: 'style!css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEVELOPMENT__: true
    }),
    ...common.plugins,
  ],
  devtool: 'eval-source-map'
}

const prod = {
  ...common,
  module: {
    ...common.module,
    loaders: [
      ...common.module.loaders,
      {
        test: /\.css$|\.scss$/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass'
        )
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].[chunkhash].css', { allChunks: true }),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    }),
    new webpack.optimize.DedupePlugin,
    // new webpack.optimize.OccurenceOrderPlugin,
    new webpack.DefinePlugin({
      '__DEVELOPMENT__': false,
      'process.env': { 'NODE_ENV': '"production"'}
    }),
    ...common.plugins
  ],
  devtool: 'source-map'
}

let config

if (process.env.NODE_ENV === 'production')
  config = prod
else
  config = dev

export default config
