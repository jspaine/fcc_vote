import Router from 'koa-router'
import controller from './user.controller.js'

const router = new Router()

router.get('/', controller.index)
router.post('/', controller.create)
router.get('/me', controller.me)
router.put('/:id/password', controller.update)
router.get('/:id', controller.show)
router.del('/:id', controller.remove)


export default router