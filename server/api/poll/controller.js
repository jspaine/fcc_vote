import Poll from './model'
import Vote from '../vote/model'

export default {
  index: async (ctx) => {
    const polls = await Poll.find()
      .sort({created: 'desc'})
      .populate('owner', {
        username: true,
        image: true
      })
      .lean()
    ctx.body = await Promise.all(polls.map(async (poll) => {
      return {
        ...poll,
        options: await countVotes(poll.options)
      }
    }))
  },

  create: async (ctx) => {
    const newPoll = new Poll(ctx.request.body)
    newPoll.owner = ctx.state.user._id

    const poll = await newPoll.save()
    ctx.body = poll
    ctx.status = 200
  },

  show: async (ctx) => {
    const poll = await Poll.findOne({_id: ctx.params.id})
      .populate('owner').lean()
    if (!poll) return ctx.status = 404
    ctx.body = {
      ...poll,
      options: await countVotes(poll.options)
    }
  },

  update: async (ctx) => {
    const poll = await Poll.findOne({_id: ctx.params.id})
    const {user} = ctx.state
    const {body} = ctx.request

    poll.title = body.title
    poll.description = body.description
    poll.updated = Date.now()
    poll.options = body.options

    if (user.role === 'admin' ||
        user._id === poll.owner.toString()) {
      const updatedPoll = await poll.save()
      ctx.body = updatedPoll
      ctx.status = 200
    } else {
      ctx.status = 403
    }
  },

  del: async (ctx) => {
    const poll = await Poll.findOne({_id: ctx.params.id})
    const {user} = ctx.state
    if (user.role === 'admin' ||
        user._id === poll.owner.toString()) {
      await Poll.findOneAndRemove({_id: ctx.params.id})
      ctx.body = poll
      ctx.status = 200
    } else {
      ctx.status = 403
    }
  }
}

async function countVotes(options) {
  return await Promise.all(options.map(async (option) => {
    return {
      ...option,
      votes: await Vote.count({option: option._id})
    }
  }))
}
