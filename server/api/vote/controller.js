import Vote from './model'
import Poll from '../poll/model'
import User from '../user/model'

export default {
  index: async (ctx) => {
    ctx.body = await Vote.find()
      .where({poll: ctx.params.pid})
      .sort({at: 'desc'})
      .populate('user', {
        username: true,
        image: true
      })
      .lean()
  },
  create: async (ctx) => {
    const ip = ctx.request.headers['x-forwarded-for'] || ctx.request.ip
    const user = await getUser(ctx.state.user, ip)
    const option = await getOption(ctx.params.pid, ctx.request.body, user)

    const vote = await Vote.create({
      poll: ctx.params.pid,
      option: option._id,
      user: user._id
    })

    const populated = await vote.populate('poll user')
      .execPopulate()

    ctx.body = populated
  }
}

async function getUser(user, ip) {
  if (user) {
    return user
  }

  const userFromIp = await User.findOne()
    .where({ip})

  if (userFromIp) {
    return userFromIp
  }

  const newUser = await User.create({
    role: 'guest',
    provider: null,
    ip
  })

  return newUser
}

async function getOption(pollId, option, user) {
  if (option._id) {
    return option
  }

  if (user.role === 'guest') return

  const poll = await Poll.findById(pollId)
  const unique = poll.options.reduce((acc, o) =>
    acc && o.title !== option.title,
    true
  )

  if (!unique) throw new Error('duplicate option')

  const updatedPoll = await Poll.findByIdAndUpdate(pollId, {
    $push: {
      options: {title: option.title}
    }
  }, {new: true})

  return updatedPoll.options.find(o => o.title === option.title)
}
