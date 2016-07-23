import koa from 'koa'
import Router from 'koa-router'
import bodyparser from 'koa-bodyparser'
import serve from 'koa-static'
import convert from 'koa-convert'
import passport from 'koa-passport'
import koajwt from 'koa-jwt'
import mongoose from 'mongoose'

import webpackDevProxy from './lib/webpackDevProxy'
import webpackClientConfig from '../webpack.client.config'
import config from './config'
import seedDb from './lib/seedDb'
import authRoutes from './auth'
import apiRoutes from './api'

const env = process.env.NODE_ENV || 'development'

mongoose.Promise = global.Promise
mongoose.connect(config.db.uri, config.db.options)
if (config.db.seed) seedDb()

const app = new koa()
app.use(bodyparser())

if (env === 'production') {
  app.use(convert(serve('public')))
} else {
  app.use(convert(webpackDevProxy(webpackClientConfig.devServer.port)))
}

app.use(koajwt({ secret: config.secrets.token, passthrough: true }))

app.use(passport.initialize())
app.use(authRoutes.routes())
app.use(apiRoutes.routes())

if (env !== 'test') {
  app.listen(config.port, () => {
    console.log('server listening on port', config.port)
  })
}

export default app