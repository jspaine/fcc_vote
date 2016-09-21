import Router from 'koa-router'

import local from './local'
import github from './github'

import config from '../config'

const rootUrl = `${config.protocol}://${config.host}:${config.port}`

local.setup()
github.setup(rootUrl)

const router = new Router({
  prefix: '/auth'
})

router.use('/local', local.router.routes())
router.use('/github', github.router.routes())

export default router
