import User from '../api/user/model'
import Poll from '../api/poll/model'
import Vote from '../api/vote/model'

export default async () => {
  //await clearAll()

  await seedUsers()
  await seedPolls()
  await seedVotes()
}

async function clearUsers() { await User.find({}).remove() }
async function clearPolls() { await Poll.find({}).remove() }
async function clearVotes() { await Vote.find({}).remove() }
async function clearAll() {
  await clearUsers()
  await clearPolls()
  await clearVotes()
}

async function seedUsers() {
  const users = await User.count()

  if (!users) await User.create({
    username: 'test',
    email: 'test@test.com',
    password: '1234',
    provider: 'local'
  }, {
    username: 'another',
    email: 'an@other.com',
    password: 'abcd',
    provider: 'local'
  }, {
    username: 'admin',
    email: 'admin@test.com',
    password: 'admin',
    role: 'admin',
    provider: 'local'
  })
}

async function seedPolls() {
  const polls = await Poll.count()
  const user1 = await User.findOne({username: 'test'})
  const user2 = await User.findOne({username: 'another'})
  const user3 = await User.findOne({username: 'admin'})
  
  if (!polls) await Poll.create({
    title: 'Best Soda',
    description: 'Irn bru 4 lyfe',
    owner: user1,
    options: [
      {title: 'Coke'},
      {title: 'Pepsi'},
      {title: 'Irn Bru'}
    ]
  }, {
    title: 'Is this site great',
    description: 'Or What',
    owner: user3,
    options: [
      {title: 'Hell yeah'},
      {title: 'What?'}
    ]
  })
}

async function seedVotes() {
  const votes = await Vote.count()
  
  const poll1 = await Poll.findOne({title: 'Best Soda'})
  const poll2 = await Poll
    .findOne({title: 'Is this site great'})
  
  const user1 = await User.findOne({username: 'test'})
  const user2 = await User.findOne({username: 'another'})
  const user3 = await User.findOne({username: 'admin'})
  
  if (!votes) {
    await Vote.create({
      poll: poll1,
      option: poll1.options[2]._id,
      user: user1
    }, {
      poll: poll1,
      option: poll1.options[0]._id,
      user: user2,
    }, {
      poll: poll1,
      option: poll1.options[0]._id,
      user: user3,
    })
    await Vote.create({
      poll: poll2,
      option: poll2.options[0]._id,
      user: user3
    }, {
      poll: poll2,
      option: poll2.options[1]._id,
      user: user1
    }, {
      poll: poll2,
      option: poll2.options[1]._id,
      user: user2
    })
  }
  
}