import Router from 'koa-router'

import local from './local'
import github from './github'
import google from './google'

import config from '../config'

const rootUrlWithPort = `${config.protocol}://${config.host}:${config.port}`
const rootUrlNoPort = `${config.protocol}://${config.host}`
const rootUrl = config.host === 'localhost' ? rootUrlWithPort : rootUrlNoPort

local.setup()
github.setup(rootUrl)
google.setup(rootUrl)

const router = new Router({
  prefix: '/auth'
})

router.use('/local', local.router.routes())
router.use('/github', github.router.routes())
router.use('/google', google.router.routes())

export default router
