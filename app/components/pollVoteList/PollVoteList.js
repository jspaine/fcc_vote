import React, {PropTypes} from 'react'
import {ProgressBar} from 'react-toolbox/lib/progress_bar'
import {Card, CardTitle} from 'react-toolbox/lib/card'
import moment from 'moment'

import style from './PollVoteList.scss'

const PollVoteList = ({poll, votes, votesLoading}) => {
  return (
  <div>
    {votesLoading && <ProgressBar type="circular" mode="indeterminate" />}
    <ul className={style.voteList}>
      {votes && votes.map(vote =>
        <li key={vote._id}>
          <Card>
            <CardTitle
              className={style.cardTitle}
              avatar={vote.user && vote.user.image ?
                vote.user.image : 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50'
              }
              title={`${getUsername(vote.user)} voted for ${getTitle(poll.options, vote)}`}
              subtitle={moment(vote.at).fromNow()}
            />
            </Card>
        </li>
      )}
    </ul>
  </div>)}

PollVoteList.propTypes = {
  poll: PropTypes.object.isRequired,
  votes: PropTypes.array,
  votesLoading: PropTypes.bool
}

export default PollVoteList

function getTitle(options, vote) {
  if (!options || !vote.option) return
  const res = options.find(o => o._id === vote.option._id)
  if(res) return res.title
}

function getUsername(user) {
  if (!user) return '[deleted]'
  if (!user.username) return 'anonymous'
  return user.username
}
