import React, {PropTypes} from 'react'
import {Card, CardTitle, CardText, CardActions} from 'react-toolbox/lib/card'


import PollTable from 'components/pollTable/PollTable'
import PollChart from 'components/pollChart/PollChart'
import PollVotes from 'components/pollVotes/PollVotes'
import style from './PollCard.scss'

const colors = [
  '#1776B6',
  '#FF7F00',
  '#D8241F',
  '#9564BF',
  '#8D5649',
  '#E574C3',
  '#7F7F7F',
  '#BCBF00',
  '#00BED1'
]

class PollCard extends React.Component {
  //= ({poll, onPollClick, large, votes, votesLoading}) => {

  componentWillMount() {
    if (this.props.large) {
      this.props.loadVotes(this.props.poll._id)
    }
  }

  render() {
    const {poll, onPollClick, large, votes, votesLoading} = this.props
    const totalVotes = poll.options
      .reduce((acc, o) => acc + o.votes, 0)
    const cardStyle = large ? style.card + ' ' + style.large : style.card
    return (
      <Card
        className={cardStyle}
        onClick={onPollClick}
      >
        <CardTitle
          className={style.cardTitle}
          avatar={poll.owner.image}
          title={poll.title}
          subtitle={poll.description}
        />
        <CardText className={style.cardSubText}>by {poll.owner.username} - {totalVotes} votes</CardText>

        {large ?
          <div className={style.cardBody}>
            <Card className={style.cardChart}>
              <PollChart
                options={poll.options}
                total={totalVotes}
                colors={colors}
              />
            </Card>
            <Card className={style.cardTable}>
              <PollTable
                options={poll.options}
                totalVotes={totalVotes}
                colors={colors}
              />
            </Card>
            {totalVotes &&
              <Card className={style.cardVotes}>
                <PollVotes
                  poll={poll}
                  votes={votes}
                  votesLoading={votesLoading}
                />
              </Card>
            }
          </div> :
          <div className={style.cardBody}>
            <PollTable
              className={style.cardTable}
              options={poll.options}
              totalVotes={totalVotes}
              colors={colors}
            />
          </div>
        }
      </Card>
    )
  }
}


PollCard.propTypes = {
  poll: PropTypes.object.isRequired,
  onPollClick: PropTypes.func,
  large: PropTypes.bool,
  votes: PropTypes.array,
  votesLoading: PropTypes.bool,
  loadVotes: PropTypes.func
}

export default PollCard
