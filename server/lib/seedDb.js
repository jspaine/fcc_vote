import User from '../api/user/model'

export default async () => {
  await User.find({}).remove()
  
  const users = await User.count()
  if (!users) await User.create({
    username: 'test',
    email: 'test@test.com',
    password: '1234',
    provider: 'local'
  }, {
    username: 'admin',
    email: 'admin@test.com',
    password: 'admin',
    role: 'admin',
    provider: 'local'
  })
}