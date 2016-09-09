import React, {PropTypes, Component} from 'react'
import Table from 'react-toolbox/lib/table'
import Button from 'react-toolbox/lib/button'

import style from './PollTable.scss'

const optionModel = {
  title: {type: String},
  voteCount: {type: String},
  votePerc: {type: String}
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
  render() {
    const {
      options,
      totalVotes,
      large,
      canVote,
      saveVote,
      votes,
      userId
    } = this.props

    const data = options.map(option => ({
      id: option._id,
      title: option.title,
      voteCount: option.votes || '0',
      votePerc: option.votes &&
        Math.round(option.votes / totalVotes * 100) + ' %'
    }))

    return (
      <div>
        <Table
          className={style.table}
          heading={false}
          selectable={large}
          selected={this.state.selected}
          onSelect={canVote ? this.handleSelect : null}
          model={optionModel}
          source={data}
        />
        {large && canVote &&
          (this.state.selected.length > 0) && (this.state.selected[0] !== null) &&
          <Button
            label="Vote!"
            onClick={saveVote(this.props.userId, options[this.state.selected[0]])}
          />
        }
      </div>
    )
  }
  }
