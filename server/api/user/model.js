import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import thenifyAll from 'thenify-all'

const crypt = thenifyAll(bcrypt, {}, ['hash', 'compare'])

const {Schema} = mongoose
const authProviders = ['github']

export const UserSchema = new Schema({
  username: {
    type: String,
    default: null
  },
  email: {
    type: String,
    lowercase: true,
    default: null
  },
  role: {
    type: String,
    default: 'user'
  },
  ip: {
    type: String,
    default: null
  },
  password: {
    type: String,
    select: false,
    default: null
  },
  image: {
    type: String,
    default: null
  },
  provider: {
    type: String,
    default: 'local'
  }
})

UserSchema.path('email')
  .validate(function(email) {
    if (authProviders.find(p => p === this.provider)) return true
    if (this.role === 'guest') return true
    return email && email.length
  }, 'Email can\'t be blank')

UserSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew && this.role !== 'guest') {
    const hash = await crypt.hash(this.password, 10)
    this.password = hash
  }
  next()
})

UserSchema.method('authenticate', async function(password) {
  return await crypt.compare(password, this.password)
})

export default mongoose.model('User', UserSchema)
