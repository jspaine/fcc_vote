import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import 'rxjs/add/observable/of'
import configureMockStore from 'redux-mock-store'
import {createEpicMiddleware, combineEpics} from 'redux-observable'

import api from '../../../lib/apiClient'
import * as fromPolls from '../polls'

const reducer = fromPolls.default
const epics = combineEpics(
  fromPolls.loadPollsEpic,
  fromPolls.savePollEpic,
  fromPolls.deletePollEpic
)
const epicMiddleware = createEpicMiddleware(epics)
const mockStore = configureMockStore([epicMiddleware])

describe('polls reducer', function() {
  it('returns the initial state', function() {
    const state = reducer(undefined, {})
    expect(state).to.have.property('ids')
    expect(state.ids).to.be.instanceOf(Set)
  })

  it('adds new poll ids after existing ids', function() {
    const currState = {ids: [2,3,4]}
    const result = [1, 5]
    const newState = reducer(currState, {
      type: 'polls/LOAD_POLLS_SUCCESS',
      result
    })
    expect([...newState.ids]).to.deep.equal([2,3,4,1,5])
  })

  it('adds saved poll ids before existing ids', function() {
    const currState = {ids: [2,3,4]}
    const result = 1
    const newState = reducer(currState, {
      type: 'polls/SAVE_POLL_SUCCESS',
      result
    })
    expect([...newState.ids]).to.deep.equal([1,2,3,4])
  })

  it('removes deleted poll ids', function() {
    const currState = {ids: [2,3,4]}
    const result = 2
    const newState = reducer(currState, {
      type: 'polls/DELETE_POLL_SUCCESS',
      result
    })
    expect([...newState.ids]).to.deep.equal([3,4])
  })

  describe('poll epics', function() {
    let store
    beforeEach(() => {
      store = mockStore()
    })
    afterEach(() => {
      epicMiddleware.replaceEpic(epics)
    })

    it('handles load polls request', function() {
      const response = {
        entities: {id: 1, title: 'poll 1'},
        result: [1]
      }

      expectEpic(fromPolls.loadPollsEpic, api, 'get', {
        expected: ['-a|', {
          a: {type: 'polls/LOAD_POLLS_SUCCESS', ...response}
        }],
        action: ['(a|)', {
          a: fromPolls.loadPollsRequest()
        }],
        response: ['-a|', {
          a: response
        }],
        fetchArgs: ['api/polls']
      })
    })

    it('handles loading errors', function() {
      const error = new Error({
        status: 500
      })

      expectEpic(fromPolls.loadPollsEpic, api, 'get', {
        expected: ['-(a|)', {
          a: {type: 'polls/LOAD_POLLS_FAILURE', error}
        }],
        action: ['(a|)', {
          a: fromPolls.loadPollsRequest()
        }],
        response: ['-#|', null, error],
        fetchArgs: ['api/polls']
      })
    })

    it('handles creating polls', function() {
      const poll = {title: 'poll 1'}
      const response = {
        entities: {_id: 1, title: 'poll 1'},
        result: 1
      }

      expectEpic(fromPolls.savePollEpic, api, 'post', {
        expected: ['-(ab)|', {
          a: {
            type: '@@router/CALL_HISTORY_METHOD',
            payload: {
              args: ['/polls/1'],
              method: 'push'
            }
          },
          b: {type: 'polls/SAVE_POLL_SUCCESS', ...response}
        }],
        action: ['(a|)', {
          a: fromPolls.savePollRequest(poll)
        }],
        response: ['-a---|', {
          a: response
        }],
        fetchArgs: ['api/polls']
      })
    })

    it('handles updating polls', function() {
      const poll = {_id: 1, title: 'poll 1'}

      const response = {
        entities: {_id: 1, title: 'poll 1'},
        result: 1
      }

      expectEpic(fromPolls.savePollEpic, api, 'put', {
        expected: ['-(ab)|', {
          a: {
            type: '@@router/CALL_HISTORY_METHOD',
            payload: {
              args: ['/polls/1'],
              method: 'push'
            }
          },
          b: {type: 'polls/SAVE_POLL_SUCCESS', ...response}
        }],
        action: ['(a|)', {
          a: fromPolls.savePollRequest(poll)
        }],
        response: ['-a---|', {
          a: response
        }],
        fetchArgs: ['api/polls/1']
      })
    })

    it('handles deleting polls', function() {
      const pollId = 1

      const response = {
        result: 1
      }

      expectEpic(fromPolls.deletePollEpic, api, 'del', {
        expected: ['-a|', {
          a: {type: 'polls/DELETE_POLL_SUCCESS', ...response, entities: undefined}
        }],
        action: ['(a|)', {
          a: fromPolls.deletePollRequest(pollId)
        }],
        response: ['-a|', {
          a: response
        }],
        fetchArgs: ['api/polls/1']
      })
    })
  })

  describe('poll selectors', function() {
    const polls = {ids: new Set(['1', '2'])}
    const entities = {
      polls: {
        '1': {_id: '1', title: 'poll 1', owner: '1', options: ['1', '2']},
        '2': {_id: '2', title: 'poll 2', owner: '1', options: ['3','4']}
      },
      users: {
        '1': {_id: '1', username: 'user 1'}
      },
      options: {
        '1': {_id: '1', title: 'option 1'},
        '2': {_id: '2', title: 'option 2'},
        '3': {_id: '3', title: 'option 3'},
        '4': {_id: '4', title: 'option 4'},
      }
    }

    it('getAllPolls returns denormalized list of polls', function() {
      const result = fromPolls.getAllPolls(polls, entities)
      expect(result.length).to.equal(2)
      expect(result[0]).to.have.deep.property('owner.username', 'user 1')
    })

    it('getPollById returns denormalized poll', function() {
      const result = fromPolls.getPollById('1', polls, entities)
      expect(result).to.have.deep.property('owner.username', 'user 1')
      expect(result.options.length).to.equal(2)
      expect(result.options[0].title).to.equal('option 1')
    })
  })
})
