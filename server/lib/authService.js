export default {
  isAuthenticated(ctx, next) {
    if (ctx.state.user) return next()
    else ctx.status = 401
  },
  hasRole(ctx, next) {
    return (role) => {
      if (ctx.state.user.role === role) return next()
      else ctx.status = 403
    }
  }
} 