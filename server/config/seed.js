import User from '../api/user/user.model.js'
import bcrypt from 'bcrypt'
import thenifyAll from 'thenify-all'
import fs from 'fs'

const crypt = thenifyAll(bcrypt, {}, ['genSalt', 'hash'])

export default async () => {
  //await User.find({}).remove()

  const salt1 = await crypt.genSalt()
  const salt2 = await crypt.genSalt()
  const pw1 = await crypt.hash('1234', salt1)
  const pw2 = await crypt.hash('admin', salt2)
  
  const users = await User.count()
  if (!users) await User.create({
    name: 'test',
    email: 'test@test.com',
    password: pw1,
    provider: 'local'
  }, {
    name: 'admin',
    email: 'admin@test.com',
    password: pw2,
    role: 'admin',
    provider: 'local'
  }, {
    name: 'githubUser',
    provider: 'github'
  })
}