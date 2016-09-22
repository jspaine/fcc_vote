import {combineReducers} from 'redux'
import {combineEpics} from 'redux-observable'
import {routerReducer as routing} from 'react-router-redux'
import {reducer as form} from 'redux-form'

import auth, * as fromAuth from './auth'
import polls, * as fromPolls from './polls'
import options, * as fromOptions from './options'
import votes, * as fromVotes from './votes'
import users, * as fromUsers from './users'
import ui from './ui'
import entities from './entities'

export const rootReducer = combineReducers({
  auth,
  polls,
  options,
  votes,
  users,
  entities,
  ui,
  routing,
  form
})

export const rootEpic = combineEpics(
  fromAuth.loginEpic,
  fromPolls.loadPollsEpic,
  fromPolls.savePollEpic,
  fromPolls.deletePollEpic,
  fromVotes.loadVotesEpic,
  fromVotes.saveVoteEpic,
  fromUsers.loadUsersEpic,
  fromUsers.saveUserEpic,
  fromUsers.deleteUserEpic
)

export const selectors = {
  getAllPolls(state) {
    return fromPolls.getAllPolls(state.polls, state.entities)
  },
  getPollById(state, id) {
    return fromPolls.getPollById(id, state.polls, state.entities)
  },
  getPollsPending(state) {
    return fromPolls.getIsPending(state.polls)
  },
  getAllVotes(state) {
    return fromVotes.getAllVotes(state.votes, state.entities)
  },
  getPollVotes(state, pollId) {
    return fromVotes.getPollVotes(pollId, state.votes, state.entities)
  },
  getPollTotalVotes(state, pollId) {
    const poll = fromPolls.getPollById(pollId, state.polls, state.entities)
    return poll.options
      .reduce((acc, o) => acc + o.votes, 0)
  },
  getCanVote(state, userId, pollId) {
    if (!userId) return true
    return fromVotes.getCanVote(userId, pollId, state.votes, state.entities)
  },
  getVotesPending(state) {
    return fromVotes.getIsPending(state.votes)
  },
  getAllUsers(state) {
    return fromUsers.getAllUsers(state.users, state.entities)
  },
  getUserId(state) {
    return fromAuth.getUserId(state.auth)
  }
}
