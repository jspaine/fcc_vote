import Vote from './model'
import Poll from '../poll/model'

export default {
  index: async (ctx) => {
    ctx.body = await Vote.find()
      .where({poll: ctx.params.pid})
      .populate('user', {
        username: true,
        image: true
      })
  },
  create: async (ctx) => {
    await Vote.create({
      poll: ctx.params.pid,
      option: ctx.params.oid,
      user: ctx.state.user._id
    })
  }
}
