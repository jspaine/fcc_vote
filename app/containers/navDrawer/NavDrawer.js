import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {Drawer} from 'react-toolbox/lib/drawer'
import {IconMenu, MenuItem, MenuDivider} from 'react-toolbox/lib/menu'
import Avatar from 'react-toolbox/lib/avatar'

import {closeDrawer} from 'store/modules/ui'
import {logout} from 'store/modules/auth'

const stateToProps = (state) => ({
  user: state.auth.user,
  active: state.ui.drawer
})

const dispatchToProps = (dispatch) => ({
  closeDrawer: () => dispatch(closeDrawer()),
  logoutClick: (ev) => {
    ev.preventDefault()
    dispatch(logout())
    dispatch(closeDrawer())
  }
})

const NavDrawer = ({
  user,
  active,
  closeDrawer,
  logoutClick
}) =>
  <Drawer
    active={active}
    onOverlayClick={closeDrawer}
    type="right"
  >
    <MenuItem caption={user.username}>
      <Avatar image={user.image} />
    </MenuItem>
    <MenuDivider />
    <Link to="polls/new" onClick={closeDrawer}>
      <MenuItem caption="New Poll" />
    </Link>
    <Link to={`polls/by/user/${user._id}`} onClick={closeDrawer}>
      <MenuItem caption="My Polls" />
    </Link>
    <Link to={`votes/by/user/${user._id}`} onClick={closeDrawer}>
      <MenuItem caption="My Votes" />
    </Link>
    <MenuDivider />
    {(user && user.role === 'admin') &&
      <div>
        <Link to={'users'} onClick={closeDrawer}>
          <MenuItem caption="Users" />
        </Link>
        <MenuDivider />
      </div>
    }
    <MenuItem
      icon="exit_to_app"
      value="Log Out"
      caption="Log Out"
      onClick={logoutClick}
    />
  </Drawer>

NavDrawer.propTypes = {
  user: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  closeDrawer: PropTypes.func.isRequired,
  logoutClick: PropTypes.func.isRequired
}

export default connect(stateToProps, dispatchToProps)(NavDrawer)
