import Vote from './model'
import Poll from '../poll/model'
import User from '../user/model'

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
    let user
    const ip = ctx.request.headers['x-forwarded-for'] || ctx.request.ip

    if (ctx.state.user) {
      user = ctx.state.user
    } else {
      user = await User.findOne()
        .where({ip})
    }

    if (!user) {
      user = await User.create({
        role: 'guest',
        ip
      })
    }

    ctx.body = await Vote.create({
      poll: ctx.params.pid,
      option: ctx.params.oid,
      user: user._id
    })
  }
}
