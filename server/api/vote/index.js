import Router from 'koa-router'

import controller from './controller'
import auth from '../../lib/authService'

const router = new Router

router.post('/:oid', auth.isAuthenticated, controller.create)

export default router