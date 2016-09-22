import Koa from 'koa'
import Router from 'koa-router'
import bodyparser from 'koa-bodyparser'
import serve from 'koa-static'
import compress from 'koa-compress'
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
//if (env === 'test') mongoose.set('debug', true)

const app = new Koa()
app.use(compress())
app.use(bodyparser())

if (env !== 'production')
  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      ctx.status = err.status || 500
      ctx.body = err.message
      ctx.app.emit('error', err, ctx)
    }
  })

app.use(koajwt({
  secret: config.secrets.token,
  passthrough: true,
  cookie: 'token'
}))

app.use(passport.initialize())
app.use(authRoutes.routes())
app.use(apiRoutes.routes())

app.use(async (ctx, next) => {
  if (!ctx.path.match(/\.js(?:on)?$|\.html$|\.(?:s)?css$|\.map$|\.ico$/)) {
    console.log(ctx.path, ' -> /')
    ctx.path = '/'
  }
  await next()
})

if (env === 'production') {
  app.use(serve('public'))
} else {
  app.use(convert(webpackDevProxy(webpackClientConfig.devServer.port)))
}

if (env === 'production') {
  app.listen(config.port, () => {
    console.log('server listening on port', config.port)
  })
} else if (env === 'development') {
  app.listen(config.port, '0.0.0.0', () => {
    console.log('server listening on port', config.port)
  })
}

export default app
