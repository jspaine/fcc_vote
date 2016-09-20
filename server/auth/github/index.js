import Router from 'koa-router'
import passport from 'koa-passport'
import {Strategy as GithubStrategy} from 'passport-github'
import jwt from 'jsonwebtoken'

import config from '../../config'
import User from '../../api/user/model'

function setup() {
  passport.use(new GithubStrategy({
      clientID: config.github.clientID,
      clientSecret: config.github.clientSecret,
      callbackURL: 'https://vote-23.herokuapp.com' + config.github.callbackURL
    }, async function(accessToken, refreshToken, profile, cb) {
      console.log('profile', profile)
      try {
        const user = await User.findOne({'github.id': profile.id})
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
        username: user.username,
        provider: 'github',
        image: user.image,
        github: user.github
      }
      const token = jwt.sign(strippedUser, config.secrets.token)

      if (config.useCookie) {
        ctx.cookies.set('token', token)
        ctx.redirect('/')
      } else {
        ctx.redirect(`/${token}`)
      }
    }
  })(ctx, next))

export default { setup, router }
