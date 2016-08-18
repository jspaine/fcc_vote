import React from 'react'
import {connect} from 'react-redux'
import {Button} from 'react-toolbox/lib/button'

import PollCard from 'components/pollCard/PollCard'
import {loadRequest} from 'store/modules/polls'

const stateToProps = state => ({
  polls: state.polls.data
})

const dispatchToProps = dispatch => ({
  loadPolls: () => dispatch(loadRequest())
})

class Home extends React.Component {
  componentDidMount() {
    this.props.loadPolls()
  }
  render() {
    return (
      <div style={{display: 'flex'}}>
        {this.props.polls && this.props.polls.map(poll =>
          <PollCard poll={poll} key={poll._id} />
        )}
      </div>
    )
  }
}

export default connect(stateToProps, dispatchToProps)(Home)
