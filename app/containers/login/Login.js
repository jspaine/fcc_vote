import React from 'react'
import {connect} from 'react-redux'
import {Input} from 'react-toolbox/lib/input'
import {Button} from 'react-toolbox/lib/button'
import {FontIcon} from 'react-toolbox/lib/font_icon'

import {loginRequest} from 'store/modules/auth'

import styles from './Login.scss'

class Login extends React.Component {
  static propTypes = {
    onLogin: React.PropTypes.func,
    error: React.PropTypes.object
  }
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }

  handleChange(name, value) {
    this.setState({[name]: value})
  }

  render() {
    const {error, onLogin} = this.props
    return (
      <div className={styles.loginForm}>
        <h3>Login</h3>
        <form action="auth/local" method="POST" onSubmit={ev => onLogin(ev, this.state)}>
          <div>
            <Input
              type="text"
              label="username"
              name="username"
              value={this.state.username}
              onChange={this.handleChange.bind(this, 'username')}
              autoFocus
            />
          </div>
          <div>
            <Input
              type="password"
              label="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange.bind(this, 'password')}
            />
          </div>
          <span className={styles.error}>
            {error && (error.status === 401 ?
              'Invalid login' :
              'An error occurred')}
            <FontIcon className={styles.icon} value="error" />
          </span>
          <div className={styles.button}>
            <Button type="submit" raised primary>
              Log In
            </Button>
          </div>
        </form>
      </div>
    )
  }
}

export default connect(
  state => ({
    error: state.auth.loginError
  }),
  dispatch => ({
    onLogin: (ev, data) => {
      ev.preventDefault()
      if (data.username.trim() !== '' &&
          data.password.trim() !== '')
        return dispatch(loginRequest(data))
    }
  })
)(Login)
