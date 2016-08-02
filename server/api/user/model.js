import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import thenifyAll from 'thenify-all'

const crypt = thenifyAll(bcrypt, {}, ['hash', 'compare'])

const {Schema} = mongoose
const authProviders = ['github']

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    lowercase: true,
    default: null,
    unique: true
  },
  role: {
    type: String,
    default: 'user'
  },
  password: String,
  provider: String
})

UserSchema.path('email')
  .validate(function(email) {
    if (authProviders.find(p => p === this.provider)) return true 
    return email && email.length
  }, 'Email can\'t be blank')

UserSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    const hash = await crypt.hash(this.password, 10)
    this.password = hash
  }
  next()
})

UserSchema.method('authenticate', async function(password) {
  return await crypt.compare(password, this.password)
})

export default mongoose.model('User', UserSchema)