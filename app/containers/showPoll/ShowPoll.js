import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {Button, IconButton} from 'react-toolbox/lib/button'
import {ProgressBar} from 'react-toolbox/lib/progress_bar'

import {loadPollsRequest} from 'store/modules/polls'
import {loadVotesRequest, saveVoteRequest} from 'store/modules/votes'
import {selectors} from 'store/modules'
import {
  PollCard,
  PollChart,
  PollVoteTable,
  PollVoteList
} from 'components'

const stateToProps = (state, props) => ({
  poll: selectors.getPollById(state, props.params.id),
  votes: selectors.getPollVotes(state, props.params.id),
  canVote: selectors.getCanVote(state, state.auth.user._id, props.params.id),
  userId: state.auth.user._id,
  pollsLoading: selectors.getPollsPending(state),
  votesLoading: selectors.getVotesPending(state)
})

const dispatchToProps = (dispatch, props) => ({
  loadPolls: () => dispatch(loadPollsRequest()),
  loadVotes: () => dispatch(loadVotesRequest(props.params.id)),
  saveVote: (userId, option) => () => dispatch(saveVoteRequest(
    props.params.id,
    option._id,
    userId
  ))
})

class ShowPoll extends React.Component{
  componentDidMount() {
    if (!this.props.poll) {
      this.props.loadPolls()
    }
    this.props.loadVotes()
  }

  render() {
    const {
      poll,
      votes,
      canVote,
      saveVote,
      userId,
      pollsLoading,
      votesLoading
    } = this.props

    return (
      <div>
        {pollsLoading &&
          <ProgressBar type="circular" mode="indeterminate" />
        }
        {poll &&
          <PollCard
            poll={poll}
            getTotalVotes={() => getTotalVotes(poll, votes)}
          >
            <PollVoteTable
              options={poll.options}
              getTotalVotes={() => getTotalVotes(poll, votes)}
              canVote={canVote}
              saveVote={saveVote}
              votes={votes}
              userId={userId}
            />
            <PollChart
              options={poll.options}
              votes={votes}
              getTotalVotes={() => getTotalVotes(poll, votes)}
            />
            <PollVoteList
              poll={poll}
              votes={votes}
              votesLoading={votesLoading}
            />
          </PollCard>
        }
      </div>
    )
  }

  static propTypes = {
    poll: PropTypes.object,
    votes: PropTypes.array,
    pollsLoading: PropTypes.bool,
    votesLoading: PropTypes.bool,
    loadPolls: PropTypes.func,
    loadVotes: PropTypes.func
  }
}

export default connect(stateToProps, dispatchToProps)(ShowPoll)

function getTotalVotes(poll, votes) {
  if (votes && votes.length) {
    return votes.length
  }
  return poll.options.reduce((acc, x) => acc + x.votes, 0)
}
