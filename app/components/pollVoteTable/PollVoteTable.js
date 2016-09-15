import React, {PropTypes, Component} from 'react'
import Table from 'react-toolbox/lib/table'
import Button from 'react-toolbox/lib/button'

import style from './PollVoteTable.scss'

const optionModel = {
  option: {type: String},
  votes: {type: String},
  '%': {type: String}
}

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {selected: [this.getUserVote()]}
    this.handleSelect = this.handleSelect.bind(this)
  }
  componentDidUpdate(prevProps) {
    if (prevProps.options === this.props.options) return
    this.setState({selected: [this.getUserVote()]})
  }
  handleSelect(selected) {
    this.setState({selected})
  }
  getUserVote() {
    if (!this.props.userId) return null
    const vote = this.props.votes.filter(v => v.user._id === this.props.userId)
    if (vote.length !== 1) return null
    const optionId = vote[0].option._id
    return this.props.options.findIndex(o => o._id === optionId)
  }
  getOptionVotes(votes, optionId) {
    return votes ? votes.filter(v => v.option._id === optionId).length : 0
  }
  render() {
    const {
      options,
      getTotalVotes,
      canVote,
      saveVote,
      votes,
      optionVotes,
      userId
    } = this.props

    const data = options.map(option => {
      const numVotes = this.getOptionVotes(votes, option._id)
      const votePerc = numVotes > 0 &&
          Math.round(numVotes / getTotalVotes() * 100) + ' %'

      return {
        option: option.title,
        votes: numVotes.toString(),
        '%': votePerc
      }
    })

    return (
      <div>
        <Table
          className={style.table}
          heading
          selectable
          multiSelectable={false}
          selected={this.state.selected}
          onSelect={canVote ? this.handleSelect : null}
          model={optionModel}
          source={data}
        />
        {canVote &&
          <span>
          <Button
            label="Vote!"
            disabled={this.state.selected.length < 1 || this.state.selected[0] === null}
            onClick={saveVote(this.props.userId, options[this.state.selected[0]])}
          />
          <Button
            label="Add Option"
            onClick={() => null}
          />
          </span>
        }
      </div>
    )
  }
}
