import injector from 'inject!./index'

import {routerStub, RouterStub} from '../lib/testStubs'

const authProvider = {
  setup: sinon.spy(),
  router: {
    routes: function() {}
  }
}

const router = injector({
  'koa-router': RouterStub,
  './local': authProvider
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
      .calledWith('/local', authProvider.router.routes())
  })

})