import mongoose from 'mongoose'

import config from '../config'


export async function initDb() {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(config.db.uri, config.db.options)
  }
}

export async function resetDb() {
  mongoose.models = {}
  mongoose.modelSchemas = {}
  await mongoose.disconnect()
}