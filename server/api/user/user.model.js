import mongoose from 'mongoose'

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

UserSchema.methods = {
  authenticate: password => password === this.password
}

export default mongoose.model('User', UserSchema)