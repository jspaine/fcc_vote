import app from '../app'
import User from '../api/user/model'

const request = supertest.agent(app.listen())

const testUser = new User({
  username: 'test',
  email: 'test@test.com',
  password: '1234',
  provider: 'local'
})

describe('Auth api', function() {

  describe('local auth', function() {
    before(async function() {
      await initDb()
      await User.find({}).remove()
      await User.create(testUser)
    })
    after(async function() {
      await User.find({}).remove()
      await resetDb()
    })

    it('rejects invalid users', async function() {
      await request.post('/auth/local')
        .send({ username: 'invalid', password: '1234' })
        .expect(res => expect(res.text).to.contain('Invalid user'))
        .expect(401)
    })

    it('rejects invalid passwords', async function() {
      await request.post('/auth/local')
        .send({ username: 'test', password: 'abcd' })
        .expect(res => expect(res.text).to.contain('Invalid login'))
        .expect(401)
    })

    it('accepts valid logins', async function() {
      await request.post('/auth/local')  
        .send({ username: 'test', password: '1234' })
        .expect(res => expect(res.text).to.contain('token'))
        .expect(200)
    })
  })
})
