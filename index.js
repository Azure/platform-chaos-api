const server = require('./lib/app')

const app = server({ isProd: false });

app.listen(process.env.PORT || 3000)