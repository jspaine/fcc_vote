import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/fromPromise'

import api from '../../lib/apiClient'

const LOGIN_REQUEST = 'auth/LOGIN_REQUEST'
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS'
const LOGIN_FAILURE = 'auth/LOGIN_FAILURE'
const LOGOUT = 'auth/LOGOUT'

const user = JSON.parse(localStorage.getItem('user'))
if (user) api.addDefaultHeader('Authorization', `Bearer ${user.token}`)

const initialState = {user}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loginError: null,
        user: null,
        loggingIn: true
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        user: action.user
      }
    case LOGIN_FAILURE:
      return {
        ...state,
        loggingIn: false,
        loginError: action.error
      }
    case LOGOUT:
      return {
        ...state,
        user: null
      }
    default: return state
  }
}

export const loginRequest = (data) => ({
  type: LOGIN_REQUEST,
  data
})

const loginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  user
})

const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  error
})

export const logout = () => {
  api.removeDefaultHeader('Authorization')
  localStorage.removeItem('user')
  return {
    type: LOGOUT
  }
}

export const loginEpic = action$ =>
  action$.ofType(LOGIN_REQUEST)
    .mergeMap(action => {
      return api.post('auth/local', {
        data: action.data
      }).map(user => {
        localStorage.setItem('user', JSON.stringify(user))
        api.addDefaultHeader('Authorization', `Bearer ${user.token}`)
        return loginSuccess(user)
      }).catch(err => Observable.of(loginFailure(err)))
    })

export const getUserId = auth =>
  auth.user && auth.user._id
