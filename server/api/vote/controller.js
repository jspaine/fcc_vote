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
    const ip = ctx.request.headers['x-forwarded-for'] || ctx.request.ip
    const user = await getUser(ctx.state.user, ip)
    const option = await getOption(ctx.params.pid, ctx.request.body, user)

    // console.log('saving vote', {
    //   poll: ctx.params.pid,
    //   option: option._id,
    //   user: user._id
    // })

    const vote = await Vote.create({
      poll: ctx.params.pid,
      option: option._id,
      user: user._id
    })
    // console.log('saved vote', {
    //   poll: vote.poll,
    //   option: vote.option,
    //   user: vote.user
    // })
    const populated = await vote.populate('poll user')
      .execPopulate()

    // console.log('populated vote', {
    //   poll: populated.poll,
    //   option: populated.option,
    //   user: fetchedUser
    // })

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
    ip
  })
  return newUser
}

async function getOption(pollId, option, user) {
  if (option._id) {
    return option
  }
  if (user.role !== 'guest') {
    const poll = await Poll.findByIdAndUpdate(pollId, {
      $push: {
        options: {title: option.title}
      }
    }, {new: true})
    console.log('poll', poll)
    return poll.options.find(o => o.title === option.title)
  }
}
