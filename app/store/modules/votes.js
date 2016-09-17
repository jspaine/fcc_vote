import {Observable} from 'rxjs/Observable'
import {denormalize} from 'denormalizr'

import api from '../../lib/apiClient'
import * as schema from '../schema'

const LOAD_VOTES_REQUEST = 'votes/LOAD_VOTES_REQUEST'
const LOAD_VOTES_SUCCESS = 'votes/LOAD_VOTES_SUCCESS'
const LOAD_VOTES_FAILURE = 'votes/LOAD_VOTES_FAILURE'

const SAVE_VOTE_REQUEST = 'votes/SAVE_VOTE_REQUEST'
export const SAVE_VOTE_SUCCESS = 'votes/SAVE_VOTE_SUCCESS'
const SAVE_VOTE_FAILURE = 'votes/SAVE_VOTE_FAILURE'

const initialState = {
  ids: new Set
}

export default (state = initialState, action) => {
  switch(action.type) {
    case LOAD_VOTES_REQUEST:
    case SAVE_VOTE_REQUEST:
      return {
        ...state,
        pending: true,
        error: null
      }
    case LOAD_VOTES_SUCCESS:
      return {
        ...state,
        pending: false,
        ids: new Set([
          ...state.ids,
          ...action.result
        ])
      }
    case SAVE_VOTE_SUCCESS:
      return {
        ...state,
        pending: false,
        ids: new Set([
          ...state.ids,
          action.result
        ])
      }
    case LOAD_VOTES_FAILURE:
    case SAVE_VOTE_FAILURE:
      return {
        ...state,
        pending: false,
        error: action.error
      }
    default: return state
  }
}

export const loadVotesRequest = (pollId) => ({
  type: LOAD_VOTES_REQUEST,
  pollId
})

const loadVotesSuccess = (response) => {
  const {entities, result} = response
  return {
    type: LOAD_VOTES_SUCCESS,
    entities,
    result
  }
}

const loadVotesFailure = (error) => ({
  type: LOAD_VOTES_FAILURE,
  error
})

export const saveVoteRequest = (pollId, option, userId) => ({
  type: SAVE_VOTE_REQUEST,
  pollId,
  option
})

const saveVoteSuccess = (response) => {
  const {entities, result} = response
  return {
    type: SAVE_VOTE_SUCCESS,
    entities,
    result
  }
}

const saveVoteFailure = (error) => ({
  type: SAVE_VOTE_FAILURE,
  error
})

export const loadVotesEpic = action$ =>
  action$.ofType(LOAD_VOTES_REQUEST)
    .mergeMap(action =>
      api.get(`api/polls/${action.pollId}/votes`, {
        schema: schema.arrayOfVotes
      })
        .map(loadVotesSuccess)
        .catch(err => Observable.of(loadVotesFailure(err)))
    )

export const saveVoteEpic = action$ =>
  action$.ofType(SAVE_VOTE_REQUEST)
    .mergeMap(action =>
      api.post(
        `api/polls/${action.pollId}/votes`,
        {
          data: action.option,
          schema: schema.vote
        })
        .map(saveVoteSuccess)
        .catch(err => Observable.of(saveVoteFailure(err)))
    )

export const getAllVotes = (votes, entities) =>
  denormalize([...votes.ids], entities, schema.arrayOfVotes)

export const getPollVotes = (pollId, votes, entities) => {
  const pollVotes = [...votes.ids].filter(v =>
    entities.votes[v] && entities.votes[v].poll === pollId
  )
  return denormalize(pollVotes, entities, schema.arrayOfVotes)
}

export const getCanVote = (userId, pollId, votes, entities) => {
  const pollVotes = [...votes.ids].filter(v =>
    entities.votes[v] && entities.votes[v].poll === pollId
  )
  return pollVotes.reduce((acc, v) =>
    (!acc || entities.votes[v].user === userId) ? false : acc
  , true)
}

export const getIsPending = (state) => state.pending
