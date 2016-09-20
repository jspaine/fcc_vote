import app from '../../app'
import Poll from '../poll/model'
import User from '../user/model'
import Vote from './model'

const testUser = {
  username: 'test',
  password: '1234',
  email: 'test@test.com',
  provider: 'local'
}

const options = [
  {title: 'option 1'},
  {title: 'option 2'}
]

describe('Vote model', function() {
  before(async function() { await initDb() })
  afterEach(async function() {
    await User.find().remove()
    await Poll.find().remove()
    await Vote.find().remove()
  })
  after(async function() { await resetDb() })

  it('saves a vote', async function() {
    const user = await User.create(testUser)
    const poll = await Poll.create(createTestPoll(user, options))
    const vote = await Vote.create({
      poll,
      user,
      option: poll.options[0]
    })
    expect(poll.title).to.equal('test poll')
  })

  it('doesn\'t allow user to vote twice', async function() {
    const user = await User.create(testUser)
    const poll = await Poll.create(createTestPoll(user, options))
    const vote = await Vote.create({
      poll,
      user,
      option: poll.options[0]
    })
    const dupVote =  Vote.create({
      poll,
      user,
      option: poll.options[1]
    })
    expect(dupVote).to.be.rejectedWith(/E11000/)
  })
})

function createTestPoll(owner, options) {
  return {
    title: 'test poll',
    description: 'test poll description',
    owner,
    options
  }
}
