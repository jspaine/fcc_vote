import Router from 'koa-router'

import local from './local'
import github from './github'

local.setup()
github.setup()

const router = new Router({
  prefix: '/auth'
})

router.use('/local', local.router.routes())
router.use('/github', github.router.routes())

export default router
