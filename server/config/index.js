import merge from 'lodash.merge'

import dev from './dev'
import prod from './prod'
import test from './test'

const config = {
  port: process.env.PORT || 8000,
  host: process.env.HOST || 'localhost',

  db: {
    uri: process.env.MONGODB_URI || 'localhost/koa-vote',
    options: {
      db: { safe: true }
    },
    seed: false
  },
  secrets: {
    token: 'koa-vote'
  },
  useCookie: false
}

switch (process.env.NODE_ENV) {
  case 'test':
    merge(config, test)
    break
  case 'production':
    merge(config, prod)
    break
  default: merge(config, dev)
}

export default config
