import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import thenifyAll from 'thenify-all'

const crypt = thenifyAll(bcrypt, {}, ['genSalt', 'hash', 'compare'])

const {Schema} = mongoose
const authProviders = ['github']

const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    lowercase: true
  },
  role: {
    type: String,
    default: 'user'
  },
  password: String,
  provider: String,
  salt: String
})

UserSchema.path('email')
  .validate(function(email) {
    return authProviders.find(p => p === this.provider) ? true : email.length
  }, 'Email can\'t be blank')

UserSchema.pre('save', async function(next) {
  console.log('pre-save')
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await crypt.genSalt()
      const hash = await crypt.hash(this.password, salt)
      this.password = hash
    } catch (err) {
      next(err)
    }
  }
  next()
})

UserSchema.methods = {
  authenticate: async function(password) {
    return await crypt.compare(password, this.password)
  }
}

export default mongoose.model('User', UserSchema)