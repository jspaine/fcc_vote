import React, {PropTypes} from 'react'
import fauxDOM from 'react-faux-dom'
import {
  axisBottom,
  axisLeft,
  max,
  scaleLinear,
  scaleBand,
  select
} from 'd3'

import style from './PollChart.scss'

class PollChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {chart: null}
  }

  componentDidMount() {
    this.setState({chart: this.graph().toReact()})
  }

  componentWillReceiveProps() {
    this.setState({chart: this.graph().toReact()})
  }

  render() {
    return (
      <div>
        {this.state.chart}
      </div>
    )
  }

  graph() {
    const {colors, options, total} = this.props
    const el = new fauxDOM.Element('svg')
    const maxVotes = max(options.map(option =>
          option.votes || 0))
    const optionTitles = options.map(option => option.title)
    const margin = {top: 20, right: 20, bottom: 50, left: 40}
    const width = 400 - margin.left - margin.right
    const height = 300 - margin.top - margin.bottom

    const x = scaleBand()
      .rangeRound([0, width])
      .domain(optionTitles)

    const y = scaleLinear()
      .range([height, 0])
      .domain([0, maxVotes])

    const xAxis = axisBottom()
      .scale(x)
      .tickFormat((d) => '')


    const yAxis = axisLeft()
      .scale(y)
      .ticks(maxVotes < 5 ? maxVotes : 5);

    const svg = select(el)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

    svg.append('g')
      .attr('class', `${style.x} ${style.axis}`)
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('g')
        .append('svg:foreignObject')
        .attr('width', x.bandwidth())
        .attr('x', -x.bandwidth() / 2)
        .attr('y', 12)
        .append('xhtml:div')
          .html((d, i) => optionTitles[i])

    svg.append('g')
      .attr('class', `${style.y} ${style.axis}`)
      .call(yAxis)

    const bars = svg.selectAll('.bar')
      .data(options)
      .enter()

      bars.append('rect')
        .attr('class', style.bar)
        .attr('fill', (d, i) => colors[i % colors.length])
        .attr('x', (d) => x(d.title) + x.bandwidth() / 4)
        .attr('width', x.bandwidth() / 2)
        .attr('y', (d) => y(d.votes))
        .attr('height', (d) => height - y(d.votes))

      bars.append('svg:foreignObject')
        .attr('width', x.bandwidth())
        .attr('x', (d) => x(d.title))
        .attr('y', (d) => (y(d.votes) + 10) < height ? y(d.votes) + 10 : height - 20)
        .attr('class', style.barLabel)
        .append('xhtml:div')
          .attr('color', 'white')
          .html((d) => Math.round(d.votes / total * 100) + '%')


    return el
  }

  static propTypes = {
    options: PropTypes.array.isRequired,
    colors: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired
  }
}

export default PollChart
