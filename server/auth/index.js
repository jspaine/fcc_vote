import Router from 'koa-router'

import local from './local'

local.setup()

const router = new Router({
  prefix: '/auth'
})

router.use('/local', local.router.routes())

export default router