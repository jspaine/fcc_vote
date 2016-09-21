import Router from 'koa-router'
import passport from 'koa-passport'
import {Strategy as GoogleStrategy} from 'passport-google-oauth2'
import jwt from 'jsonwebtoken'

import config from '../../config'
import User from '../../api/user/model'

function setup(rootUrl) {
  passport.use(new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: rootUrl + config.google.callbackURL
    }, async function(accessToken, refreshToken, profile, cb) {
      console.log('google profile', profile)
      try {
        const user = await User.findOne({'google.id': profile._json.id})
        if (!user) {
          const newUser = new User({
            username: profile.displayName,
            provider: 'google',
            image: profile._json.image.url,
            google: {id: profile._json.id}
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
  .get('/', (ctx, next) => passport.authenticate('google', {
    scope: 'openid profile',
    failureRedirect: '/login',
    session: true
  })(ctx, next))
  .get('/callback', (ctx, next) => passport.authenticate('google', {
    scope: 'openid profile',
    failureRedirect: '/login',
    session: true
  }, (user, info) => {
    if (!user) {
      ctx.status = 401
      ctx.body = info
    } else {
      const strippedUser = {
        _id: user._id,
        username: user.username,
        provider: user.provider,
        image: user.image,
        google: user.google
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
