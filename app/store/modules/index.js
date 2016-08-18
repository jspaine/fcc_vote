import {combineReducers} from 'redux'
import {combineEpics} from 'redux-observable'
import {routerReducer as routing} from 'react-router-redux'
import {reducer as form} from 'redux-form'

import auth from './auth'
import {loginEpic} from './auth'

import polls from './polls'
import {loadPollsEpic} from './polls'

export const rootReducer = combineReducers({
  auth,
  polls,
  routing,
  form
})

export const rootEpic = combineEpics(
  loginEpic,
  loadPollsEpic
)
