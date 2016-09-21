import Router from 'koa-router'

import local from './local'
import github from './github'
import google from './google'

import config from '../config'

const rootUrl = `${config.protocol}://${config.host}:${config.port}`
const rootUrlNoPort = `${config.protocol}://${config.host}`

local.setup()
github.setup(rootUrl)
google.setup(rootUrlNoPort)

const router = new Router({
  prefix: '/auth'
})

router.use('/local', local.router.routes())
router.use('/github', github.router.routes())
router.use('/google', google.router.routes())

export default router
