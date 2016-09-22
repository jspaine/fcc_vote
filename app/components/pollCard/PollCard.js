import React, {PropTypes} from 'react'
import {Card, CardTitle, CardText, CardActions} from 'react-toolbox/lib/card'
import {Button} from 'react-toolbox/lib/button'

import style from './PollCard.scss'

const PollCard = ({
  poll,
  onPollClick,
  getTotalVotes,
  user,
  onDeleteClick,
  children
}) =>
  <Card>
    <CardTitle
      onClick={onPollClick}
      className={style.cardTitle}
      avatar={poll.owner && poll.owner.image}
      title={poll.title}
      subtitle={poll.description}
    />
    <CardText className={style.cardSubText}>
      {`by ${poll.owner.username} - ${getTotalVotes(poll.options)} ${getTotalVotes(poll.options) === 1 ? 'vote' : 'votes'}`}
    </CardText>
    {children}
    <CardActions>
      {user && (poll.owner._id === user._id || user.role === 'admin') &&
        <Button onClick={onDeleteClick}>Delete</Button>
      }
    </CardActions>
  </Card>

export default PollCard
