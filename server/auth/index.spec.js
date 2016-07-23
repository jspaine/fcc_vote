import mongoose from 'mongoose'
import supertest from 'supertest'
import {expect} from 'chai'

import app from '../app'
import User from '../api/user/model'
import {initDb, resetDb} from '../lib/testHelpers'

const request = supertest.agent(app.listen())

const testUser = new User({
  username: 'test',
  password: '1234',
  provider: 'local'
})

describe('auth routes', () => {

  describe('local auth', () => {
    before(async () => {
      await initDb()
      await testUser.save()
    })
    after( async () => {
      await User.find({}).remove()
      await resetDb()
    })

    it('rejects invalid users', async () => {
      await request.post('/auth/local')
        .send({username: 'invalid', password: '1234'})
        .expect(res => expect(res.text).to.contain('Invalid user'))
        .expect(401)
    })

    it('rejects invalid passwords', async () => {
      await request.post('/auth/local')
        .send({username: 'test', password: 'abcd'})
        .expect(res => expect(res.text).to.contain('Invalid login'))
        .expect(401)
    })

    it('accepts valid logins', async () => {
      await request.post('/auth/local')
        .send({ username: 'test', password: '1234'})
        .expect(res => expect(res.text).to.contain('token'))
        .expect(200)
    })
  })
})