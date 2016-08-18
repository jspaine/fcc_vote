const OPEN_DRAWER = 'ui/OPEN_DRAWER'
const CLOSE_DRAWER = 'ui/CLOSE_DRAWER'

const initialState = {
  drawer: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case OPEN_DRAWER:
      return {
        ...state,
        drawer: true
      }
    case CLOSE_DRAWER:
      return {
        ...state,
        drawer: false
      }
    default: return state
  }
}

export const openDrawer = () => ({type: OPEN_DRAWER})
export const closeDrawer = () => ({type: CLOSE_DRAWER})
