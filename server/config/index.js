import koa from './koa'
import webpack from './webpack'
import mongo from './mongo'

export default {
  koa,
  webpack,
  mongo,
  secret: 'koa-vote'
}