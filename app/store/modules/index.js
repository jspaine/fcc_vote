import {combineReducers} from 'redux'
import {combineEpics} from 'redux-observable'
import {routerReducer as routing} from 'react-router-redux'
import {reducer as form} from 'redux-form'

import auth, {loginEpic} from './auth'
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
  loginEpic,
  fromPolls.loadPollsEpic,
  fromPolls.savePollEpic,
  fromPolls.deletePollEpic,
  fromVotes.loadVotesEpic,
  fromUsers.loadUsersEpic,
  fromUsers.saveUserEpic,
  fromUsers.deleteUserEpic
)

export const selectors = {
  getAllPolls(state) {
    return fromPolls.getAllPolls(state.polls, state.entities)
  },
  getPollById(state) {
    return function(id) {
      return fromPolls.getPollById(id, state.entities)
    }
  },
  getPollsPending(state) {
    return fromPolls.getIsPending(state.polls)
  },
  getAllVotes(state) {
    return fromVotes.getAllVotes(state.votes, state.entities)
  },
  getVotesPending(state) {
    return fromVotes.getIsPending(state.votes)
  },
}
