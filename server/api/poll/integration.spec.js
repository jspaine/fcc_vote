import app from '../../app'
import Poll from './model'
import User from '../user/model'

const request = supertest.agent(app.listen())

describe('Poll api', function() {
  let user1, user2, admin

  before(async function() {
    await initDb()
    await User.find({}).remove()
    user1 = await createTestUser('user')
    // user2 = await createTestUser('user2')
    // admin = await createTestUser('admin')
  })
  afterEach(async function() {
    await Poll.find().remove()
  })
  after(async function() {
    await User.find().remove()
    await resetDb()
  })

  it('saves a new poll', async function() {
    await createTestPoll(user1)
  })

  it('shows list of polls', async function() {
    await createTestPoll(user1)
    await request.get('/api/polls')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res =>
          expect(res.body.length).to.equal(1))
  })

  it('shows a poll', async function() {
    const poll = await createTestPoll(user1)
    await request.get(`/api/polls/${poll._id}`)
      .expect(200)
      .expect('Content-Type', /json/)

  })

  it('updates a poll', async function() {
    const poll = await createTestPoll(user1)

    await request.put(`/api/polls/${poll._id}`)
      .set('Authorization', `Bearer ${user1.token}`)
      .send({
        title: 'Best Soda',
        description: 'Ok it\'s coke',
        options: [
          {title: 'Coke'},
          {title: 'Coke'}
        ]
      })
      .expect(200)
  })

  it('deletes a poll', async function() {
    const poll = await createTestPoll(user1)

    await request.del(`/api/polls/${poll._id}`)
      .set('Authorization', `Bearer ${user1.token}`)
      .expect(200)
  })


})

async function createTestUser(name) {
  const res = await request.post('/api/users').send({
    username: name,
    password: '1234',
    email: `${name}@test.com`,
    provider: 'local',
    role: name === 'admin' ? 'admin' : 'user'
  })
    .expect(200)
  return res.body
}

async function createTestPoll(owner) {
  const res = await request.post('/api/polls')
    .set('Authorization', `Bearer ${owner.token}`)
    .send({
      title: 'Best Soda',
      description: 'Irn bru 4 lyfe',
      options: [
        {title: 'Coke'},
        {title: 'Pepsi'},
        {title: 'Irn Bru'}
      ]
    })
    .expect(200)
    .expect('Content-Type', /json/)
  return res.body
}
