import React, {PropTypes} from 'react'
import {ProgressBar} from 'react-toolbox/lib/progress_bar'
import moment from 'moment'

import style from './PollVoteList.scss'

const PollVotes = ({poll, votes, votesLoading}) =>
  <div>
    {votesLoading && <ProgressBar type="circular" mode="indeterminate" />}
    <ul className={style.voteList}>
      {votes && votes.map(vote =>
        <li key={vote.user._id}>
          <span>{vote.user.username} voted for </span>
          <span>{getTitle(poll.options, vote)} </span>
          <span>{moment(vote.at).fromNow()}</span>
        </li>
      )}
    </ul>
  </div>

PollVotes.propTypes = {
  poll: PropTypes.object.isRequired,
  votes: PropTypes.array,
  votesLoading: PropTypes.bool
}

export default PollVotes

function getTitle(options, vote) {
  if (!options || !vote.option) return
  const res = options.find(o => o._id === vote.option._id)
  if(res) return res.title
}
