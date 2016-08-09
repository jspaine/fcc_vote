export const routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  del: sinon.spy(),
  post: sinon.spy(),
  use: sinon.spy(),
  routes: sinon.spy()
}

export const RouterStub = sinon.spy(function() { return routerStub })

export const authStub = {
  isAuthenticated: 'authService.isAuthenticated',
  hasRole(role) {
    return `authService.hasRole(${role})`
  }
}