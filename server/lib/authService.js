import compose from 'koa-compose'

export default {
  isAuthenticated,
  hasRole
}

/**
 * Check if a user is authenticated
 * @return {boolean}
 */
function isAuthenticated(ctx, next) {
  if (ctx.state.user) return next()
  else ctx.status = 401
}

/**
 * Check if a user is authenticated and has required role
 * @param {string} role the role to test for
 * @return {boolean}
 */
function hasRole(role) {
  return compose([
    isAuthenticated, 
    (ctx, next) => {
      if (ctx.state.user.role === role) return next()
      else ctx.status = 403
    }
  ])
}