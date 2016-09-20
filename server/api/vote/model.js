import mongoose from 'mongoose'

const {Schema} = mongoose

export const VoteSchema = new Schema({
  poll: {
    type: Schema.ObjectId,
    ref: 'Poll',
    required: true
  },
  option: {
    type: Schema.ObjectId,
    required: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  at: {
    type: Date,
    default: Date.now
  }
})

VoteSchema.index({
  poll: 1,
  user: 1
}, {unique: true})

export default mongoose.model('Vote', VoteSchema)
