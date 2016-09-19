import mongoose from 'mongoose'

import Vote from '../vote/model'
const {Schema} = mongoose

const OptionSchema = new Schema({
  title: {
    type: String,
    required: true
  }
})

export const PollSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  owner: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  options: [OptionSchema]
})

PollSchema.path('options').validate(function(options) {
  return options && options.length >= 2
}, 'Need at least two options')

PollSchema.path('options').validate(function(options) {
  return options.reduce((acc, option, i) => {
    if (acc) {
      options.some((e, j) =>
          i !== j &&
            e.title.toLowerCase() === option.title.toLowerCase()
      )
    }
  }, true)
}, 'Options must be unique')

export default mongoose.model('Poll', PollSchema)
