import fetch from 'node-fetch'
import jsdom from 'jsdom'
import chai from 'chai'
import sinonChai from 'sinon-chai'
import sinon from 'sinon'
import {TestScheduler} from 'rxjs/testing/TestScheduler'
import {ActionsObservable} from 'redux-observable'

const exposedProperties = ['window', 'navigator', 'document']

global.document = jsdom.jsdom('')
global.window = document.defaultView
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property)
    global[property] = document.defaultView[property]
  }
})

global.navigator = {
  userAgent: 'node.js'
}

chai.use(sinonChai)
global.expect = chai.expect
global.sinon = sinon
global.fetch = window.fetch = fetch

global.expectEpic = (epic, api, method,
  {expected, action, response, fetchArgs}) => {
  const testScheduler = new TestScheduler((actual, expected) => {
    // console.log('actual, expected', actual, expected)
    expect(actual).to.deep.equal(expected)
  })

  const action$ = new ActionsObservable(
    testScheduler.createHotObservable(...action)
  )

  const responseSubs = '^!'
  const response$ = testScheduler.createColdObservable(...response)
  const apiStub = sinon.stub(api, method).returns(response$)

  const test$ = epic(action$)
  testScheduler.expectObservable(test$).toBe(...expected)
  testScheduler.flush()

  expect(apiStub).to.have.been.calledOnce
  expect(apiStub).to.have.been.calledWith(...fetchArgs)

  testScheduler.expectSubscriptions(response$.subscriptions)
    .toBe(responseSubs)

  apiStub.restore()
};
