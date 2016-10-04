import Router from 'koa-router'
import passport from 'koa-passport'
import {Strategy as GithubStrategy} from 'passport-github'
import jwt from 'jsonwebtoken'

import config from '../../config'
import User from '../../api/user/model'

function setup(rootUrl) {
  passport.use(new GithubStrategy({
      clientID: config.github.clientID,
      clientSecret: config.github.clientSecret,
      callbackURL: rootUrl + config.github.callbackURL
    }, async function(accessToken, refreshToken, profile, cb) {
      try {
        const user = await User.findOne({'github.id': profile._json.id})
        if (!user) {
          const newUser = new User({
            username: profile.username,
            provider: 'github',
            image: profile._json.avatar_url,
            github: {id: profile._json.id}
          })
          await newUser.save()
          return cb(null, newUser)
        }
        return cb(null, user)
      } catch (err) {
        cb(err)
      }
    }
  ))
}

const router = new Router()
  .get('/', (ctx, next) => passport.authenticate('github', {
    failureRedirect: '/login',
    session: false
  })(ctx, next))
  .get('/callback', (ctx, next) => passport.authenticate('github', {
    failureRedirect: '/login',
    session: false
  }, (user, info) => {
    if (!user) {
      ctx.status = 401
      ctx.body = info
    } else {
      const strippedUser = {
        _id: user._id,
        username: user.username,
        role: user.role || 'user',
        provider: 'github',
        image: user.image,
        github: user.github
      }
      const token = jwt.sign(strippedUser, config.secrets.token)

      if (config.useCookie) {
        ctx.cookies.set('token', token)
        ctx.redirect('/')
      } else {
        ctx.redirect(`/token/${token}`)
      }
    }
  })(ctx, next))

export default { setup, router }
