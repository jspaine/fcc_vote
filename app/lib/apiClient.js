import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/fromPromise'

import config from '../config'

const urlRoot = `//${config.host}:${config.port}/`
const methods = ['get', 'post', 'put', 'patch', 'del']

export default new class {
  constructor() {
    this.defaultParams = {}

    for (const method of methods) {
      this[method] = (...args) =>
        this.request(method, ...args)
      this.defaultParams[method] = initDefaultParams(method)
    }
  }

  request(method, path, {params, data} = {}) {
    params = {
      ...this.defaultParams[method],
      ...params
    }
    if (data) params.body = encodeBody(data)
    params.method = method.toUpperCase()

    return Observable.fromPromise(
      fetch(`${urlRoot}${path}`, params).then(res => {
        if (!res.ok) throw res
        if (params.headers &&
            params.headers['Accept'] === 'application/json') {
          return res.json()
        } else {
          return res.text()
        }
      }).catch(err => {
        throw {
          status: err.status,
          text: err.statusText
        }
      })
    )
  }

  addDefaultHeader(header, value, method = methods) {
    if (typeof method === 'string') {
      method = [method]
    }
    for (const m of method) {
      this.defaultParams[m].headers[header] = value
    }
  }

  removeDefaultHeader(header, method = methods) {
    if (typeof method === 'string') {
      method = [method]
    }
    for (const m of method) {
      delete this.defaultParams[m].headers[header]
    }
  }

  getDefaultParams() {
    return this.defaultParams
  }
}

function initDefaultParams(method) {
  const headers = {}
  headers['Accept'] = 'application/json'

  if (method === 'post' || method === 'put' ||
      method === 'patch') {
    headers['Content-Type'] =
      'application/x-www-form-urlencoded'
  }
  return {headers}
}

function encodeBody(data) {
  const parts = Object.keys(data).map(key =>
    `${key}=${encodeURIComponent(data[key])}`
  )
  return parts.join('&')
}