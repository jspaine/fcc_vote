import {Observable} from 'rxjs/Observable'

import api from '../../lib/apiClient'

const LOAD_REQUEST = 'vote/LOAD_REQUEST'
const LOAD_SUCCESS = 'vote/LOAD_SUCCESS'
const LOAD_FAILURE = 'vote/LOAD_FAILURE'

export default (state = {loaded: false}, action) => {
  switch(action.type) {
    case LOAD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        data: null
      }
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
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

export const loadRequest = (pollId) => ({
  type: LOAD_REQUEST,
  pollId
})

export const loadSuccess = (data) => ({
  type: LOAD_SUCCESS,
  data
})

export const loadFailure = (error) => ({
  type: LOAD_FAILURE,
  error
})

export const loadVotesEpic = action$ =>
  action$.ofType(LOAD_REQUEST)
    .mergeMap(action =>
      api.get(`api/polls/${action.pollId}/vote`)
        .map(loadSuccess)
        .catch(err => Observable.of(loadFailure(err)))
    )
