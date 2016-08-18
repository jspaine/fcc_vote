import React from 'react'
import Table from 'react-toolbox/lib/table'

import style from './PollTable.scss'

const optionModel = {
  title: {type: String},
  voteCount: {type: String},
  votePerc: {type: String}
}

export default ({options, totalVotes}) => {
    const formatted = options.map(option => ({
      title: option.title,
      voteCount: option.votes || '0',
      votePerc: option.votes &&
        Math.round(option.votes / totalVotes * 100) + '%'
    }))
    return (
      <Table
        className={style.table}
        heading={false}
        selectable={false}
        model={optionModel}
        source={formatted}
      />
    )
  }
