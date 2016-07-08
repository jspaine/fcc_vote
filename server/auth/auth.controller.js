import jwt from 'jsonwebtoken'
import config from '../config'
  
export default {
  login: async (ctx) => {
    const token = jwt.sign({ 
      _id: '577fc489d01cc29d36a65534',
    }, config.secret)
    ctx.body = token
  }
}