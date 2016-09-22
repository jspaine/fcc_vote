import React from 'react'
import {connect} from 'react-redux'
import {Button} from 'react-toolbox/lib/button'

import {UserCard} from 'components'

import {loadUsersRequest, deleteUserRequest} from 'store/modules/users'
import {selectors} from 'store/modules'

//import style from './ListUsers.scss'

const stateToProps = state => ({
  users: selectors.getAllUsers(state),
  currUser: state.auth.user
})

const dispatchToProps = dispatch => ({
  loadUsers: () => dispatch(loadUsersRequest()),
  showUser: (id) => dispatch(push(`/users/${id}`)),
  deleteUser: (id) => dispatch(deleteUserRequest(id))
})

class ListUsers extends React.Component {
  componentDidMount() {
    this.props.loadUsers()
  }
  render() {
    return (
      <div>
        {this.props.users && this.props.users.map(user =>
          <UserCard
            user={user}
            key={user._id}
            onUserClick={() => this.props.showUser(user._id)}
            currUser={this.props.currUser}
            onDeleteClick={() => this.props.deleteUser(user._id)}
          >
            {user.ip && <p>{`IP: ${user.ip}`}</p>}
            {user.role && <p>{`Role: ${user.role}`}</p>}
            {user.provider && <p>{`Provider: ${user.provider}`}</p>}
          </UserCard>
        )}
      </div>
    )
  }
}

export default connect(stateToProps, dispatchToProps)(ListUsers)
