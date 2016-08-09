import Router from 'koa-router'

import vote from '../vote'
import controller from './controller'
import auth from '../../lib/authService'

const router = new Router()

router.get('/', controller.index)
router.get('/:id', controller.show)
router.post('/', auth.isAuthenticated, controller.create)
router.put('/:id', auth.isAuthenticated, controller.update)
router.del('/:id', auth.isAuthenticated, controller.del)
router.use('/:pid/vote', vote.routes())

export default router