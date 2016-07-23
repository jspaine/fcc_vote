import webpack from 'webpack'
import nodeExternals from 'webpack-node-externals'
import path from 'path'
import merge from 'webpack-merge'

import packageJSON from './package.json'

const { 
  dependencies = {}, 
  devDependencies = {}, 
  peerDependencies = {}, 
  optionalDependencies = {} 
} = packageJSON

const dependencyNames = Array.from(new Set([ 
  ...Object.keys(dependencies),
  ...Object.keys(devDependencies),
  ...Object.keys(peerDependencies),
  ...Object.keys(optionalDependencies)
]))

const externals = dependencyNames.reduce(
  (externals, name) => Object.assign({}, externals, { [name]: 'commonjs ' + name }), {}
)

const config = {
   entry: [
    path.join(__dirname, 'server', 'app.js')
  ],
  output: {
    path: path.join(__dirname, 'server'),
    filename: 'bundle.js'
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false
  },
  externals,
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(
      'require("source-map-support").install();',
      { raw: true, entryOnly: false }
    ),
    /*new WatchIgnorePlugin([
      './app/app.js',
    ]),*/
  ],
  devtool: 'sourcemap'
}

export default config