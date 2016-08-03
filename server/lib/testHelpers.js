import mongoose from 'mongoose'
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import chaiAsPromised from 'chai-as-promised'
import 'sinon-as-promised'
import supertest from 'supertest-as-promised'

import config from '../config'

global.expect = chai.expect
global.sinon = sinon
global.supertest = supertest

chai.use(sinonChai)
chai.use(chaiAsPromised)

global.initDb = async function() {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(config.db.uri, config.db.options)
  }
}

global.resetDb = async function() {
  mongoose.models = {}
  mongoose.modelSchemas = {}
  if (mongoose.connection.readyState) {
    await mongoose.disconnect()
  }
}