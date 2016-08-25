import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {Layout, Panel} from 'react-toolbox'

import {openDrawer} from 'store/modules/ui'

import {Nav} from 'components'
import NavDrawer from 'containers/navDrawer/NavDrawer'
import style from './App.scss'

const stateToProps = (state) => ({
  user: state.auth.user,
  drawerOpen: state.ui.drawer
})

const dispatchToProps = (dispatch) => ({
  menuClick: () => dispatch(openDrawer()),
  pushState: (loc) => dispatch(push(loc))
})

class App extends React.Component {
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
        <Panel className={style.panel}>
          <Nav
            user={this.props.user}
            menuButtonClick={this.props.menuClick}
          />
          {this.props.user && <NavDrawer />}
          {this.props.children}
        </Panel>
      </Layout>
    )
  }

  static propTypes = {
    children: PropTypes.node,
    user: PropTypes.object,
    menuClick: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  }
}

export default connect(stateToProps, dispatchToProps)(App)
