import User from './user.model.js'
import jwt from 'jsonwebtoken'
import config from '../../config'

export default {
  index: async (ctx) => {
    const users = await User.find({}).exec()
    ctx.body = users
  },

  show: async (ctx) => {
    ctx.body = await User.find({ _id: ctx.params.id })
  },
  
  login: async (ctx) => {
    const token = jwt.sign({ 
      _id: '577fc489d01cc29d36a65534',
    }, config.secret)
    ctx.body = token
  }
}