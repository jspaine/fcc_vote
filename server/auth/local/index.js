import Router from 'koa-router'
import passport from 'koa-passport'
import {Strategy as LocalStrategy} from 'passport-local'
import jwt from 'jsonwebtoken'

import config from '../../config'
import User from '../../api/user/model'

function setup() {
  passport.use(new LocalStrategy({ session: false },
    async function (username, password, done) {
      try {
        const user = await User.findOne({ username })
          .select('+password')
        if (!user) return done(null, null, { error: 'Invalid user'})

        const authenticated = await user.authenticate(password)
        if (authenticated) return done(null, {
          _id: user._id,
          role: user.role,
          image: user.image,
          username,
        })

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
      const token = jwt.sign(user, config.secrets.token)
      const decoded = jwt.decode(token)
      ctx.body = {
        username: user.username,
        image: user.image,
        token,
        ...decoded
      }
      if (config.useCookie) {
        ctx.cookies.set('token', token)
      }
    }
  })(ctx, next))

export default { setup, router }
