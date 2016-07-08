import React from 'react'
import {Router, Route, hashHistory} from 'react-router'
import Home from './home'

const Routes = <Route path="/" component={Home} /> 

export default function() {
  return (
    <Router history={hashHistory}>
      {Routes}
    </Router>
  )
}