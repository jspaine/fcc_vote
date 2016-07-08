import User from '../api/user/user.model.js'

(async () => {
  //await User.find({}).remove()
  const users = await User.count()
  if (!users) await User.create({
    name: 'test',
    email: 'test@test.com',
    password: '1234',
    provider: 'local'
  }, {
    name: 'admin',
    email: 'admin@test.com',
    password: 'admin',
    role: 'admin',
    provider: 'local'
  }, {
    name: 'githubUser',
    provider: 'github'
  })
})()