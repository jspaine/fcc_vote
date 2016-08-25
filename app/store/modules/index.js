import {combineReducers} from 'redux'
import {combineEpics} from 'redux-observable'
import {routerReducer as routing} from 'react-router-redux'
import {reducer as form} from 'redux-form'

import auth, {loginEpic} from './auth'

import polls, {
  loadPollsEpic,
  savePollEpic
} from './polls'

import votes, {
  loadVotesEpic
} from './votes'

import ui from './ui'

export const rootReducer = combineReducers({
  auth,
  polls,
  votes,
  ui,
  routing,
  form
})

export const rootEpic = combineEpics(
  loginEpic,
  loadPollsEpic,
  savePollEpic,
  loadVotesEpic
)
