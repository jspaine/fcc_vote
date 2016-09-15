import app from '../../app'
import User from './model'

const testUser = {
  username: 'test',
  password: '1234',
  email: 'test@test.com',
  provider: 'local'
}

describe('User model', function() {
  before(async function() { await initDb() })
  beforeEach(async function() { await User.find().remove() })
  after(async function() {
    await User.find().remove()
    await resetDb()
  })

  it('saves a user', async function() {
    const user = await User.create(testUser)
    expect(user.username).to.equal('test')
  })

  it('hashes password on save', async function() {
    const user = await User.create(testUser)
    expect(user.password).to.match(/[\$\.\/a-zA-Z0-9]{60}/)
  })

  it('requires an email for local users', async function() {
    const user = {...testUser, email: ''}
    return expect(User.create(user)).to.be.rejectedWith(/validation failed/)
  })

  it('doesn\'t require an email for oauth users', async function() {
    const user = {...testUser, provider: 'github', email: ''}
    return expect(User.create(user)).to.not.be.rejected
  })

  it('authenticates user with password', async function() {
    const user = await User.create(testUser)
    return expect(user.authenticate('1234')).to.eventually.be.true
  })

})
