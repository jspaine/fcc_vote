import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import Router from './Router';

const root = document.getElementById('app')

render(<Router />)

if (module.hot) {
  module.hot.accept('./Router', () => {
    const NextApp = require('./Router').default
    render(<NextApp />)
  })
}

function render(component) {
  ReactDOM.render(
    <AppContainer>
      {component}
    </AppContainer>,
    root
  )
}