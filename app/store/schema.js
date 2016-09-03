import {Schema, arrayOf} from 'normalizr'

export const poll = new Schema('polls', {idAttribute: '_id'})
export const option = new Schema('options', {idAttribute: '_id'})
export const vote = new Schema('votes', {idAttribute: '_id'})
export const user = new Schema('users', {idAttribute: '_id'})
export const arrayOfUsers = arrayOf(user)
export const arrayOfPolls = arrayOf(poll)
export const arrayOfVotes = arrayOf(vote)

poll.define({
  owner: user,
  options: arrayOf(option)
})

vote.define({
  poll,
  option,
  user
})
