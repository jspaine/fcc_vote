import React from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {Layout, Panel} from 'react-toolbox'

import {logout} from 'store/modules/auth'
import {openDrawer, closeDrawer} from 'store/modules/ui'

import Nav from 'components/nav/Nav'
import NavDrawer from 'components/navDrawer/NavDrawer'
import styles from './App.scss'

const stateToProps = (state) => ({
  user: state.auth.user,
  drawerOpen: state.ui.drawer
})

const dispatchToProps = (dispatch) => ({
  logoutClick: (ev) => {
    ev.preventDefault()
    dispatch(logout())
  },
  menuClick: () => dispatch(openDrawer()),
  overlayClick: () => dispatch(closeDrawer()),
  pushState: (loc) => dispatch(push(loc))
})

class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    user: React.PropTypes.object,
    drawerOpen: React.PropTypes.bool,
    logoutClick: React.PropTypes.func,
    menuClick: React.PropTypes.func,
    overlayClick: React.PropTypes.func,
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
            menuButtonClick={this.props.menuClick}
          />
          <NavDrawer
            user={this.props.user}
            active={this.props.drawerOpen}
            overlayClick={this.props.overlayClick}
            logoutClick={this.props.logoutClick}
            push={this.props.pushState}
          />
          {this.props.children}
        </Panel>
      </Layout>
    )
  }
}

export default connect(stateToProps, dispatchToProps)(App)
