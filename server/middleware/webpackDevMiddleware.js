import proxy from 'koa-proxy'
import webpackDevServer from 'webpack-dev-server'

export default function (compiler, options, port) {
  new webpackDevServer(compiler, options).listen(port)

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

