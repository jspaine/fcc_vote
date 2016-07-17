import koa from './koa'
import mongo from './mongo'

export default {
  koa,
  mongo,
  secret: 'koa-vote'
}