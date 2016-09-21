import React from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {Button} from 'react-toolbox/lib/button'

import {PollCard, PollSummaryTable} from 'components'

import {loadPollsRequest} from 'store/modules/polls'
import {loginOAuth} from 'store/modules/auth'
import {selectors} from 'store/modules'

import style from './Home.scss'

const stateToProps = state => ({
  polls: selectors.getAllPolls(state)
})

const dispatchToProps = dispatch => ({
  loadPolls: () => dispatch(loadPollsRequest()),
  showPoll: (id) => dispatch(push(`/polls/${id}`)),
  login: (token) => dispatch(loginOAuth(token)),
  pushState: (path) => dispatch(push(path))
})

class Home extends React.Component {
  constructor(props) {
    super(props)
    if (props.params.token) {
      console.log('login(token)', props.login(props.params.token))
      props.login(props.params.token)
      props.pushState('/')
    }
  }
  componentDidMount() {
    this.props.loadPolls()
  }
  render() {
    return (
      <div className={style.pollList}>
        <div>
          {this.props.params.token}
        </div>
        {this.props.polls && this.props.polls.map(poll =>
          <PollCard
            poll={poll}
            key={poll._id}
            getTotalVotes={(options) => options.reduce((acc, x) =>
              acc + x.votes, 0
            )}
            onPollClick={() => this.props.showPoll(poll._id)}
          >
            <PollSummaryTable options={poll.options}/>
          </PollCard>
        )}
      </div>
    )
  }
}

export default connect(stateToProps, dispatchToProps)(Home)
