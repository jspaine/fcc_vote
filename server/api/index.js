import Router from 'koa-router'
import user from './user'
import poll from './poll'

const router = new Router({
  prefix: '/api'
})

router.use('/users', user.routes())
router.use('/polls', poll.routes())

export default router