import jwt from 'jsonwebtoken'

import User from './model'
import config from '../../config'

export default {
  index: async (ctx) => {
    const users = await User.find()
    ctx.body = users
  },

  show: async (ctx) => {
    ctx.body = await User.findOne({ _id: ctx.params.id })
  },

  create: async (ctx) => {
    const newUser = new User(ctx.request.body)
    newUser.provider = 'local'

    const user = await newUser.save()
    const token = jwt.sign({ _id: user._id, role: user.role}, config.secrets.token, {
      expiresIn: 60 * 5
    })

    ctx.body = { 
      id: user._id,
      token 
    }
  },

  del: async (ctx) => {
    const {user} = ctx.state

    if (user.role === 'admin' || user._id === ctx.params.id) {
      await User.findOneAndRemove({ _id: ctx.params.id })
      ctx.status = 200
    } else {
      ctx.status = 401
    }
  },

  me: async (ctx) => {
    const user = await User.findOne({ _id: ctx.state.user._id })
    ctx.body = user
  },

  update: async (ctx) => {
    const user = await User.findOne({ _id: ctx.params.id })
    user.password = ctx.request.body.password

    await user.save()
    ctx.status = 200
  }
}