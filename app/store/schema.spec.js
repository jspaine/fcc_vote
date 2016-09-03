import {normalize} from 'normalizr'
import {denormalize} from 'denormalizr'

import * as schema from './schema'

describe('schema', function() {
  const userData = [
    {_id: 1, username: 'john', image: 'http://some.image.com'},
    {_id: 2, username: 'alice', image: 'http://catz.com'}
  ]
  const pollData = [
    {
      _id: 10, title: 'Best soda',
      owner: {_id: 1, username: 'john'},
      options: [
        {_id: 100, title: 'Coke'},
        {_id: 101, title: 'Pepsi'}
      ]
    }, {
      _id: 11, title: 'Best car',
      owner: {_id: 2, username: 'alice'},
      options: [
        {_id: 110, title: 'Fiat'},
        {_id: 111, title: 'Lada'}
      ]
    }
  ]
  const voteData = [
    {
      _id: 1000,
      poll: 10,
      option: 100,
      user: 1
    }, {
      _id: 1001,
      poll: 11,
      option: 110,
      user: 2
    }
  ]

  it('normalizes user data', function() {
    const users = normalize(userData, schema.arrayOfUsers)
    const user = normalize(userData[0], schema.user)
    expect(users).to.deep.equal({
      entities: {
        users: {
          '1': userData[0],
          '2': userData[1]
        }
      },
      result: [1, 2]
    })
    expect(user).to.deep.equal({
      entities: {
        users: {
          '1': userData[0]
        }
      },
      result: 1
    })
  })

  it('normalizes poll data', function() {
    const polls = normalize(pollData, schema.arrayOfPolls)
    const poll = normalize(pollData[0], schema.poll)
    expect(polls).to.have.property('entities')
    expect(polls).to.have.deep.property('entities.polls')
    expect(polls).to.have.deep.property('entities.users')
    expect(polls).to.have.deep.property('entities.options')
    expect(polls.result).to.deep.equal([10,11])
    expect(poll.result).to.equal(10)
  })

  it('normalizes vote data', function() {
    const votes = normalize(voteData, schema.arrayOfVotes)
    const vote = normalize(voteData[0], schema.vote)
    expect(votes).to.have.property('entities')
    expect(votes).to.have.deep.property('entities.votes')
    expect(votes.result).to.deep.equal([1000, 1001])
    expect(vote.result).to.equal(1000)
  })

  it('denormalizes poll data', function() {
    const entities = {
      ...normalize(pollData, schema.arrayOfPolls).entities,
      ...normalize(userData, schema.arrayOfUsers).entities,
      ...normalize(voteData, schema.arrayOfVotes).entities
    }

    const poll = denormalize(
      entities.polls['11'],
      entities,
      schema.poll
    )

    const polls = denormalize(
      [...Object.keys(entities.polls)],
      entities,
      schema.arrayOfPolls
    )

    expect(poll).to.have.deep.property('owner.username', 'alice')
    expect(poll.options[0]).to.have.property('title', 'Fiat')
    expect(polls.length).to.equal(2)
  })
})
