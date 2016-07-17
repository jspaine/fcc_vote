import proxy from 'koa-proxy'

export default function (port) {

  return function *(next) {
    const path = this.path === '/' ? '/index.html' : this.path
    
    if (path.match(/\.js|\.html|\.css/)) {
      yield proxy({ 
        url: `${this.protocol}://${this.hostname}:${port}${path}` 
      })
    }
    yield next
  }
} 

