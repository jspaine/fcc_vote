import React from 'react'
import {Link} from 'react-router'
import {AppBar} from 'react-toolbox/lib/app_bar'
import {NavDrawer} from 'react-toolbox'
import {Navigation} from 'react-toolbox/lib/navigation'
import {IconButton} from 'react-toolbox/lib/button'

import LinkStyle from 'react-toolbox/lib/link/theme.scss'
import styles from './Nav.scss'

const Nav = ({user, logoutClick, menuButtonClick}) =>
  <AppBar className={styles.appBar} className={styles.fixed} fixed>
    <Link to="/">
      Vote!
    </Link>
    <Navigation className={styles.nav} type="horizontal">
      {user ?
        <IconButton
          inverse icon='more_vert'
          onClick={menuButtonClick}
        /> :
        <Link className={LinkStyle.link} to="/login">Login</Link>
      }
    </Navigation>
  </AppBar>

Nav.propTypes = {
  menuButtonClick: React.PropTypes.func.isRequired,
  user: React.PropTypes.object
}

export default Nav
