import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/concat'
import {push} from 'react-router-redux'
import {denormalize} from 'denormalizr'

import api from '../../lib/apiClient'
import * as schema from '../schema'

const LOAD_POLLS_REQUEST = 'polls/LOAD_POLLS_REQUEST'
export const LOAD_POLLS_SUCCESS = 'polls/LOAD_POLLS_SUCCESS'
const LOAD_POLLS_FAILURE = 'polls/LOAD_POLLS_FAILURE'

const SAVE_POLL_REQUEST = 'polls/SAVE_POLL_REQUEST'
export const SAVE_POLL_SUCCESS = 'polls/SAVE_POLL_SUCCESS'
const SAVE_POLL_FAILURE = 'polls/SAVE_POLL_FAILURE'

const DELETE_POLL_REQUEST = 'polls/DELETE_POLL_REQUEST'
export const DELETE_POLL_SUCCESS = 'polls/DELETE_POLL_SUCCESS'
const DELETE_POLL_FAILURE = 'polls/DELETE_POLL_FAILURE'

const initialState = {
  ids: new Set
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_POLLS_REQUEST:
    case SAVE_POLL_REQUEST:
    case DELETE_POLL_REQUEST:
      return {
        ...state,
        pending: true,
        error: null,
      }
    case LOAD_POLLS_SUCCESS:
      return {
        ...state,
        pending: false,
        ids: new Set([
          ...state.ids,
          ...action.result
        ])
      }
    case SAVE_POLL_SUCCESS:
      return {
        ...state,
        pending: false,
        ids: new Set([
          action.result,
          ...state.ids
        ])
      }
    case DELETE_POLL_SUCCESS:
      return {
        ...state,
        pending: false,
        ids: new Set(
          [...state.ids].filter(id => id !== action.result)
        )
      }
    case LOAD_POLLS_FAILURE:
    case SAVE_POLL_FAILURE:
    case DELETE_POLL_FAILURE:
      return {
        ...state,
        pending: false,
        error: action.error
      }
    default: return state
  }
}

export const loadPollsRequest = () => ({
  type: LOAD_POLLS_REQUEST
})

const loadPollsSuccess = (response) => {
  const {entities, result} = response
  return {
    type: LOAD_POLLS_SUCCESS,
    entities,
    result
  }
}

const loadPollsFailure = (error) => ({
  type: LOAD_POLLS_FAILURE,
  error
})

export const savePollRequest = (poll) => ({
  type: SAVE_POLL_REQUEST,
  poll
})

const savePollSuccess = (response) => {
  const {entities, result} = response
  return {
    type: SAVE_POLL_SUCCESS,
    entities,
    result
  }
}

const savePollFailure = (error) => ({
  type: SAVE_POLL_FAILURE,
  error
})

export const deletePollRequest = (id) => ({
  type: DELETE_POLL_REQUEST,
  id
})

const deletePollSuccess = (response) => {
  const {result, entities} = response
  return {
    type: DELETE_POLL_SUCCESS,
    result,
    entities
  }
}

const deletePollFailure = (error) => ({
  type: DELETE_POLL_FAILURE,
  error
})

export const loadPollsEpic = action$ =>
  action$.ofType(LOAD_POLLS_REQUEST)
    .mergeMap(action =>
      api.get('api/polls', {
        schema: schema.arrayOfPolls
      })
        .map(loadPollsSuccess)
        .catch(err => Observable.of(loadPollsFailure(err)))
    )

 export const savePollEpic = action$ =>
  action$.ofType(SAVE_POLL_REQUEST)
    .mergeMap(action => {
      if (action.poll._id) {
        return api.put(`api/polls/${action.poll._id}`, {
          data: action.poll,
          schema: schema.poll
        })
          .flatMap(data =>
            Observable.concat(
              Observable.of(push(`/polls/${data.result}`)),
              Observable.of(savePollSuccess(data))
            )
          )
          .catch(err => Observable.of(savePollFailure(err)))
      }
      return api.post('api/polls', {
        data: action.poll,
        schema: schema.poll
      })
        .flatMap(data =>
          Observable.concat(
            Observable.of(push(`/polls/${data.result}`)),
            Observable.of(savePollSuccess(data))
          )
        )
        .catch(err => Observable.of(savePollFailure(err)))
    })

export const deletePollEpic = action$ =>
  action$.ofType(DELETE_POLL_REQUEST)
    .mergeMap(action =>
      api.del(`api/polls/${action.id}`, {
        schema: schema.poll
      })
        .map(deletePollSuccess)
        .catch(err => Observable.of(deletePollFailure(err)))
    )


export const getAllPolls = (polls, entities) =>
  denormalize([...polls.ids], entities, schema.arrayOfPolls)

export const getPollById = (id, polls, entities) => {
  if (!polls.ids.has(id)) return
  return denormalize(id, entities, schema.poll)
}

export const getIsPending = (state) => state.pending
