import React, {PropTypes} from 'react'
import {Card, CardTitle, CardText, CardActions} from 'react-toolbox/lib/card'
import {Button} from 'react-toolbox/lib/button'
import {Link} from 'react-router'
import buttonStyles from 'react-toolbox/lib/button/theme.scss'

import style from './PollCard.scss'

const PollCard = ({
  poll,
  onPollClick,
  getTotalVotes,
  user,
  onDeleteClick,
  children
}) =>
  <Card className={style.card}>
    <CardTitle
      onClick={onPollClick}
      className={onPollClick ? style.cardTitleClickable : style.cardTitle}
      avatar={poll.owner && poll.owner.image}
      title={poll.title}
      subtitle={poll.description}
    />
    <CardActions>
      {user && (poll.owner._id === user._id || user.role === 'admin') &&
        <Button
          onClick={onDeleteClick}
          icon="delete"
        >
          {'Delete'}
        </Button>
      }
      <a
        className={`${buttonStyles.button} ${buttonStyles.flat} ${buttonStyles.neutral}`}
        href={`https://twitter.com/intent/tweet?url=https%3A%2F%2Fvote-23.herokuapp.com%2Fpolls%2F${poll._id}&text=${poll.title}%20%7C%20Vote!`}
      >
        <i className={`fa fa-twitter ${style.twitterIcon}`} />
        {'Share'}
      </a>
    </CardActions>
    <CardText className={style.cardSubText}>
      {'by '}
      <Link to={`/polls/by/user/${poll.owner._id}`}>{poll.owner.username}</Link>
      {` - ${getTotalVotes(poll.options)} ${getTotalVotes(poll.options) === 1 ? 'vote' : 'votes'}`}
    </CardText>
    {children}
  </Card>

export default PollCard
