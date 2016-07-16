import webpack from 'webpack'
import koa from 'koa'
import Router from 'koa-router'
import bodyparser from 'koa-bodyparser'
import serve from 'koa-static'
import convert from 'koa-convert'
import passport from 'koa-passport'
import koajwt from 'koa-jwt'
import mongoose from 'mongoose'

import webpackDevMiddleware from './middleware/webpackDevMiddleware'
import webpackConfig from './webpack.client'

import config from './config'
import authRoutes from './auth'
import apiRoutes from './api'

const env = process.env.NODE_ENV || 'development'

mongoose.Promise = global.Promise
mongoose.connect(config.mongo.uri, config.mongo.options)
if (config.mongo.seed) require('./config/seed')

const app = new koa()
app.use(bodyparser())

const compiler = webpack(webpackConfig)

if (env === 'development') {
  app.use(convert(webpackDevMiddleware(
    compiler, 
    config.webpack.options, 
    config.webpack.port
  )))
} else {
  compiler.run((err, stats) => {
    if (err) console.error(err)
  })
  app.use(convert(serve('public')))
}

app.use(koajwt({ secret: config.secret }).unless({
  path: ['', '/index.html', '/', /^\/.*\.js$/, /^\/auth\/local/]
}))

app.use(apiRoutes.routes())
app.use(authRoutes.routes())
app.use(passport.initialize())

app.listen(config.koa.port, () => {
  console.log('server listening on port', config.koa.port)
})

export default app