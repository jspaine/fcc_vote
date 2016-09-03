import React from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {Button} from 'react-toolbox/lib/button'

import PollCard from 'components/pollCard/PollCard'
import {loadPollsRequest} from 'store/modules/polls'
import {selectors} from 'store/modules'
import style from './Home.scss'

const stateToProps = state => ({
  polls: selectors.getAllPolls(state)
})

const dispatchToProps = dispatch => ({
  loadPolls: () => dispatch(loadPollsRequest()),
  showPoll: (id) => dispatch(push(`/polls/${id}`))
})

class Home extends React.Component {
  componentDidMount() {
    this.props.loadPolls()
  }
  render() {
    return (
      <div className={style.pollList}>
        {this.props.polls && this.props.polls.map(poll =>
          <PollCard
            poll={poll}
            key={poll._id}
            onPollClick={() => this.props.showPoll(poll._id)}
          />
        )}
      </div>
    )
  }
}

export default connect(stateToProps, dispatchToProps)(Home)
