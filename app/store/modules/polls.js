import {Observable} from 'rxjs/Observable'
import {push} from 'react-router-redux'

import api from '../../lib/apiClient'

const LOAD_REQUEST = 'polls/LOAD_REQUEST'
const LOAD_SUCCESS = 'polls/LOAD_SUCCESS'
const LOAD_FAILURE = 'polls/LOAD_FAILURE'

const SAVE_REQUEST = 'polls/SAVE_REQUEST'
const SAVE_SUCCESS = 'polls/SAVE_SUCCESS'
const SAVE_FAILURE = 'polls/SAVE_FAILURE'

const initialState = {
  loaded: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_REQUEST:
      return {
        ...state,
        loaded: false,
        loading: true,
        error: null,
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
    case SAVE_REQUEST:
      return {
        ...state,
        saving: true,
        error: null,
      }
    case SAVE_SUCCESS:
      return {
        ...state,
        saving: false,
        data: action.data
      }
    case SAVE_FAILURE:
      return {
        ...state,
        saving: false,
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

export const saveRequest = (data, id) => ({
  type: SAVE_REQUEST,
  data,
  id
})

export const saveSuccess = (data) => ({
  type: SAVE_SUCCESS,
  data
})

export const saveFailure = (error) => ({
  type: SAVE_FAILURE,
  error
})

export const loadPollsEpic = action$ =>
  action$.ofType(LOAD_REQUEST)
    .mergeMap(action => {
      return api.get('api/polls')
        .map(loadSuccess)
        .catch(err => Observable.of(loadFailure(err)))
    })

 export const savePollEpic = action$ =>
  action$.ofType(SAVE_REQUEST)
    .mergeMap(action => {
      if (action.id) {
        return api.put(`api/polls/${action.id}`, {
          data: action.data
        }).map(data => push(`/polls/${data._id}`))
        .catch(err => Observable.of(saveFailure(err)))
      }
      return api.post('api/polls', {
        data: action.data
      }).map(data => push(`/polls/${data._id}`))
        .catch(err => Observable.of(saveFailure(err)))
    })
