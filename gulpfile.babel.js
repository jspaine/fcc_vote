import gulp from 'gulp'
import webpack from 'webpack'
import Server from 'karma/lib/server'

import webpackServer from './webpack.server.config'
import webpackClient from './webpack.client.config'

let webpackDevServer, nodemon
if (process.env.NODE_ENV !== 'production') {
  webpackDevServer = require('webpack-dev-server')
  nodemon = require('nodemon')
}

gulp.task('build-server', (done) => {
  webpack(webpackServer).run((err, stats) => {
    if (err) console.error(err)
    else console.log(stats.toString())
    done()
  })
})

gulp.task('build-client', ['build-server'], (done) => {
  webpack(webpackClient).run((err, stats) => {
    if (err) console.error(err)
    else console.log(stats.toString())
    done()
  })
})

gulp.task('watch-server', (done) => {
  let built = false
  webpack(webpackServer).watch({}, (err, stats) => {
    if (err) {
      console.error('Error', err)
    } else {
      console.log(stats.toString({
        colors: true,
        chunks: false
      }))
      if (!built) {
        built = true
        done()
      }
    }
  })
})

gulp.task('watch-client', ['watch-server'], () => {
  const compiler = webpack(webpackClient)
  new webpackDevServer(compiler, webpackClient.devServer)
    .listen(webpackClient.devServer.port, () => {
      // new Server({
      //   configFile: __dirname + '/karma.conf.js'
      // }).start()
    })
})

gulp.task('build', ['build-server', 'build-client'])

gulp.task('watch', ['watch-server', 'watch-client'], () => {
  nodemon({
    watch: 'server/bundle.js',
    exec: "node ./server/bundle.js & NODE_ENV=test mocha-webpack"
  }).on('restart', () => console.log('restarting server'))
})
