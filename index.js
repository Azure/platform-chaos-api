const server = require('./lib/app')

const app = server({
  isProd: process.env.NODE_ENV === 'production',
  authClientId: process.env.AUTH_CLIENT_ID,
  authAudience: process.env.AUTH_AUDIENCE,
  authIssuer: process.env.AUTH_ISSUER
})

app.listen(process.env.PORT || 3000)
