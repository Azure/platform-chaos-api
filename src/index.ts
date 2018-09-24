// const server = require('./lib/app')
import server from './lib/app'

const app = server({
  authAudience: process.env.AUTH_AUDIENCE,
  authClientId: process.env.AUTH_CLIENT_ID,
  authIssuer: process.env.AUTH_ISSUER,
  isProd: process.env.NODE_ENV === 'production'
})

app.listen(process.env.PORT || 3000)
