import Router from 'koa-router'
import passport from 'koa-passport'
import {Strategy as LocalStrategy} from 'passport-local'
import jwt from 'jsonwebtoken'

import config from '../../config'
import User from '../../api/user/user.model.js'

function setup() {
  passport.use(new LocalStrategy({ session: false }, 
    async function (username, password, done) {
      try {
        const user = await User.findOne({ name: username })
        
        if (!user) return done(null, null, { error: 'Invalid user'})
        if (password === user.password) return done(null, {_id: user._id, role: user.role})
        return done(null, null, { error: 'Invalid login' })
      } catch (err) { 
        done(err) 
      }
    }
  ))
}

const router = new Router()
  .post('/', (ctx, next) => passport.authenticate('local', { session: false }, (user, info) => {
    if (!user) {
      ctx.status = 401
      ctx.body = info
    } else {
      const token = jwt.sign(user, config.secret)
      ctx.body = { token }
      return next()
    }
  })(ctx, next))

export default { setup, router }