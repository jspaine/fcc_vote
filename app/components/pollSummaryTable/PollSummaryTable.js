import React, {PropTypes, Component} from 'react'
import {Table} from 'react-toolbox/lib/table'
import {Button} from 'react-toolbox/lib/button'

import style from './PollSummaryTable.scss'

const optionModel = {
  title: {type: String},
  voteCount: {type: String},
  votePerc: {type: String}
}

export default class extends Component {
  render() {
    const {options} = this.props
    const total = options.reduce((acc, x) => acc + x.votes, 0)

    const data = options.map(option => ({
      id: option._id,
      title: option.title,
      voteCount: option.votes ? option.votes.toString() : '0',
      votePerc: option.votes > 0 &&
        Math.round(option.votes / total * 100) + ' %'
    }))

    return (
      <Table
        className={style.table}
        heading={false}
        selectable={false}
        model={optionModel}
        source={data}
      />
    )
  }
}
