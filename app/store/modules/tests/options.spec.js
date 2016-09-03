import reducer from '../options'

describe('options reducer', function() {
  it('returns the initial state', function() {
    const state = reducer(undefined, {})
    expect(state).to.have.property('ids')
    expect(state.ids).to.be.instanceOf(Set)
  })

  it('adds new poll option ids after existing ids', function() {
    const currState = {ids: ['b','c']}
    const entities = {options: {'d': {_id: 'd'}}}
    const newState = reducer(currState, {
      type: 'polls/LOAD_POLLS_SUCCESS',
      entities
    })
    expect([...newState.ids]).to.deep.equal(['b','c','d'])
  })

  it('deletes ids from deleted polls', function() {
    const currState = {ids: ['a','b','c']}
    const entities = {options: {'a': {_id: 'a'}, 'b': {_id: 'b'}}}
    const newState = reducer(currState, {
      type: 'polls/DELETE_POLL_SUCCESS',
      entities
    })
    expect([...newState.ids]).to.deep.equal(['c'])
  })

})
