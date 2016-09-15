import app from '../../app'
import User from './model'
import config from '../../config'

const request = supertest.agent(app.listen())

const testUser = {
  username: 'testuser',
  password: '1234',
  email: 'testuser@test.com',
  provider: 'local'
}

const testAdmin = {
  username: 'admin',
  password: 'admin',
  email: 'admin@test.com',
  provider: 'local',
  role: 'admin'
}

describe('User api', function() {
  before(async function() {
    await initDb()
  })
  afterEach(async function() {
    await User.find({}).remove()
  })
  after(async function() {
    await resetDb()
  })

  it('saves a new user', async function() {
    await saveUser(testUser)
  })

  it('doesn\'t save a duplicate user', async function() {
    await saveUser(testUser)
    await request.post('/api/users')
      .send(testUser)
      .expect(500)
      .expect(res => {
        expect(res.body).to.have.property('error')
        expect(res.body.error).to.have.length(2)
      })
  })

  it('doesn\'t show user list if unauthorized', async function() {
    await request.get('/api/users')
      .expect(401)
  })

  it('doesn\'t show user list to regular users', async function() {
    const {token} = await saveUser(testUser)

    await request.get('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
  })

  it('shows user list to admin', async function() {
    const {token} = await saveUser(testAdmin)
    await request.get('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  it('deletes current user', async function() {
    const {id, token} = await saveUser(testUser)

    await request.delete(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  it('doesn\'t delete other users', async function() {
    const {token} = await saveUser(testUser)
    const {id} = await saveUser({...testUser, username: 'test2', email: 'test@2.com'})
    await request.delete(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
  })

  it('admin can delete other users', async function() {
    const {token} = await saveUser(testAdmin)
    const {id} = await saveUser(testUser)
    await request.delete(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  if (config.useCookie) {
    it('uses cookies to access protected resource', async function() {
      await saveUser(testAdmin)

      const loginRes = await request.post('/auth/local')
        .send({
          username: 'admin',
          password: 'admin'
        })
      const cookies = loginRes.headers['set-cookie'].map(cookie => cookie.split(';')[0])

      await request.get('/api/users')
        .set('Cookie', cookies.join('; '))
        .expect(200)
    })
  }
})

async function saveUser(user) {
  const res = await request.post('/api/users')
    .send(user)
    .expect(200)
    .expect('Content-Type', /json/)
  return res.body
}
