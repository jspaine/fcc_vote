import React from 'react'
import {Drawer} from 'react-toolbox/lib/drawer'
import {IconMenu, MenuItem, MenuDivider} from 'react-toolbox/lib/menu'
import Avatar from 'react-toolbox/lib/avatar'
import {Link} from 'react-router'

export default ({
  user,
  active,
  overlayClick,
  logoutClick,
  push
}) =>
  <Drawer
    active={active}
    onOverlayClick={overlayClick}
    type="right"
  >
    <MenuItem caption={user && user.username}>
      <Avatar image={user && user.image} />
    </MenuItem>
    <MenuDivider />
    <Link to="polls/new">
      <MenuItem caption="New Poll" />
    </Link>
    <Link to={`polls/by/user/${user && user._id}`} >
      <MenuItem caption="My Polls" />
    </Link>
    <Link to={`votes/by/user/${user && user._id}`} >
      <MenuItem caption="My Votes" />
    </Link>
    <MenuDivider />
    <MenuItem
      icon="exit_to_app"
      value="Log Out"
      caption="Log Out"
      onClick={(ev) => {
        logoutClick(ev)
        overlayClick()
      }}
    />
  </Drawer>
