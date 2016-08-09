import Vote from './model'
import Poll from '../poll/model'

export default {
  create: async (ctx) => {
    await Vote.create({
      poll: ctx.params.pid,
      option: ctx.params.oid,
      user: ctx.state.user._id
    })
  }
}