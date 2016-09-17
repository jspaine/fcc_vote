import React, {PropTypes} from 'react'
import {Card, CardTitle, CardText} from 'react-toolbox/lib/card'

import style from './PollCard.scss'

const PollCard = ({
  poll,
  onPollClick,
  getTotalVotes,
  children
}) =>
  <Card onClick={onPollClick}>
    {console.log('poll', poll)}
    <CardTitle
      className={style.cardTitle}
      avatar={poll.owner && poll.owner.image}
      title={poll.title}
      subtitle={poll.description}
    />
    <CardText className={style.cardSubText}>
      {`by ${poll.owner.username} - ${getTotalVotes(poll.options)} ${getTotalVotes(poll.options) === 1 ? 'vote' : 'votes'}`}
    </CardText>
    {children}
  </Card>

export default PollCard
