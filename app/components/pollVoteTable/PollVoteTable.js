import React, {PropTypes, Component} from 'react'
import {Table} from 'react-toolbox/lib/table'
import {Button} from 'react-toolbox/lib/button'
import {Input} from 'react-toolbox/lib/input'

import style from './PollVoteTable.scss'

const optionModel = {
  option: {type: String},
  votes: {type: String},
  '%': {type: String}
}

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: [this.getUserVote()],
      other: ''
    }
    this.handleSelect = this.handleSelect.bind(this)
    this.handleOther = this.handleOther.bind(this)
  }
  componentDidUpdate(prevProps) {
    if (prevProps.options === this.props.options) return
    this.setState({selected: [this.getUserVote()]})
  }
  handleOther(other) {
    this.setState({
      selected: [],
      other
    })
  }
  handleSelect(selected) {
    this.setState({
      selected,
      other: ''
    })
  }
  getUserVote() {
    if (!this.props.userId) return null
    const vote = this.props.votes.filter(v => v.user && v.user._id === this.props.userId)
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
          <div className={style.footer}>
            <Button
              label="Vote!"
              disabled={!canSubmit(this.state)}
              onClick={saveVote(this.props.userId,
                selectedOption(options, this.state))}
            />
            {userId &&
              <Input
                type="text"
                label="Something Else"
                value={this.state.other}
                onChange={this.handleOther}
              />
            }
          </div>
        }
      </div>
    )
  }
}

function canSubmit(state) {
  return (state.selected.length > 0 &&
          state.selected[0] !== null) ||
        state.other.trim() !== ''
}

function selectedOption(options, state) {
  if (state.selected.length > 0 &&
      state.selected[0] !== null) {
    return options[state.selected[0]]
  }
  return {title: state.other}
}
