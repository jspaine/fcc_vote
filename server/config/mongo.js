export default {
  uri: process.env.MONGODB_URI || 'localhost/koa-vote',
  options: {
    db: { safe: true }
  },
  seed: process.env.npm_lifecycle_event === 'dev'
}