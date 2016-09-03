import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import 'rxjs/add/observable/of'
import configureMockStore from 'redux-mock-store'
import {createEpicMiddleware, combineEpics} from 'redux-observable'

import api from '../../../lib/apiClient'
import * as fromUsers from '../users'

const reducer = fromUsers.default
const epics = combineEpics(
  fromUsers.loadUsersEpic,
  fromUsers.saveUserEpic,
  fromUsers.deleteUserEpic
)
const epicMiddleware = createEpicMiddleware(epics)
const mockStore = configureMockStore([epicMiddleware])

describe('users reducer', function() {
  it('returns the initial state', function() {
    const state = reducer(undefined, {})
    expect(state).to.have.property('ids')
    expect(state.ids).to.be.instanceOf(Set)
  })

  it('adds users from loaded polls', function() {
    const currState = {ids: ['b','c','d']}
    const entities = {users: {'a': {_id: 'a'}}}
    const newState = reducer(currState, {
      type: 'polls/LOAD_POLLS_SUCCESS',
      entities
    })
    expect([...newState.ids]).to.deep.equal(['b','c','d','a'])
  })

  it('loads users', function() {
    const currState = {ids: ['b','c','d']}
    const result = ['a','e']
    const newState = reducer(currState, {
      type: 'users/LOAD_USERS_SUCCESS',
      result
    })
    expect([...newState.ids]).to.deep.equal(['b','c','d','a','e'])
  })

  it('saves users', function() {
    const currState = {ids: ['b','c','d']}
    const result = 'a'
    const newState = reducer(currState, {
      type: 'users/SAVE_USER_SUCCESS',
      result
    })
    expect([...newState.ids]).to.deep.equal(['a','b','c','d'])
  })

  it('deletes users', function() {
    const currState = {ids: ['b','c','d']}
    const result = 'b'
    const newState = reducer(currState, {
      type: 'users/DELETE_USER_SUCCESS',
      result
    })
    expect([...newState.ids]).to.deep.equal(['c','d'])
  })

  describe('user epics', function() {
    let store
    beforeEach(() => {
      store = mockStore()
    })
    afterEach(() => {
      epicMiddleware.replaceEpic(epics)
    })

    it('handles load users request', function() {
      const response = {
        entities: {id: 1, username: 'user 1'},
        result: [1]
      }

      expectEpic(fromUsers.loadUsersEpic, api, 'get', {
        expected: ['-a|', {
          a: {type: 'users/LOAD_USERS_SUCCESS', ...response}
        }],
        action: ['(a|)', {
          a: fromUsers.loadUsersRequest()
        }],
        response: ['-a|', {
          a: response
        }],
        fetchArgs: ['api/users']
      })
    })

    it('handles loading errors', function() {
      const error = new Error({
        status: 500
      })

      expectEpic(fromUsers.loadUsersEpic, api, 'get', {
        expected: ['-(a|)', {
          a: {type: 'users/LOAD_USERS_FAILURE', error}
        }],
        action: ['(a|)', {
          a: fromUsers.loadUsersRequest()
        }],
        response: ['-#|', null, error],
        fetchArgs: ['api/users']
      })
    })

    it('handles creating users', function() {
      const user = {username: 'user 1'}
      const response = {
        entities: {_id: 1, username: 'user 1'},
        result: 1
      }

      expectEpic(fromUsers.saveUserEpic, api, 'post', {
        expected: ['-a|', {
          a: {type: 'users/SAVE_USER_SUCCESS', ...response}
        }],
        action: ['(a|)', {
          a: fromUsers.saveUserRequest(user)
        }],
        response: ['-a|', {
          a: response
        }],
        fetchArgs: ['api/users']
      })
    })

    it('handles updating users', function() {
      const user = {_id: 1, username: 'user 1'}

      const response = {
        entities: {_id: 1, username: 'user 1'},
        result: 1
      }

      expectEpic(fromUsers.saveUserEpic, api, 'put', {
        expected: ['-a|', {
          a: {type: 'users/SAVE_USER_SUCCESS', ...response}
        }],
        action: ['(a|)', {
          a: fromUsers.saveUserRequest(user)
        }],
        response: ['-a|', {
          a: response
        }],
        fetchArgs: ['api/users/1']
      })
    })

    it('handles deleting users', function() {
      const userId = 1

      const response = {
        result: 1
      }

      expectEpic(fromUsers.deleteUserEpic, api, 'del', {
        expected: ['-a|', {
          a: {type: 'users/DELETE_USER_SUCCESS', ...response}
        }],
        action: ['(a|)', {
          a: fromUsers.deleteUserRequest(userId)
        }],
        response: ['-a|', {
          a: response
        }],
        fetchArgs: ['api/users/1']
      })
    })

  })
})
