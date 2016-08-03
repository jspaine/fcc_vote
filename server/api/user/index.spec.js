import injector from 'inject!./index'

const routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  del: sinon.spy(),
  post: sinon.spy()
}

const RouterStub = sinon.spy(function() { return routerStub })

const authStub = {
  isAuthenticated: 'authService.isAuthenticated',
  hasRole(role) {
    return `authService.hasRole(${role})`
  }
}

const controllerStub = {
  index: 'controller.index',
  create: 'controller.create',
  me: 'controller.me',
  update: 'controller.update',
  show: 'controller.show',
  del: 'controller.del'
}

const router = injector({
  'koa-router': RouterStub,
  '../../lib/authService': authStub,
  './controller': controllerStub
}).default

describe('User router', function() {
  it('instantiates and returns a router', function() {
    expect(RouterStub).to.have.been.calledWithNew
    expect(router).to.be.an.object
  })
  
  it('GET /api/users routes admins to controller.index', function() {
    expect(
      routerStub.get.withArgs('/', 'authService.hasRole(admin)', 'controller.index')
    ).to.have.been.calledOnce
  })

  it('POST /api/users routes to controller.create', function() {
    expect(
      routerStub.post.withArgs('/', 'controller.create')
    ).to.have.been.calledOnce
  })

  it('GET /api/users/me routes authenticated users to controller.me', function() {
    expect(
      routerStub.get.withArgs('/me', 'authService.isAuthenticated', 'controller.me')
    ).to.have.been.calledOnce
  })

  it('PUT /api/users/:id/password routes authenticated users to controller.update', function() {
    expect(
      routerStub.put.withArgs('/:id/password', 'authService.isAuthenticated', 'controller.update')
    ).to.have.been.calledOnce
  })

  it('GET /api/users/:id routes authenticated users to controller.show', function() {
    expect(
      routerStub.get.withArgs('/:id', 'authService.isAuthenticated', 'controller.show')
    ).to.have.been.calledOnce
  })

  it('DELETE /api/users/:id routes authenticated users to controller.remove', function() {
    expect(
      routerStub.del.withArgs('/:id', 'authService.isAuthenticated', 'controller.del')
    ).to.have.been.calledOnce
  })

})