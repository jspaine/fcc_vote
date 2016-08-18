import React from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {Layout, Panel, Drawer} from 'react-toolbox'

import {logout} from 'store/modules/auth'

import Nav from 'components/nav/Nav'
import styles from './App.scss'

const stateToProps = (state) => ({
  user: state.auth.user
})

const dispatchToProps = (dispatch) => ({
  logoutClick: (ev) => {
    ev.preventDefault()
    dispatch(logout())
  },
  pushState: (loc) => dispatch(push(loc))
})

class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    user: React.PropTypes.object,
    logoutClick: React.PropTypes.func,
    pushState: React.PropTypes.func
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      this.props.pushState('/')
    } else if (this.props.user && !nextProps.user) {
      this.props.pushState('/')
    }
  }

  render() {
    return (
      <Layout>
        <Panel className={styles.panel}>
          <Nav
            user={this.props.user}
            logoutClick={this.props.logoutClick}
          />
          {this.props.children}
        </Panel>
      </Layout>
    )
  }
}

export default connect(stateToProps, dispatchToProps)(App)
