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

class PollChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      width: Math.min(window.innerWidth - 100, 430),
      height: Math.min(window.innerWidth - 100, 430) / 2
    }
    this.handleResize = this.handleResize.bind(this)
  }
  handleResize(e) {
    const size = Math.min(window.innerWidth - 100, 430)
    this.setState({
      width: size,
      height: size / 2
    })
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  render() {
    return (
      <div>
        {this.graph().toReact()}
      </div>
    )
  }

  graph() {
    const {votes, getTotalVotes} = this.props

    const options = this.props.options.map(o => ({
        ...o,
        votes: votes.filter(v => v.option._id === o._id).length
      }))

    const total = getTotalVotes()
    const el = new fauxDOM.Element('svg')
    const maxVotes = max(options.map(option =>
          option.votes || 1))
    const optionTitles = options.map(option => option.title)
    const margin = {top: 10, right: 0, bottom: 50, left: 50}
    const width = this.state.width - margin.left - margin.right
    const height = this.state.height - margin.top - margin.bottom

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
      .append('g')
        .attr('transform', `translate(-20,${height/2})`)
        .append('text')
          .attr('text-anchor', 'middle')
          .attr('transform', 'rotate(-90)')
          .text('Votes')

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
          .html((d) => {
            return d.votes > 0 ?
            Math.round(d.votes / total * 100) + '%' :
            ''
          })

    return el
  }

  static propTypes = {
    options: PropTypes.array.isRequired,
    votes: PropTypes.array,
    getTotalVotes: PropTypes.func.isRequired
  }
}

export default PollChart
