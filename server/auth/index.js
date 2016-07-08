import Router from 'koa-router'
import controller from './auth.controller.js'

const router = new Router({
  prefix: '/auth'
})

router.get('/login', controller.login)

export default router