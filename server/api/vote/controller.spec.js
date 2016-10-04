import injector from 'inject!./controller'

const userStub = {
  where: function() {},
  _id: 1234,
  username: 'a user'
}
const where = sinon.stub(userStub, 'where', function(param) {
  return param.ip === '192.0.2.0' ?
    Promise.resolve(this) :
    Promise.resolve(null)
})

const UserStub = sinon.spy(function() { return userStub })
UserStub.findOne = sinon.stub().returns(userStub)
UserStub.create = sinon.stub().resolves(userStub)

const pollStub = {
  title: 'new poll',
  options: [
    {_id: 123, title: 'option 1'},
    {_id: 234, title: 'option 2'}
  ]
}

const PollStub = sinon.spy(function() { return pollStub })
PollStub.findById = sinon.stub().resolves(pollStub)
PollStub.findByIdAndUpdate = sinon.stub().resolves({
  ...pollStub,
  options: [
    ...pollStub.options,
    {_id: 1234, title: 'new option'}
  ]
})

const testVote = {
  _id: 1234,
  poll: 1234,
  user: 1234
}

const voteStub = {
  save: sinon.stub().resolves(testVote),
  populate: sinon.stub().returnsThis,
  where: sinon.stub().returnsThis,
  sort: sinon.stub().returnsThis,
  execPopulate: sinon.stub().returnsThis,
  lean: sinon.stub().returnsThis,
  ...testVote
}

export const VoteStub = sinon.spy(function() { return voteStub })
VoteStub.find = sinon.stub().returns(voteStub)
VoteStub.create = sinon.stub().returns(voteStub)

const controller = injector({
  './model': VoteStub,
  '../poll/model': PollStub,
  '../user/model': UserStub
}).default

describe('Vote controller', function() {

  it('queries votes', async function() {
    const ctx = {
      params: {pid: 1234}
    }
    await controller.index(ctx)
    expect(VoteStub.find).to.have.been.calledOnce
    expect(ctx.body).to.have.property('_id', 1234)
  })

  it('creates votes for logged in users', async function() {
    const vote = {
      poll: 1234,
      user: 1234,
      option: 1234
    }

    const ctx = {
      request: {
        ip: '192.0.2.0',
        body: {_id: 1234},
        headers: {}
      },
      state: {user: {
        _id: 1234,
        username: 'test',
        role: 'user'
      }},
      params: {pid: 1234},
    }

    await controller.create(ctx)
    expect(ctx.body).to.have.property('_id', 1234)
    expect(VoteStub.create).to.have.been.calledWith(vote)
  })

  it('creates votes for anonymous users', async function() {
    const vote = {
      poll: 1234,
      user: 1234,
      option: 1234
    }

    const ctx = {
      request: {
        ip: '192.0.2.0',
        body: {_id: 1234},
        headers: {}
      },
      state: {},
      params: {pid: 1234},
    }

    await controller.create(ctx)

    expect(ctx.body).to.have.property('_id', 1234)
    expect(VoteStub.create).to.have.been.calledWith(vote)
    expect(UserStub.findOne).to.have.been.called
  })

  it('creates votes for new anonymous users', async function() {
    const vote = {
      poll: 1234,
      user: 1234,
      option: 1234
    }

    const ctx = {
      request: {
        ip: '192.0.2.1',
        body: {_id: 1234},
        headers: {}
      },
      state: {},
      params: {pid: 1234},
    }

    await controller.create(ctx)

    expect(UserStub.create).to.have.been.calledWith({
      role: 'guest',
      provider: null,
      ip: ctx.request.ip
    })
    expect(ctx.body).to.have.property('_id', 1234)
    expect(VoteStub.create).to.have.been.calledWith(vote)
    expect(UserStub.findOne).to.have.been.called
  })

  it('creates votes on new option for logged in users', async function() {
    const vote = {
      poll: 1234,
      user: 1234,
      option: 1234
    }

    const ctx = {
      request: {
        ip: '192.0.2.0',
        body: {title: 'new option'},
        headers: {}
      },
      state: {user: {
        _id: 1234,
        username: 'test',
        role: 'user'
      }},
      params: {pid: 1234},
    }

    await controller.create(ctx)

    expect(PollStub.findByIdAndUpdate).to.have.been.calledWith(1234, {
      $push: {
        options: ctx.request.body
      }
    }, {new: true})
    expect(ctx.body).to.have.property('_id', 1234)
    expect(VoteStub.create).to.have.been.calledWith(vote)
    expect(UserStub.findOne).to.have.been.called
  })

  it('doesn\'t create votes with duplicate option titles', async function() {
    const vote = {
      poll: 1234,
      user: 1234,
      option: 1234
    }

    const ctx = {
      request: {
        ip: '192.0.2.0',
        body: {title: 'option 1'},
        headers: {}
      },
      state: {user: {
        _id: 1234,
        username: 'test',
        role: 'user'
      }},
      params: {pid: 1234},
    }

    expect(controller.create(ctx)).to.be.rejectedWith(/duplicate option/)
  })

})
