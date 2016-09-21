import React from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {Input} from 'react-toolbox/lib/input'
import {Button} from 'react-toolbox/lib/button'
import {FontIcon} from 'react-toolbox/lib/font_icon'

import {loginRequest} from 'store/modules/auth'

import style from './Login.scss'

const stateToProps = state => ({
  error: state.auth.loginError
})

const dispatchToProps = dispatch => ({
  onLogin: (ev, data) => {
    ev.preventDefault()
    if (data.username.trim() !== '' &&
        data.password.trim() !== '')
      return dispatch(loginRequest(data))
  }
})

class Login extends React.Component {
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
      <div className={style.loginForm}>
        <h3>Login</h3>
        <form action="/auth/local" method="POST" onSubmit={ev => onLogin(ev, this.state)}>
          <Input
            type="text"
            label="username"
            name="username"
            value={this.state.username}
            onChange={this.handleChange.bind(this, 'username')}
            autoFocus
          />
          <Input
            type="password"
            label="password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange.bind(this, 'password')}
          />
          {error &&
            <span className={style.error}>
              {error.status === 401 ?
                'Invalid login' :
                'An error occurred'}
              <FontIcon className={style.icon} value="error" />
            </span>
          }
          <div className={style.button}>
            <Button type="submit" raised primary>
              Log In
            </Button>
          </div>
          <a href="/auth/github">
            Log in github
          </a>
          <a href="/auth/google">
            Log in google
          </a>
        </form>
      </div>
    )
  }
  static propTypes = {
    onLogin: React.PropTypes.func,
    error: React.PropTypes.object
  }
}

export default connect(stateToProps, dispatchToProps)(Login)
