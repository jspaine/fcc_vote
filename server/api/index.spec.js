import injector from 'inject!./index'

import {routerStub, RouterStub} from '../lib/testStubs'

const router = injector({
  'koa-router': RouterStub,
  './user': routerStub,
  './poll': routerStub
}).default

describe('Api router', function() {
  it('instantiates and returns a router', function() {
    expect(RouterStub).to.have.been.calledWithNew
    expect(router).to.be.an.object
  })
  
  it('uses user router', function() {
    expect(routerStub.routes).to.have.been.called
    expect(router.use)
      .to.have.been.calledWith('/users', routerStub.routes())
  })

  it('uses poll router', function() {
    expect(routerStub.routes).to.have.been.called
    expect(router.use)
      .to.have.been.calledWith('/polls', routerStub.routes())
  })
})