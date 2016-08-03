import injector from 'inject?jsonwebtoken&./model!./controller'

const userStub = {
  save: sinon.stub().resolves({
    _id: 1234, 
    token: 'abcd'
  }),
  username: 'a user'
}

const UserStub = sinon.spy(function() { return userStub })
UserStub.find = sinon.stub().resolves('user list')
UserStub.findOne = sinon.stub().resolves(userStub)
UserStub.findOneAndRemove = sinon.stub().resolves('deleted user')

const jwtStub = {
  sign: sinon.spy(function() { return 'abcd' })
}

const controller = injector({
  './model': UserStub,
  'jsonwebtoken': jwtStub
}).default

describe('User controller', function() {
  
  it('queries users', async function() {
    const ctx = {}
    await controller.index(ctx)
    expect(UserStub.find).to.have.been.calledOnce
    expect(ctx).to.have.property('body', 'user list')
  })

  it('creates a new user', async function() {
    const ctx = {
      request: { body: 'request body' }
    }
    
    await controller.create(ctx)
    expect(UserStub).to.have.been.calledWithNew
    expect(userStub.save).to.have.been.calledOnce
    expect(jwtStub.sign).to.have.been.calledOnce
    expect(ctx).to.have.deep.property('body.id', 1234)
    expect(ctx)
      .to.have.deep.property('body.token', 'abcd')
  })

  it('deletes a user if admin', async function() {
    const ctx = {
      state: { user: { role: 'admin' } },
      params: { id: 1234 }
    }

    await controller.del(ctx)
    expect(UserStub.findOneAndRemove)
      .to.have.been.calledWith({_id: 1234})
    expect(ctx.status).to.equal(200)
  })

  it('deletes current user', async function() {
    const ctx = {
      state: { user: { _id: 1234 } },
      params: { id: 1234 }
    }

    await controller.del(ctx)
    expect(UserStub.findOneAndRemove)
      .to.have.been.calledWith({_id: 1234})
    expect(ctx.status).to.equal(200)
  })

  it('doesn\'t delete other user', async function() {
    const ctx = {
      state: { user: { _id: 5678 } },
      params: { id: 1234 }
    }

    await controller.del(ctx)
    expect(UserStub.findOneAndRemove)
      .to.have.been.calledWith({_id: 1234})
    expect(ctx.status).to.equal(401)
  })

  it('shows current user', async function() {
    const ctx = {
      state: {
        user: {_id: 1234}
      }
    }
    await controller.me(ctx)
    expect(UserStub.findOne)
      .to.have.been.calledWith({_id: 1234})
    expect(ctx)
      .to.have.deep.property('body.username', 'a user')
  })

  it('shows a specific user', async function() {
    const ctx = {
      params: {_id: 1234}
    }
    await controller.show(ctx)
    expect(UserStub.findOne)
      .to.have.been.calledWith({_id: 1234})
    expect(ctx)
      .to.have.deep.property('body.username', 'a user')
  })

  it('changes a users password', async function() {
    const ctx = {
      params: {_id: 1234},
      request: {
        body: {password: 'password'}
      }
    }
    await controller.update(ctx)
    expect(UserStub.findOne)
      .to.have.been.calledWith({_id: 1234})
    expect(userStub.save).to.have.been.called
    expect(ctx).to.have.property('status', 200)
  })
})