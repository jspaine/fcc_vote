import merge from 'lodash.merge'

const initialState = {
  polls: {},
  options: {},
  votes: {},
  users: {}
}

export default (state = initialState, action) => {
  if (action.entities) {
    return merge({}, state, action.entities)
    // {
    //   ...state,
    //   ...action.entities
    // }
  }
  return state
}
