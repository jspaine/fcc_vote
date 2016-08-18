import React from 'react'
import {Card, CardMedia, CardTitle, CardText, CardActions} from 'react-toolbox/lib/card'

import PollTable from 'components/pollTable/PollTable'

import style from './PollCard.scss'

export default ({poll}) => {
  const totalVotes = poll.options
    .reduce((acc, o) => acc + o.votes, 0)
  return (
    <Card className={style.card}>
      <CardTitle
        avatar={poll.owner.image}
        title={poll.title}
        subtitle={poll.description}
      >
      </CardTitle>
      <CardText className={style.cardText}>by {poll.owner.username} - {totalVotes} votes</CardText>

      <PollTable options={poll.options} totalVotes={totalVotes} />
    </Card>
  )
}
