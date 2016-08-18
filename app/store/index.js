import {createStore, applyMiddleware, compose} from 'redux'
import {createEpicMiddleware} from 'redux-observable'
import {routerMiddleware as createRouterMiddleware} from 'react-router-redux'
import reduxThunk from 'redux-thunk'

import {rootReducer, rootEpic} from './modules'

export default (history) => {
  const epicMiddleware = createEpicMiddleware(rootEpic)
  const routerMiddleware = createRouterMiddleware(history)

  const middleware = [
    reduxThunk,
    epicMiddleware,
    routerMiddleware
  ]

  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./modules', () => {
      store.replaceReducer(require('./modules/index').rootReducer);
    });

    if (window.devToolsExtension) {
      window.devToolsExtension.updateStore(store);
    }
  }

  return store
}
