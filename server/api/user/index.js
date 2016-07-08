import Router from 'koa-router'
import controller from './user.controller.js'

const router = new Router()

router.get('/', controller.index)
router.get('/:id', controller.show)

export default router