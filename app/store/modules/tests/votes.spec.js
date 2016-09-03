import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import 'rxjs/add/observable/of'
import configureMockStore from 'redux-mock-store'
import {createEpicMiddleware, combineEpics} from 'redux-observable'

import api from '../../../lib/apiClient'
import * as fromVotes from '../votes'

const reducer = fromVotes.default
const epics = combineEpics(
  fromVotes.loadVotesEpic
)
const epicMiddleware = createEpicMiddleware(epics)
const mockStore = configureMockStore([epicMiddleware])

describe('votes reducer', function() {
  it('returns the initial state', function() {
    const state = reducer(undefined, {})
    expect(state).to.have.property('ids')
    expect(state.ids).to.be.instanceOf(Set)
  })

  it('loads votes for a poll', function() {
    const currState = {ids: ['b','c']}
    const result = ['a','d']
    const newState = reducer(currState, {
      type: 'votes/LOAD_VOTES_SUCCESS',
      result
    })
    expect([...newState.ids]).to.deep.equal(['b','c','a','d'])
  })

  describe('vote epics', function() {
    let store
    beforeEach(() => {
      store = mockStore()
    })
    afterEach(() => {
      epicMiddleware.replaceEpic(epics)
    })

    it('handles load votes request', function() {
      const response = {
        entities: {1: {id: 1, poll: 'pid'}},
        result: [1]
      }

      expectEpic(fromVotes.loadVotesEpic, api, 'get', {
        expected: ['-a|', {
          a: {type: 'votes/LOAD_VOTES_SUCCESS', ...response}
        }],
        action: ['(a|)', {
          a: fromVotes.loadVotesRequest('pid')
        }],
        response: ['-a|', {
          a: response
        }],
        fetchArgs: ['api/polls/pid/vote']
      })
    })

    it('handles save vote request', function() {
      const response = {
        entities: {id: 1, poll: 'pid', option: 'oid', user: 'uid'},
        result: 1
      }

      expectEpic(fromVotes.saveVoteEpic, api, 'post', {
        expected: ['-a|', {
          a: {type: 'votes/SAVE_VOTE_SUCCESS', ...response}
        }],
        action: ['(a|)', {
          a: fromVotes.saveVoteRequest('pid', 'oid', 'uid')
        }],
        response: ['-a|', {
          a: response
        }],
        fetchArgs: ['api/polls/pid/vote/oid']
      })
    })
  })
})
