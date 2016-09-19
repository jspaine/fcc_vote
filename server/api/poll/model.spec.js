import app from '../../app'
import Poll from './model'
import User from '../user/model'

const testUser = {
  username: 'test',
  password: '1234',
  email: 'test@test.com',
  provider: 'local'
}

const validOptions = [
  {title: 'option 1'},
  {title: 'option 2'}
]

const shortOptions = [
  {title: 'option 1'}
]

const dupOptions = [
  {title: 'option 1'},
  {title: 'option 2'},
  {title: 'Option 2'}
]

describe('Poll model', function() {
  before(async function() { await initDb() })
  afterEach(async function() {
    await User.find().remove()
    await Poll.find().remove()
  })
  after(async function() { await resetDb() })

  it('saves a poll', async function() {
    const user = await User.create(testUser)
    const poll = await Poll.create(createTestPoll(user, validOptions))
    expect(poll.title).to.equal('test poll')
  })

  it('doesn\'t save with too few options', async function() {
    const user = await User.create(testUser)
    const poll = Poll.create(createTestPoll(user, shortOptions))
    expect(poll).to.be.rejectedWith(/validation failed/)
  })

  it('doesn\'t save with duplicate options', async function() {
    const user = await User.create(testUser)
    const poll = Poll.create(createTestPoll(user, shortOptions))
    expect(poll).to.be.rejectedWith(/validation failed/)
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
