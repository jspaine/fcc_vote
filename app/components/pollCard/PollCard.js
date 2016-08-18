import React from 'react'
import {Card, CardMedia, CardTitle, CardText, CardActions} from 'react-toolbox/lib/card'

export default ({poll}) =>
  <Card>
    <CardTitle
      avatar="https://placeimg.com/80/80/animals"
      title={poll.title}
      subtitle={`by ${poll.owner.username}`}
    >
    </CardTitle>
    <CardText>{poll.owner.username}</CardText>

  </Card>
