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
        fetchArgs: ['api/polls/pid/votes']
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
        fetchArgs: ['api/polls/pid/votes/oid']
      })
    })
  })

  describe('vote selectors', function() {
    const votes = {ids: new Set(['1', '2'])}
    const entities = {
      polls: {
        '1': {_id: '1', title: 'poll 1', owner: '1', options: ['1', '2']},
        '2': {_id: '2', title: 'poll 2', owner: '1', options: ['3','4']}
      },
      users: {
        '1': {_id: '1', username: 'user 1'},
        '2': {_id: '2', username: 'user 2'}
      },
      options: {
        '1': {_id: '1', title: 'option 1'},
        '2': {_id: '2', title: 'option 2'},
        '3': {_id: '3', title: 'option 3'},
        '4': {_id: '4', title: 'option 4'},
      },
      votes: {
        '1': {_id: '1', poll: '1', option: '1', user: '1'},
        '2': {_id: '2', poll: '2', option: '3', user: '1'}
      }
    }

    it('gets all votes', function() {
      const result = fromVotes.getAllVotes(votes, entities)
      expect(result.length).to.equal(2)
      expect(result[0]).to.have.deep.property('option.title', 'option 1')
    })

    it('gets poll votes', function() {
      const result = fromVotes.getPollVotes('1', votes, entities)
      expect(result.length).to.equal(1)
      expect(result[0]).to.have.deep.property('poll.title', 'poll 1')
    })

    it('gets can vote', function() {
      const user1 = fromVotes.getCanVote('1', '1', votes, entities)
      const user2 = fromVotes.getCanVote('2', '1', votes, entities)
      expect(user1).to.be.false
      expect(user2).to.be.true
    })
  })
})
