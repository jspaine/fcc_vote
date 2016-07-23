import Router from 'koa-router'

import controller from './controller'
import auth from '../../lib/authService'

const router = new Router()

router.get('/', auth.isAuthenticated, controller.index)
router.post('/', controller.create)
router.get('/me', controller.me)
router.put('/:id/password', controller.update)
router.get('/:id', controller.show)
router.del('/:id', controller.remove)


export default router