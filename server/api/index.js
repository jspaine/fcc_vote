import Router from 'koa-router'
import user from './user'

const router = new Router({
  prefix: '/api'
})

router.use('/users', user.routes())
router.get('/', ctx => ctx.body = '/api')

export default router