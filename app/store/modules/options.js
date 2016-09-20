import {
  LOAD_POLLS_SUCCESS,
  SAVE_POLL_SUCCESS,
  DELETE_POLL_SUCCESS
} from './polls'

const initialState = {
  ids: new Set
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_POLLS_SUCCESS:
    case SAVE_POLL_SUCCESS:
      if (!action.entities.options) return state
      return {
        ...state,
        ids: new Set([
          ...state.ids,
          ...Object.keys(action.entities.options)
        ])
      }
    case DELETE_POLL_SUCCESS:
      const ids = new Set(state.ids)
      Object.keys(action.entities.options)
        .forEach(o => ids.delete(o))
      return {
        ...state,
        ids
      }
    default: return state
  }
}
