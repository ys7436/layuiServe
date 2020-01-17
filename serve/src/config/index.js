const DB_URL = 'mongodb://127.0.0.1:27017/testdb'

const REDIS = {
  host: '127.0.0.1',
  port: '6379'
}

const JWT_SECRET = 'v#9eKZFuboW&%P3lfcbTerHjYOLe$@4U^CqKI@tDYzjMYXh72VfN*R^^dIRLpE!l'
const baseUrl = process.env.NODE_ENV === 'production' ?
'http://www.tomic.com' : 'http://localhost:8080'
export {
  DB_URL,
  REDIS,
  JWT_SECRET,
  baseUrl
}