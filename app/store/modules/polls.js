import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/fromPromise'

import api from '../../lib/apiClient'

const LOAD_REQUEST = 'polls/LOAD_REQUEST'
const LOAD_SUCCESS = 'polls/LOAD_SUCCESS'
const LOAD_FAILURE = 'polls/LOAD_FAILURE'

const initialState = {
  loaded: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.data
      }
    case LOAD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    default: return state
  }
}

export const loadRequest = () => ({
  type: LOAD_REQUEST
})

export const loadSuccess = (data) => ({
  type: LOAD_SUCCESS,
  data
})

export const loadFailure = (error) => ({
  type: LOAD_FAILURE,
  error
})

export const loadPollsEpic = action$ =>
  action$.ofType(LOAD_REQUEST)
    .mergeMap(action => {
      return api.get('api/polls')
        .map(loadSuccess)
        .catch(err => Observable.of(loadFailure(err)))
    })
