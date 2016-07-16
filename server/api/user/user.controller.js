import User from './user.model.js'

export default {
  index: async (ctx) => {
    const users = await User.find({}).exec()
    ctx.body = users
  },

  show: async (ctx) => {
    ctx.body = await User.find({ _id: ctx.params.id })
  }  
}