const webpack = require('webpack')

module.exports = (config) => {
  config.set({
    browsers: ['PhantomJS'],
    singleRun: false,
    frameworks: ['mocha'],
    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      'app/test/helpers.js',
      {pattern: 'app/**/*.spec.js'}
    ],
    preprocessors: {
      'app/test/helpers.js': ['webpack'],
      'app/**/*.spec.js': ['webpack', 'sourcemap']
    },
    reporters: ['mocha'],
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          {test: /\.js$/, exclude: /node_modules/, loaders: ['babel']}
        ]
      }
    },
    webpackMiddleware: {
      stats: 'errors-only'
    }
  })
}
