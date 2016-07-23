import mongoose from 'mongoose'
import supertest from 'supertest'
import {expect} from 'chai'

import app from '../../app'
import {initDb, resetDb} from '../../lib/testHelpers'

const request = supertest.agent(app.listen())

describe('user api', () => {
  before(async () => await initDb())
  after(async () => await resetDb())
  
  it('doesn\'t show user list if unauthorized', async () => {
    await request.get('/api/users')
      .expect(401)
  })

  it('saves a new user', async () => {
    const user = {
      username: 'testuser',
      password: '1234',
      email: 'testuser@test.com'
    }
    await request.post('/api/users')
      .send(user)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => expect(res.text).to.contain('token'))
  })
})