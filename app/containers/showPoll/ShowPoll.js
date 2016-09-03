import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {Button, IconButton} from 'react-toolbox/lib/button'
import {ProgressBar} from 'react-toolbox/lib/progress_bar'

import {loadPollsRequest} from 'store/modules/polls'
import {loadVotesRequest} from 'store/modules/votes'
import {selectors} from 'store/modules'
import PollCard from 'components/pollCard/PollCard'

const stateToProps = (state) => ({
  polls: selectors.getAllPolls(state),
  votes: selectors.getAllVotes(state),
  pollsLoading: selectors.getPollsPending(state),
  votesLoading: selectors.getVotesPending(state)
})

const dispatchToProps = (dispatch) => ({
  loadPolls: () => dispatch(loadPollsRequest()),
  loadVotes: (id) => dispatch(loadVotesRequest(id))
})

class ShowPoll extends React.Component{
  constructor(props) {
    super(props)
    if (props.polls) {
      this.poll = props.polls.filter(poll =>
        poll._id === this.props.params.id)[0]
    }
  }
  componentDidMount() {
    if (!this.props.polls) {
      this.props.loadPolls()
    }
  }

  componentWillReceiveProps(props) {
    if (props.polls) {
      this.poll = props.polls.filter(poll =>
        poll._id === this.props.params.id)[0]
    }
  }

  render() {
    return (
      <div>
        {this.props.pollsLoading &&
          <ProgressBar type="circular" mode="indeterminate" />
        }
        {this.poll &&
          <PollCard
            poll={this.poll}
            votes={this.props.votes}
            votesLoading={this.props.votesLoading}
            loadVotes={this.props.loadVotes}
            large={true} />
        }
      </div>
    )
  }

  static propTypes = {
    polls: PropTypes.array,
    loading: PropTypes.bool,
    loadPolls: PropTypes.func
  }
}

export default connect(stateToProps, dispatchToProps)(ShowPoll)
