import app from '../../app'
import User from './model'

const request = supertest.agent(app.listen())

const user = {
  username: 'testuser',
  password: '1234',
  email: 'testuser@test.com',
  provider: 'local'
}

const admin = {
  username: 'admin',
  password: 'admin',
  email: 'admin@test.com',
  provider: 'local',
  role: 'admin'
}

describe('user api', function() {
  before(async function() { 
    await initDb()
  })
  afterEach(async function() {
    await User.find({}).remove()
  })
  after(async function() {
    await resetDb()
  })
  
  it('doesn\'t show user list if unauthorized', async function() {
    await request.get('/api/users') 
      .expect(401)
  })

  it('doesn\'t show user list to regular users', async function() {
    let token
    await request.post('/api/users')
      .send(user)
      .expect(res => token = JSON.parse(res.text).token)
      .expect(200)

    await request.get('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
  })

  it('shows user list to admin', async function() {
    let token
    await request.post('/api/users')
      .send(admin)
      .expect(res => token = JSON.parse(res.text).token)
      .expect(200)

    await request.get('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })


  it('saves a new user', async function() {
    await request.post('/api/users')
      .send(user)
      .expect('Content-Type', /json/)
      .expect(res => expect(res.text).to.contain('token'))
      .expect(200)
  })

})