import injector from 'inject!./index'

const routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  del: sinon.spy(),
  post: sinon.spy(),
  use: sinon.spy()
}

const RouterStub = sinon.spy(function() { return routerStub })

const provider = {
  setup: sinon.spy(),
  router: {
    routes: function() {}
  }
}

const router = injector({
  'koa-router': RouterStub,
  './local': provider
}).default

describe('Auth router', function() {
  it('instantiates and returns a router', function() {
    expect(RouterStub).to.have.been.calledWithNew
    expect(router).to.be.an.object
  })

  it('routes requests to /auth', function() {
    expect(RouterStub).to.have.been
      .calledWith({prefix: '/auth'})
  })

  it('routes /auth/local', function() {
    expect(routerStub.use).to.have.been
      .calledWith('/local', provider.router.routes())
  })

})