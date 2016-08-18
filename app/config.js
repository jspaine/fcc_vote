export default {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 8000,
  env: process.env.NODE_ENV || 'development'
}
