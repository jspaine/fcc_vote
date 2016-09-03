const initialState = {
  polls: {},
  options: {},
  votes: {},
  users: {}
}

export default (state = initialState, action) => {
  if (action.entities) {
    return {
      ...state,
      ...action.entities
    }
  }
  return state
}
