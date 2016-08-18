import React from 'react'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import {Provider} from 'react-redux'

import createStore from 'store'
import {
  App,
  Home,
  Login
} from 'containers'

const store = createStore(browserHistory)
const history = syncHistoryWithStore(browserHistory, store)

export default function() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Home}/>
          <Route path="login" component={Login}/>
        </Route>
      </Router>
    </Provider>
  )
}
